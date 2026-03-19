package com.smartride.engine.algorithm;

import com.smartride.engine.graph.CityGraph;
import com.smartride.engine.model.Edge;
import com.smartride.engine.model.PathResult;

import java.util.*;

/**
 * ============================================================
 *  Dijkstra's Algorithm - Single-Source Shortest Path
 * ============================================================
 *
 *  WHAT IT DOES:
 *  Given a weighted graph with non-negative edge weights,
 *  finds the shortest path from a source to a destination.
 *
 *  HOW IT WORKS:
 *  1. Initialize: dist[source]=0, dist[all others]=INFINITY
 *  2. Use a MinHeap (PriorityQueue) ordered by distance
 *  3. Extract node with smallest distance
 *  4. For each neighbor: if dist[current] + edgeWeight < dist[neighbor],
 *     update dist[neighbor] and add to heap (relaxation)
 *  5. Repeat until destination is extracted or heap is empty
 *
 *  WHY Dijkstra and not BFS?
 *  BFS only works for unweighted graphs. Our city roads have
 *  different lengths (weights), so we need Dijkstra.
 *
 *  TIME COMPLEXITY:  O( (V + E) * log V )
 *    - Each node is extracted from the heap at most once -> O(V log V)
 *    - Each edge causes at most one heap insertion       -> O(E log V)
 *    - Total: O((V + E) log V)
 *
 *  SPACE COMPLEXITY: O(V)
 *    - dist[] array: O(V)
 *    - parent[] map: O(V)
 *    - Priority queue: O(V) worst case
 *
 *  INTERVIEW INSIGHT:
 *  "Dijkstra's with a binary min-heap gives O((V+E) log V).
 *   We could use a Fibonacci heap for O(V log V + E), but
 *   the constant factors make binary heap faster in practice
 *   for typical city graphs (V < 100K)."
 * ============================================================
 */
public class DijkstraEngine {

    private final CityGraph graph;

    public DijkstraEngine(CityGraph graph) {
        this.graph = graph;
    }

    /**
     * Find the shortest path from source to destination.
     *
     * @param source      Starting node ID
     * @param destination Target node ID
     * @return PathResult with path and total distance, or empty if unreachable
     */
    public PathResult findShortestPath(String source, String destination) {

        // ---- Validation ----
        if (!graph.hasNode(source) || !graph.hasNode(destination)) {
            return new PathResult(Collections.emptyList(), Double.MAX_VALUE);
        }
        if (source.equals(destination)) {
            return new PathResult(List.of(source), 0.0);
        }

        // ---- Data Structures ----
        // dist[node] = shortest known distance from source
        Map<String, Double> dist = new HashMap<>();

        // parent[node] = previous node on shortest path (for path reconstruction)
        Map<String, String> parent = new HashMap<>();

        // Visited set to avoid re-processing
        Set<String> visited = new HashSet<>();

        // MinHeap: {distance, nodeId} -- ordered by distance
        PriorityQueue<double[]> minHeap = new PriorityQueue<>(
                Comparator.comparingDouble(a -> a[0])
        );

        // ---- Initialize ----
        Map<String, Integer> nodeIndex = new HashMap<>();
        List<String> nodeList = new ArrayList<>(graph.getAllNodes());
        for (int i = 0; i < nodeList.size(); i++) {
            nodeIndex.put(nodeList.get(i), i);
            dist.put(nodeList.get(i), Double.MAX_VALUE);
        }

        dist.put(source, 0.0);
        // {distance, nodeIndex}
        minHeap.offer(new double[]{0.0, nodeIndex.get(source)});

        // ---- Main Loop: Relax edges ----
        while (!minHeap.isEmpty()) {
            double[] top = minHeap.poll();
            double currentDist = top[0];
            int currentIdx = (int) top[1];
            String currentNode = nodeList.get(currentIdx);

            // Skip if already finalized
            if (visited.contains(currentNode)) continue;
            visited.add(currentNode);

            // Early exit if we've reached the destination
            if (currentNode.equals(destination)) break;

            // Relax all neighbors
            for (Edge edge : graph.getNeighbors(currentNode)) {
                String neighbor = edge.getTargetNode();
                if (visited.contains(neighbor)) continue;

                double newDist = currentDist + edge.getWeight();

                // RELAXATION: Found a shorter path to neighbor
                if (newDist < dist.get(neighbor)) {
                    dist.put(neighbor, newDist);
                    parent.put(neighbor, currentNode);
                    minHeap.offer(new double[]{newDist, nodeIndex.get(neighbor)});
                }
            }
        }

        // ---- Reconstruct Path ----
        if (dist.get(destination) == Double.MAX_VALUE) {
            return new PathResult(Collections.emptyList(), Double.MAX_VALUE);
        }

        List<String> path = new ArrayList<>();
        String current = destination;
        while (current != null) {
            path.add(current);
            current = parent.get(current);
        }
        Collections.reverse(path);

        return new PathResult(path, dist.get(destination));
    }
}
