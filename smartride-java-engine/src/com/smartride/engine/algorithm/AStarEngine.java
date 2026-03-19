package com.smartride.engine.algorithm;

import com.smartride.engine.graph.CityGraph;

import java.util.*;

/**
 * ============================================================
 *  A* Algorithm - Heuristic-Guided Shortest Path
 * ============================================================
 *
 *  WHY A* OVER DIJKSTRA?
 *  A* uses a heuristic h(n) to GUIDE the search toward the
 *  destination, exploring 60-80% fewer nodes while still
 *  guaranteeing the optimal path.
 *
 *  KEY FORMULA:
 *    f(n) = g(n) + h(n)
 *    g(n) = actual distance from source to n (same as Dijkstra)
 *    h(n) = estimated distance from n to destination (heuristic)
 *
 *  WHY HAVERSINE as heuristic?
 *  Great-circle distance between GPS points is:
 *    1. ADMISSIBLE: straight-line <= road distance (never overestimates)
 *    2. CONSISTENT: h(n) <= cost(n,n') + h(n')
 *  Both properties guarantee A* finds the OPTIMAL path.
 *
 *  PERFORMANCE vs DIJKSTRA:
 *    Metric              | Dijkstra     | A*
 *    --------------------|--------------|-------------
 *    Nodes explored      | All <= dist  | ~20-40% of V
 *    Worst-case time     | O((V+E)logV) | Same
 *    Avg-case time       | Same         | 2-5x faster
 *    Guarantees optimal? | Yes          | Yes (with admissible h)
 *
 *  INTERVIEW INSIGHT:
 *  "A* with haversine heuristic is the industry standard for road
 *   routing - Google Maps, Uber, Lyft all use variants of A*.
 *   The heuristic prunes 60-80% of nodes vs Dijkstra on city grids."
 *
 *  TIME:  O((V+E) * log V) worst case, much better in practice
 *  SPACE: O(V)
 * ============================================================
 */
public class AStarEngine {

    private final CityGraph graph;

    public AStarEngine(CityGraph graph) {
        this.graph = graph;
    }

    /**
     * Haversine formula - distance between two GPS points in km.
     * WHY Haversine? Accounts for Earth's curvature. Accurate for
     * short distances (< 500km) which covers all city rides.
     */
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Compute heuristic h(n) = Haversine distance from node to destination.
     */
    private double heuristic(String node, String destination) {
        double[] coordA = graph.getCoordinates(node);
        double[] coordB = graph.getCoordinates(destination);
        if (coordA == null || coordB == null) return 0.0;
        return haversine(coordA[0], coordA[1], coordB[0], coordB[1]);
    }

    /**
     * Find shortest path using A* algorithm.
     */
    public PathResult findShortestPath(String source, String destination) {

        if (!graph.hasNode(source) || !graph.hasNode(destination)) {
            return PathResult.unreachable();
        }
        if (source.equals(destination)) {
            return new PathResult(List.of(source), 0.0);
        }

        // g(n) = actual cost from source to n
        Map<String, Double> gScore = new HashMap<>();
        // f(n) = g(n) + h(n) - estimated total cost
        Map<String, Double> fScore = new HashMap<>();
        Map<String, String> parent = new HashMap<>();
        Set<String> closedSet = new HashSet<>();

        // WHY PriorityQueue with fScore? A* orders by f(n), not just g(n)
        PriorityQueue<String> openSet = new PriorityQueue<>(
                Comparator.comparingDouble(n -> fScore.getOrDefault(n, Double.MAX_VALUE))
        );

        gScore.put(source, 0.0);
        fScore.put(source, heuristic(source, destination));
        openSet.offer(source);

        int nodesExplored = 0;

        while (!openSet.isEmpty()) {
            String current = openSet.poll();
            nodesExplored++;

            if (closedSet.contains(current)) continue;
            closedSet.add(current);

            // Reached destination - reconstruct path
            if (current.equals(destination)) {
                List<String> path = reconstructPath(parent, destination);
                double prunedPct = (1.0 - (double) nodesExplored / graph.getNodeCount()) * 100;
                System.out.printf("  [A*] Path found! Explored %d/%d nodes (%.0f%% pruned)%n",
                        nodesExplored, graph.getNodeCount(), prunedPct);
                return new PathResult(path, gScore.get(destination));
            }

            // Explore neighbors
            for (CityGraph.Edge edge : graph.getNeighbors(current)) {
                String neighbor = edge.getTargetNode();
                if (closedSet.contains(neighbor)) continue;

                double tentativeG = gScore.get(current) + edge.getWeight();

                // WHY this check? Only update if we found a BETTER path
                if (tentativeG < gScore.getOrDefault(neighbor, Double.MAX_VALUE)) {
                    parent.put(neighbor, current);
                    gScore.put(neighbor, tentativeG);
                    fScore.put(neighbor, tentativeG + heuristic(neighbor, destination));
                    openSet.offer(neighbor);
                }
            }
        }

        return PathResult.unreachable();
    }

    private List<String> reconstructPath(Map<String, String> parent, String dest) {
        List<String> path = new ArrayList<>();
        String current = dest;
        while (current != null) {
            path.add(current);
            current = parent.get(current);
        }
        Collections.reverse(path);
        return path;
    }
}
