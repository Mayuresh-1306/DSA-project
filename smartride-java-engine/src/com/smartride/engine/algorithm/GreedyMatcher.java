package com.smartride.engine.algorithm;

import com.smartride.engine.graph.CityGraph;

import java.util.*;

/**
 * ============================================================
 *  GreedyMatcher - Optimal Driver Assignment Algorithm
 * ============================================================
 *
 *  WHY GREEDY?
 *  For N available rides and M drivers, the globally optimal
 *  assignment uses the Hungarian Algorithm at O(N^3). But for
 *  real-time single-ride matching, GREEDY gives 95%+ quality
 *  at O(D log D) per ride - the standard industry trade-off.
 *
 *  ALGORITHM STEPS:
 *  1. Compute Haversine distance from each driver to pickup
 *  2. Build DriverCandidate objects with composite scores
 *  3. Insert all candidates into a MinHeap
 *  4. Extract the driver with the lowest (best) score
 *  5. Compute pickup-to-dropoff route using A*
 *  6. Calculate surge-aware dynamic pricing
 *  7. Return complete match result as Map
 *
 *  TIME:  O(D log D) for heap + O((V+E) log V) for A*
 *  SPACE: O(D + V)
 *
 *  INTERVIEW INSIGHT:
 *  "Our greedy matcher is O(D log D + (V+E) log V) per ride.
 *   For global assignment of K rides to N drivers, the Hungarian
 *   Algorithm costs O(N^3), but greedy gives 95%+ quality at
 *   O(N log N) - the standard Uber/Lyft trade-off."
 * ============================================================
 */
public class GreedyMatcher {

    private final AStarEngine pathEngine;
    private final DynamicPricingEngine pricingEngine;
    private final CityGraph graph;

    public GreedyMatcher(CityGraph graph) {
        this.graph = graph;
        this.pathEngine = new AStarEngine(graph);
        this.pricingEngine = new DynamicPricingEngine();
    }

    /**
     * Match the best available driver for a ride request.
     *
     * @param pickupNode   graph node ID for pickup
     * @param dropoffNode  graph node ID for dropoff
     * @param drivers      list of available drivers (each is a Map with id, rating, coordinates)
     * @return Map containing matched driver, route, price, ETA
     */
    public Map<String, Object> matchBestDriver(String pickupNode, String dropoffNode,
                                                List<Map<String, Object>> drivers) {

        if (drivers == null || drivers.isEmpty()) {
            return errorResult("No drivers available");
        }

        double[] pickupCoords = graph.getCoordinates(pickupNode);
        if (pickupCoords == null) {
            return errorResult("Pickup node not found in city graph");
        }

        System.out.println("\n===============================================");
        System.out.println("  GREEDY DRIVER MATCHING ALGORITHM");
        System.out.println("===============================================");
        System.out.printf("  Ride: %s -> %s%n", pickupNode, dropoffNode);
        System.out.printf("  Candidates: %d drivers%n%n", drivers.size());

        // STEP 1-3: Build MinHeap of scored candidates
        DriverHeap driverHeap = new DriverHeap();

        for (Map<String, Object> driver : drivers) {
            String id = (String) driver.get("id");
            double rating = toDouble(driver.get("rating"));
            List<?> coordList = (List<?>) driver.get("coordinates");
            double[] coords = new double[]{toDouble(coordList.get(0)), toDouble(coordList.get(1))};

            // WHY Haversine here? Quick GPS distance without full graph traversal
            double dist = haversine(coords[1], coords[0], pickupCoords[0], pickupCoords[1]);

            DriverCandidate candidate = new DriverCandidate(id, dist, rating, coords);
            System.out.printf("  [CANDIDATE] %s | dist=%.2fkm | rating=%.1f | score=%.4f%n",
                    id, dist, rating, candidate.getScore());
            driverHeap.insert(candidate);
        }

        // STEP 4: Extract BEST driver (lowest composite score)
        DriverCandidate bestDriver = driverHeap.extractBest();
        System.out.printf("%n  >> SELECTED: %s (score=%.4f)%n", bestDriver.getDriverId(), bestDriver.getScore());

        // STEP 5: Compute route using A*
        System.out.println("\n  [ROUTE] Computing via A* algorithm...");
        PathResult route = pathEngine.findShortestPath(pickupNode, dropoffNode);

        if (!route.isReachable()) {
            // Fallback to straight-line estimate
            double[] dropCoords = graph.getCoordinates(dropoffNode);
            double fallback = haversine(pickupCoords[0], pickupCoords[1], dropCoords[0], dropCoords[1]);
            route = new PathResult(List.of(pickupNode, dropoffNode), fallback);
        }

        System.out.printf("  [ROUTE] %s (%.2f km)%n", route.getPath(), route.getTotalDistance());

        // STEP 6: Dynamic Pricing
        double surge = pricingEngine.getSurgeMultiplier(drivers.size(), drivers.size());
        double price = pricingEngine.calculatePrice(route.getTotalDistance(), surge);
        double eta = (route.getTotalDistance() / 30.0) * 60.0; // avg 30 km/h city speed

        System.out.printf("  [PRICE] Rs.%.2f (surge: %.1fx)%n", price, surge);
        System.out.printf("  [ETA] %.1f minutes%n", eta);
        System.out.println("===============================================\n");

        // STEP 7: Build result map (to be serialized as JSON)
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("matchedDriverId", bestDriver.getDriverId());
        result.put("routeDistance", route.getTotalDistance());
        result.put("routePath", route.getPath());
        result.put("optimizedPrice", price);
        result.put("surgeMultiplier", surge);
        result.put("driverDistanceToPickup", bestDriver.getDistanceToPickup());
        result.put("driverScore", bestDriver.getScore());
        result.put("estimatedTimeMinutes", Math.round(eta * 10.0) / 10.0);
        return result;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private Map<String, Object> errorResult(String reason) {
        System.out.println("  [ERROR] " + reason);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("error", reason);
        return result;
    }

    private double toDouble(Object val) {
        if (val instanceof Number) return ((Number) val).doubleValue();
        return Double.parseDouble(val.toString());
    }
}
