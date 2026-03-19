package com.smartride.engine.service;

import com.smartride.engine.algorithm.*;
import com.smartride.engine.data.GraphSeeder;
import com.smartride.engine.graph.CityGraph;
import com.smartride.engine.model.*;

import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * ============================================================
 *  MatchingService - Orchestration Layer
 * ============================================================
 *
 *  This service ties together all DSA components:
 *    GraphSeeder -> CityGraph -> A-star/Dijkstra -> DriverHeap -> GreedyMatcher
 *
 *  It is the single entry point called by the REST controller.
 *  In a real system, this would also handle:
 *    - Caching popular routes (Redis)
 *    - Circuit breaker for external calls
 *    - Metrics/logging (Prometheus, Grafana)
 * ============================================================
 */
@Service
public class MatchingService {

    private final CityGraph cityGraph;
    private final GreedyMatcher greedyMatcher;
    private final DijkstraEngine dijkstraEngine;
    private final AStarEngine aStarEngine;
    private final DynamicPricingEngine pricingEngine;

    public MatchingService(GraphSeeder graphSeeder) {
        this.cityGraph = graphSeeder.getCityGraph();
        this.greedyMatcher = new GreedyMatcher(cityGraph);
        this.dijkstraEngine = new DijkstraEngine(cityGraph);
        this.aStarEngine = new AStarEngine(cityGraph);
        this.pricingEngine = new DynamicPricingEngine();
    }

    /**
     * Full ride matching pipeline:
     * 1. Find nearest drivers via MinHeap
     * 2. Compute route via A*
     * 3. Calculate dynamic price
     * 4. Return optimal match
     */
    public MatchResult matchDriver(MatchRequest request) {
        System.out.println("\n[MatchingService] Received match request for ride: " + request.getRideId());
        return greedyMatcher.matchBestDriver(request);
    }

    /**
     * Compute shortest route between two nodes using A*.
     */
    public PathResult computeRoute(String source, String destination) {
        System.out.printf("\n[MatchingService] Route request: %s -> %s\n", source, destination);

        // Try A* first (faster), fall back to Dijkstra
        PathResult aStarResult = aStarEngine.findShortestPath(source, destination);
        if (aStarResult.isReachable()) {
            return aStarResult;
        }

        System.out.println("  [WARN] A* failed, falling back to Dijkstra...");
        return dijkstraEngine.findShortestPath(source, destination);
    }

    /**
     * Calculate price for a given distance and zone demand.
     */
    public Map<String, Object> calculatePrice(double distance, int activeRides, int availableDrivers) {
        double surge = pricingEngine.getSurgeMultiplier(activeRides, availableDrivers);
        double price = pricingEngine.calculatePrice(distance, surge);

        return Map.of(
                "distance", distance,
                "surgeMultiplier", surge,
                "price", price,
                "baseFare", 30.0,
                "perKmRate", 12.0
        );
    }

    /**
     * Get graph stats for health check.
     */
    public Map<String, Object> getGraphStats() {
        return Map.of(
                "nodes", cityGraph.getNodeCount(),
                "edges", cityGraph.getEdgeCount() / 2,
                "engine", "SmartRide Java DSA Engine v1.0"
        );
    }
}
