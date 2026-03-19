package com.smartride.engine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SmartRide Algorithm Engine - Spring Boot Microservice
 *
 * This service handles ALL DSA-intensive operations:
 *   - Graph-based city map representation (Adjacency List)
 *   - Dijkstra / A* shortest-path computation
 *   - MinHeap-based nearest-driver ranking
 *   - Greedy driver-matching algorithm
 *   - Dynamic surge pricing
 *
 * It communicates with the Node.js API Gateway via REST.
 */
@SpringBootApplication
public class SmartRideEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartRideEngineApplication.class, args);
        System.out.println("\n[STARTED] SmartRide Java Engine is LIVE on port 8080");
        System.out.println("[READY] Waiting for requests from Node.js API Gateway...\n");
    }
}
