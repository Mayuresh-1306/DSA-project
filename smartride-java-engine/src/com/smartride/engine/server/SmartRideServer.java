package com.smartride.engine.server;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import com.smartride.engine.algorithm.*;
import com.smartride.engine.data.GraphSeeder;
import com.smartride.engine.graph.CityGraph;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.*;

/**
 * ============================================================
 *  SmartRideServer - Pure Java HTTP Microservice
 * ============================================================
 *
 *  WHY com.sun.net.httpserver.HttpServer?
 *  It's built into the JDK since Java 6. No external dependencies.
 *  Perfect for microservices that only need to expose REST endpoints.
 *
 *  ENDPOINTS:
 *    POST /api/engine/match   - Match rider with best driver
 *    POST /api/engine/route   - Compute shortest path (A-star or Dijkstra)
 *    POST /api/engine/price   - Calculate dynamic price
 *    GET  /api/engine/health  - Health check with graph stats
 *
 *  ARCHITECTURE:
 *  Node.js (Express) -> HTTP POST with JSON -> This Java Server
 *  This server parses JSON, runs DSA algorithms, returns JSON
 * ============================================================
 */
public class SmartRideServer {

    private static CityGraph cityGraph;
    private static GreedyMatcher greedyMatcher;
    private static AStarEngine aStarEngine;
    private static DijkstraEngine dijkstraEngine;
    private static DynamicPricingEngine pricingEngine;

    public static void main(String[] args) throws IOException {
        // WHY allow port override? So the user can avoid port conflicts
        int port = 8080;
        if (args.length > 0) {
            try { port = Integer.parseInt(args[0]); }
            catch (NumberFormatException e) { /* use default */ }
        }

        // Step 1: Load the city graph into memory
        System.out.println("\n====================================================");
        System.out.println("  SmartRide - Pure Java Algorithm Engine");
        System.out.println("====================================================");
        cityGraph = GraphSeeder.buildCityGraph();

        // Step 2: Initialize all algorithm engines
        greedyMatcher = new GreedyMatcher(cityGraph);
        aStarEngine = new AStarEngine(cityGraph);
        dijkstraEngine = new DijkstraEngine(cityGraph);
        pricingEngine = new DynamicPricingEngine();
        System.out.println("[INIT] All algorithm engines initialized");

        // Step 3: Create HTTP server (built-in JDK, NO frameworks)
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // WHY separate contexts? Clean REST-like routing, each handler is isolated
        server.createContext("/api/engine/match",  SmartRideServer::handleMatch);
        server.createContext("/api/engine/route",  SmartRideServer::handleRoute);
        server.createContext("/api/engine/price",  SmartRideServer::handlePrice);
        server.createContext("/api/engine/health", SmartRideServer::handleHealth);

        server.setExecutor(null); // default single-threaded executor
        server.start();

        System.out.println("[STARTED] Java Engine running on http://localhost:" + port);
        System.out.println("[READY] Waiting for requests from Node.js...");
        System.out.println("\n  Endpoints:");
        System.out.println("    POST /api/engine/match");
        System.out.println("    POST /api/engine/route");
        System.out.println("    POST /api/engine/price");
        System.out.println("    GET  /api/engine/health");
        System.out.println("====================================================\n");
    }

