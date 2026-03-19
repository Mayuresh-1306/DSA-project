package com.smartride.engine.algorithm;

import com.smartride.engine.graph.CityGraph;
import com.smartride.engine.model.Edge;
import com.smartride.engine.model.PathResult;

import java.util.*;

/**
 * ============================================================
 *  A* Algorithm - Heuristic-Guided Shortest Path
 * ============================================================
 *
 *  WHAT IT DOES:
 *  An improved version of Dijkstra that uses a heuristic
 *  function h(n) to guide the search toward the destination,
 *  exploring far fewer nodes while guaranteeing optimality.
 *
 *  HOW IT WORKS:
 *  Same as Dijkstra, but the priority queue uses:
 *    f(n) = g(n) + h(n)
 *  Where:
 *    g(n) = actual distance from source to n (same as Dijkstra)
 *    h(n) = estimated distance from n to destination (heuristic)
 *
 *  HEURISTIC: Haversine Distance
 *  We use the great-circle distance between n and destination
 *  as our heuristic. This is:
 *    - ADMISSIBLE: never overestimates (straight-line <= road distance)
 *    - CONSISTENT: h(n) <= cost(n,n') + h(n')
 *  Both properties guarantee A* finds the optimal path.
 *
 *  WHY A* over Dijkstra?
 *    Metric              | Dijkstra     | A*
 *    --------------------|--------------|-------------
 *    Nodes explored      | All <= dist  | ~20-40% of V
 *    Worst-case time     | O((V+E)logV) | Same
 *    Avg-case time       | Same         | 2-5x faster
 *    Guarantees optimal? | Yes          | Yes
 *
 *  INTERVIEW INSIGHT:
 *  "A* with haversine heuristic is the industry standard for road
 *   routing -- Google Maps, Uber, Lyft all use variants of A*.
 *   The heuristic prunes 60-80% of nodes vs Dijkstra on city grids."
 *
 *  TIME COMPLEXITY:  O( (V + E) * log V ) worst case
 *  SPACE COMPLEXITY: O(V)
 * ============================================================
 */
public class AStarEngine {

    private final CityGraph graph;

    public AStarEngine(CityGraph graph) {
        this.graph = graph;
    }

    /**
     * Haversine formula - distance between two GPS points on Earth.
     * Returns distance in kilometers.
     *
     * This is our ADMISSIBLE heuristic: straight-line distance
     * is always <= actual road distance.
     */
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Compute the heuristic h(n) from a node to the destination.
     * Uses GPS coordinates stored in the graph.
     */
    private double heuristic(String node, String destination) {
        double[] coordA = graph.getCoordinates(node);
        double[] coordB = graph.getCoordinates(destination);
        if (coordA == null || coordB == null) return 0.0;
        return haversine(coordA[0], coordA[1], coordB[0], coordB[1]);
    }

    /**
     * Find the shortest path using A*.
     *
     * @param source      Starting node ID
     * @param destination Target node ID
     * @return PathResult with optimal path and distance
     */
    public PathResult findShortestPath(String source, String destination) {

        if (!graph.hasNode(source) || !graph.hasNode(destination)) {
            return new PathResult(Collections.emptyList(), Double.MAX_VALUE);
        }
        if (source.equals(destination)) {
            return new PathResult(List.of(source), 0.0);
        }

        // g(n) = actual cost from source to n
        Map<String, Double> gScore = new HashMap<>();

        // f(n) = g(n) + h(n) -- estimated total cost through n
        Map<String, Double> fScore = new HashMap<>();

        // Parent tracking for path reconstruction
        Map<String, String> parent = new HashMap<>();

        Set<String> closedSet = new HashSet<>();

        // MinHeap ordered by f-score
        PriorityQueue<String> openSet = new PriorityQueue<>(
                Comparator.comparingDouble(node -> fScore.getOrDefault(node, Double.MAX_VALUE))
        );

        // Initialize
        gScore.put(source, 0.0);
        fScore.put(source, heuristic(source, destination));
        openSet.offer(source);

        int nodesExplored = 0;

        while (!openSet.isEmpty()) {
            String current = openSet.poll();
            nodesExplored++;

            // Skip if already finalized
            if (closedSet.contains(current)) continue;
            closedSet.add(current);

            // Reached destination -- reconstruct and return
            if (current.equals(destination)) {
                List<String> path = reconstructPath(parent, destination);
                System.out.printf("  [A*] Found path! Explored %d/%d nodes (%.1f%% pruned)%n",
                        nodesExplored, graph.getNodeCount(),
                        (1.0 - (double) nodesExplored / graph.getNodeCount()) * 100);
                return new PathResult(path, gScore.get(destination));
            }

            // Explore neighbors
            for (Edge edge : graph.getNeighbors(current)) {
                String neighbor = edge.getTargetNode();
                if (closedSet.contains(neighbor)) continue;

                double tentativeG = gScore.get(current) + edge.getWeight();

                if (tentativeG < gScore.getOrDefault(neighbor, Double.MAX_VALUE)) {
                    // Better path found
                    parent.put(neighbor, current);
                    gScore.put(neighbor, tentativeG);
                    fScore.put(neighbor, tentativeG + heuristic(neighbor, destination));
                    openSet.offer(neighbor);
                }
            }
        }

        // Destination unreachable
        return new PathResult(Collections.emptyList(), Double.MAX_VALUE);
    }

    /**
     * Reconstruct the path by following parent pointers.
     */
    private List<String> reconstructPath(Map<String, String> parent, String destination) {
        List<String> path = new ArrayList<>();
        String current = destination;
        while (current != null) {
            path.add(current);
            current = parent.get(current);
        }
        Collections.reverse(path);
        return path;
    }
}
