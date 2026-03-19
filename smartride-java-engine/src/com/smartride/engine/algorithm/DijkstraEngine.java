package com.smartride.engine.algorithm;

import com.smartride.engine.graph.CityGraph;

import java.util.*;

/**
 * ============================================================
 *  Dijkstra's Algorithm - Single-Source Shortest Path
 * ============================================================
 *
 *  WHY DIJKSTRA?
 *  BFS only works for unweighted graphs. City roads have different
 *  lengths (weights), so we need Dijkstra for weighted shortest path.
 *
 *  HOW IT WORKS:
 *  1. Initialize: dist[source]=0, dist[all others]=INFINITY
 *  2. Use a MinHeap (PriorityQueue) ordered by distance
 *  3. Extract node with smallest distance
 *  4. For each neighbor: if dist[current] + edgeWeight < dist[neighbor],
 *     update dist[neighbor] and add to heap (RELAXATION)
 *  5. Repeat until destination found or heap empty
 *
 *  WHY NOT Bellman-Ford?
 *  Road distances are always positive. Dijkstra is O((V+E)logV)
 *  vs Bellman-Ford's O(VE). No negative edges = use Dijkstra.
 *
 *  TIME:  O((V + E) * log V) with binary min-heap
 *  SPACE: O(V) for distance array + parent map + heap
 *
 *  INTERVIEW INSIGHT:
 *  "Dijkstra's with a binary min-heap gives O((V+E) log V).
 *   A Fibonacci heap would give O(V log V + E), but the constant
 *   factors make binary heap faster in practice for V < 100K."
 * ============================================================
 */
public class DijkstraEngine {

    private final CityGraph graph;

    public DijkstraEngine(CityGraph graph) {
        this.graph = graph;
    }

    /**
     * Find shortest path from source to destination.
     * Returns [path, totalDistance] as a PathResult.
     */
    public PathResult findShortestPath(String source, String destination) {

        // -- Validation --
        if (!graph.hasNode(source) || !graph.hasNode(destination)) {
            return PathResult.unreachable();
        }
        if (source.equals(destination)) {
            return new PathResult(List.of(source), 0.0);
        }

        // WHY HashMap for dist? O(1) lookup instead of array (nodes are String IDs)
        Map<String, Double> dist = new HashMap<>();
        Map<String, String> parent = new HashMap<>();
        Set<String> visited = new HashSet<>();

        // WHY PriorityQueue? It's Java's built-in binary MinHeap - O(log N) extract
        // Each entry: [distance, nodeIndex]
        List<String> nodeList = new ArrayList<>(graph.getAllNodes());
        Map<String, Integer> nodeIndex = new HashMap<>();
        for (int i = 0; i < nodeList.size(); i++) {
            nodeIndex.put(nodeList.get(i), i);
            dist.put(nodeList.get(i), Double.MAX_VALUE);
        }

        dist.put(source, 0.0);
        PriorityQueue<double[]> minHeap = new PriorityQueue<>(
                Comparator.comparingDouble(a -> a[0])
        );
        minHeap.offer(new double[]{0.0, nodeIndex.get(source)});

        // -- Main Dijkstra Loop --
        while (!minHeap.isEmpty()) {
            double[] top = minHeap.poll();
            double currentDist = top[0];
            String currentNode = nodeList.get((int) top[1]);

            if (visited.contains(currentNode)) continue;
            visited.add(currentNode);

            // WHY early exit? Once destination is finalized, we have the shortest path
            if (currentNode.equals(destination)) break;

            // RELAXATION: Core of Dijkstra - try to improve neighbor distances
            for (CityGraph.Edge edge : graph.getNeighbors(currentNode)) {
                String neighbor = edge.getTargetNode();
                if (visited.contains(neighbor)) continue;

                double newDist = currentDist + edge.getWeight();
                if (newDist < dist.get(neighbor)) {
                    dist.put(neighbor, newDist);
                    parent.put(neighbor, currentNode);
                    minHeap.offer(new double[]{newDist, nodeIndex.get(neighbor)});
                }
            }
        }

        // -- Path Reconstruction --
        if (dist.get(destination) == Double.MAX_VALUE) {
            return PathResult.unreachable();
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