    // ──────────────────────────────────────────────────────
    //  POST /api/engine/match
    //  Called by Node.js when rider requests a ride.
    //  Receives: { pickupNode, dropoffNode, availableDrivers }
    //  Returns:  { matchedDriverId, route, price, ETA }
    // ──────────────────────────────────────────────────────
    private static void handleMatch(HttpExchange exchange) throws IOException {
        setCorsHeaders(exchange);
        if (handlePreflight(exchange)) return;

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, Map.of("error", "Method not allowed"));
            return;
        }

        try {
            String body = JsonHelper.readBody(exchange.getRequestBody());
            Map<String, Object> request = JsonHelper.parseObject(body);

            String pickupNode = (String) request.get("pickupNode");
            String dropoffNode = (String) request.get("dropoffNode");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> drivers = (List<Map<String, Object>>)
                    (List<?>) request.get("availableDrivers");

            Map<String, Object> result = greedyMatcher.matchBestDriver(pickupNode, dropoffNode, drivers);

            if (result.containsKey("error")) {
                sendJson(exchange, 404, result);
            } else {
                sendJson(exchange, 200, result);
            }
        } catch (Exception e) {
            sendJson(exchange, 500, Map.of("error", "Engine match failed", "details", e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────
    //  POST /api/engine/route
    //  Compute shortest path between two city nodes.
    //  Uses A* algorithm (falls back to Dijkstra).
    // ──────────────────────────────────────────────────────
    private static void handleRoute(HttpExchange exchange) throws IOException {
        setCorsHeaders(exchange);
        if (handlePreflight(exchange)) return;

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, Map.of("error", "Method not allowed"));
            return;
        }

        try {
            String body = JsonHelper.readBody(exchange.getRequestBody());
            Map<String, Object> request = JsonHelper.parseObject(body);

            String source = (String) request.get("source");
            String destination = (String) request.get("destination");

            // Try A* first (faster), fall back to Dijkstra
            PathResult result = aStarEngine.findShortestPath(source, destination);
            if (!result.isReachable()) {
                result = dijkstraEngine.findShortestPath(source, destination);
            }

            if (!result.isReachable()) {
                sendJson(exchange, 404, Map.of("error", "No route found", "source", source, "destination", destination));
            } else {
                sendJson(exchange, 200, Map.of(
                        "path", result.getPath(),
                        "totalDistance", result.getTotalDistance(),
                        "algorithm", "A* with Haversine heuristic"
                ));
            }
        } catch (Exception e) {
            sendJson(exchange, 500, Map.of("error", "Route failed", "details", e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────
    //  POST /api/engine/price
    //  Calculate dynamic surge pricing.
    // ──────────────────────────────────────────────────────
    private static void handlePrice(HttpExchange exchange) throws IOException {
        setCorsHeaders(exchange);
        if (handlePreflight(exchange)) return;

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, Map.of("error", "Method not allowed"));
            return;
        }

        try {
            String body = JsonHelper.readBody(exchange.getRequestBody());
            Map<String, Object> request = JsonHelper.parseObject(body);

            double distance = ((Number) request.get("distance")).doubleValue();
            int activeRides = ((Number) request.get("activeRidesInZone")).intValue();
            int availableDrivers = ((Number) request.get("availableDriversInZone")).intValue();

            double surge = pricingEngine.getSurgeMultiplier(activeRides, availableDrivers);
            double price = pricingEngine.calculatePrice(distance, surge);

            sendJson(exchange, 200, Map.of(
                    "distance", distance,
                    "surgeMultiplier", surge,
                    "price", price,
                    "baseFare", pricingEngine.getBaseFare(),
                    "perKmRate", pricingEngine.getPerKmRate()
            ));
        } catch (Exception e) {
            sendJson(exchange, 500, Map.of("error", "Pricing failed", "details", e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────
    //  GET /api/engine/health
    //  Health check with graph statistics.
    // ──────────────────────────────────────────────────────
    private static void handleHealth(HttpExchange exchange) throws IOException {
        setCorsHeaders(exchange);
        if (handlePreflight(exchange)) return;

        sendJson(exchange, 200, Map.of(
                "status", "UP",
                "message", "SmartRide Pure Java Engine is running",
                "graph", Map.of(
                        "nodes", cityGraph.getNodeCount(),
                        "edges", cityGraph.getEdgeCount() / 2
                ),
                "engine", "Pure Java (com.sun.net.httpserver) - No frameworks"
        ));
    }

    // =================== HELPER METHODS ===================

    private static void sendJson(HttpExchange exchange, int statusCode, Map<String, Object> data) throws IOException {
        String json = JsonHelper.toJson(data);
        byte[] bytes = json.getBytes("UTF-8");
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static boolean handlePreflight(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return true;
        }
        return false;
    }
}
