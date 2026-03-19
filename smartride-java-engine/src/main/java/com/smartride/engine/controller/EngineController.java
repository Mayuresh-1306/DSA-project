package com.smartride.engine.controller;

import com.smartride.engine.model.*;
import com.smartride.engine.service.MatchingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * ============================================================
 *  EngineController - REST API for the Java Algorithm Engine
 * ============================================================
 *
 *  Endpoints:
 *    POST /api/engine/match   - Match rider with best driver
 *    POST /api/engine/route   - Compute shortest path (A-star/Dijkstra)
 *    POST /api/engine/price   - Calculate dynamic price
 *    GET  /api/engine/health  - Health check with graph stats
 *
 *  These endpoints are called by the Node.js API Gateway
 *  via Axios HTTP requests. The frontend never calls Java directly.
 * ============================================================
 */
@RestController
@RequestMapping("/api/engine")
@CrossOrigin(origins = "*")
public class EngineController {

    private final MatchingService matchingService;

    public EngineController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    /**
     * POST /api/engine/match
     *
     * Called by Node.js when a rider requests a ride.
     * Receives: pickupNode, dropoffNode, list of available drivers
     * Returns:  matched driver, route, price, ETA
     */
    @PostMapping("/match")
    public ResponseEntity<?> matchDriver(@RequestBody MatchRequest request) {
        try {
            MatchResult result = matchingService.matchDriver(request);

            if (result.getMatchedDriverId() == null) {
                return ResponseEntity.status(404).body(Map.of(
                        "error", "No suitable driver could be matched",
                        "suggestion", "Try expanding search radius or wait for more drivers"
                ));
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Engine matching failed",
                    "details", e.getMessage()
            ));
        }
    }

    /**
     * POST /api/engine/route
     *
     * Compute the shortest path between two city nodes.
     * Uses A* algorithm (falls back to Dijkstra if needed).
     */
    @PostMapping("/route")
    public ResponseEntity<?> computeRoute(@RequestBody RouteRequest request) {
        try {
            PathResult result = matchingService.computeRoute(
                    request.getSource(), request.getDestination()
            );

            if (!result.isReachable()) {
                return ResponseEntity.status(404).body(Map.of(
                        "error", "No route found between nodes",
                        "source", request.getSource(),
                        "destination", request.getDestination()
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "path", result.getPath(),
                    "totalDistance", result.getTotalDistance(),
                    "algorithm", "A* with Haversine heuristic"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Route computation failed",
                    "details", e.getMessage()
            ));
        }
    }

    /**
     * POST /api/engine/price
     *
     * Calculate dynamic pricing for a ride.
     */
    @PostMapping("/price")
    public ResponseEntity<?> calculatePrice(@RequestBody PriceRequest request) {
        try {
            Map<String, Object> priceData = matchingService.calculatePrice(
                    request.getDistance(),
                    request.getActiveRidesInZone(),
                    request.getAvailableDriversInZone()
            );
            return ResponseEntity.ok(priceData);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Pricing calculation failed",
                    "details", e.getMessage()
            ));
        }
    }

    /**
     * GET /api/engine/health
     *
     * Health check endpoint - confirms engine is running
     * and returns graph statistics.
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> stats = matchingService.getGraphStats();
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "SmartRide Java Algorithm Engine is running",
                "graph", stats
        ));
    }
}
