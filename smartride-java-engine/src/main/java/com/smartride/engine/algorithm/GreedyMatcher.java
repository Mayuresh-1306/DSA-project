package com.smartride.engine.algorithm;

import com.smartride.engine.graph.CityGraph;
import com.smartride.engine.model.DriverCandidate;
import com.smartride.engine.model.MatchRequest;
import com.smartride.engine.model.MatchResult;
import com.smartride.engine.model.PathResult;

import java.util.Collections;
import java.util.List;

/**
 * ============================================================
 *  GreedyMatcher - Optimal Driver Assignment Algorithm
 * ============================================================
 *
 *  DSA CONCEPT: Greedy Algorithm + MinHeap
 *
 *  ALGORITHM STEPS:
 *  1. Compute distance from each driver to pickup node (Haversine)
 *  2. Build DriverCandidate objects with composite scores
 *  3. Insert all candidates into a MinHeap
 *  4. Extract the driver with the lowest (best) score
 *  5. Compute the pickup-to-dropoff route using A*
 *  6. Calculate surge-aware dynamic pricing
 *  7. Return the complete MatchResult
 *
 *  TIME COMPLEXITY:
 *    O(D log D) for heap build + O((V+E) log V) for A* pathfinding
 *    Where D = number of candidate drivers
 *
 *  SPACE COMPLEXITY: O(D + V)
 *
 *  INTERVIEW INSIGHT:
 *  "Our greedy matcher is O(D log D + (V+E) log V) per ride.
 *   For the optimal global assignment of K rides to N drivers,
 *   you would use the Hungarian Algorithm at O(N^3), but greedy gives
 *   95%+ quality at O(N log N) -- the standard industry trade-off."
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
     * @param request    Contains pickupNode, dropoffNode, and list of available drivers
     * @return MatchResult with the optimal driver, route, and price
     */
    public MatchResult matchBestDriver(MatchRequest request) {
        List<MatchRequest.DriverInfo> drivers = request.getAvailableDrivers();

        if (drivers == null || drivers.isEmpty()) {
            return createEmptyResult("No drivers available");
        }

        System.out.println("\n===============================================");
        System.out.println("  GREEDY DRIVER MATCHING ALGORITHM");
        System.out.println("===============================================");
        System.out.printf("  Ride: %s -> %s%n", request.getPickupNode(), request.getDropoffNode());
        System.out.printf("  Candidates: %d drivers%n%n", drivers.size());

        // -- STEP 1: Compute distance from each driver to pickup --
        double[] pickupCoords = graph.getCoordinates(request.getPickupNode());
        if (pickupCoords == null) {
            return createEmptyResult("Pickup node not found in graph");
        }

        // -- STEP 2: Build DriverCandidates with composite scores --
        DriverHeap driverHeap = new DriverHeap();

        for (MatchRequest.DriverInfo driver : drivers) {
            double[] driverCoords = driver.getCoordinates();
            // Haversine distance from driver to pickup
            double dist = haversine(
                    driverCoords[1], driverCoords[0],  // [lng, lat] -> lat, lng
                    pickupCoords[0], pickupCoords[1]
            );

            DriverCandidate candidate = new DriverCandidate(
                    driver.getId(), dist, driver.getRating(), driverCoords
            );

            System.out.printf("  [CANDIDATE] %s | dist=%.2fkm | rating=%.1f | score=%.4f%n",
                    driver.getId(), dist, driver.getRating(), candidate.getScore());

            // -- STEP 3: Insert into MinHeap --
            driverHeap.insert(candidate);
        }

        // -- STEP 4: Extract the BEST driver (lowest score) --
        DriverCandidate bestDriver = driverHeap.extractBest();
        System.out.printf("%n  [SELECTED] %s (score=%.4f)%n", bestDriver.getDriverId(), bestDriver.getScore());

        // -- STEP 5: Compute route using A* Algorithm --
        System.out.println("\n  [ROUTE] Computing shortest route via A*...");
        PathResult route = pathEngine.findShortestPath(
                request.getPickupNode(), request.getDropoffNode()
        );

        if (!route.isReachable()) {
            System.out.println("  [WARN] No route found, falling back to Haversine estimate");
            double fallbackDist = haversine(
                    pickupCoords[0], pickupCoords[1],
                    graph.getCoordinates(request.getDropoffNode())[0],
                    graph.getCoordinates(request.getDropoffNode())[1]
            );
            route = new PathResult(List.of(request.getPickupNode(), request.getDropoffNode()), fallbackDist);
        }

        System.out.printf("  [ROUTE] Path: %s (%.2f km)%n", route.getPath(), route.getTotalDistance());

        // -- STEP 6: Dynamic Pricing --
        double surgeMultiplier = pricingEngine.getSurgeMultiplier(drivers.size(), drivers.size());
        double price = pricingEngine.calculatePrice(route.getTotalDistance(), surgeMultiplier);
        double etaMinutes = (route.getTotalDistance() / 30.0) * 60.0; // avg 30 km/h city

        System.out.printf("  [PRICE] Rs.%.2f (surge: %.1fx)%n", price, surgeMultiplier);
        System.out.printf("  [ETA] %.1f minutes%n", etaMinutes);
        System.out.println("===============================================\n");

        // -- STEP 7: Build and return MatchResult --
        return new MatchResult(
                bestDriver.getDriverId(),
                route.getTotalDistance(),
                route.getPath(),
                price,
                surgeMultiplier,
                bestDriver.getDistanceToPickup(),
                bestDriver.getScore(),
                etaMinutes
        );
    }

    /**
     * Haversine distance between two GPS points (in km).
     */
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private MatchResult createEmptyResult(String reason) {
        System.out.println("  [ERROR] Match failed: " + reason);
        return new MatchResult(null, 0, Collections.emptyList(), 0, 1.0, 0, 0, 0);
    }
}
