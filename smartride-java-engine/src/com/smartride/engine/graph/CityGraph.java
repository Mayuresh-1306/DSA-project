package com.smartride.engine.graph;

import java.util.*;

/**
 * ============================================================
 *  CityGraph - Weighted Adjacency List Graph Representation
 * ============================================================
 *
 *  WHY ADJACENCY LIST?
 *  City road networks are SPARSE graphs (each intersection connects
 *  to only 3-5 roads). An adjacency list uses O(V+E) space vs
 *  O(V^2) for a matrix. For 100K intersections: ~500KB vs ~40GB.
 *
 *  INTERVIEW INSIGHT:
 *  "We chose an adjacency list because city road networks are sparse
 *   graphs with average degree ~4. This gives O(V+E) space and O(1)
 *   amortized neighbor access, vs O(V^2) for a matrix."
 *
 *  TIME COMPLEXITY:
 *   - addNode()        = O(1)
 *   - addEdge()        = O(1)
 *   - getNeighbors()   = O(1)
 *   - getCoordinates() = O(1)
 *
 *  SPACE COMPLEXITY: O(V + E)
 * ============================================================
 */
public class CityGraph {

    // WHY HashMap? O(1) average lookup for node -> edges mapping
    private final Map<String, List<Edge>> adjacencyList;

    // WHY separate coordinate store? Decouples graph structure from GPS data
    private final Map<String, double[]> nodeCoordinates;

    public CityGraph() {
        this.adjacencyList = new HashMap<>();
        this.nodeCoordinates = new HashMap<>();
    }

    /**
     * Add a node (intersection/landmark) with its GPS coordinates.
     * WHY putIfAbsent? Prevents overwriting existing adjacency lists.
     */
    public void addNode(String nodeId, double latitude, double longitude) {
        adjacencyList.putIfAbsent(nodeId, new ArrayList<>());
        nodeCoordinates.put(nodeId, new double[]{latitude, longitude});
    }

    /**
     * Add a weighted UNDIRECTED edge (road) between two nodes.
     * WHY undirected? Most city roads are two-way.
     */
    public void addEdge(String from, String to, double weight) {
        adjacencyList.putIfAbsent(from, new ArrayList<>());
        adjacencyList.putIfAbsent(to, new ArrayList<>());
        adjacencyList.get(from).add(new Edge(to, weight));
        adjacencyList.get(to).add(new Edge(from, weight));
    }

    public List<Edge> getNeighbors(String nodeId) {
        return adjacencyList.getOrDefault(nodeId, Collections.emptyList());
    }

    public double[] getCoordinates(String nodeId) {
        return nodeCoordinates.get(nodeId);
    }

    public boolean hasNode(String nodeId) {
        return adjacencyList.containsKey(nodeId);
    }

    public int getNodeCount() {
        return adjacencyList.size();
    }

    public int getEdgeCount() {
        return adjacencyList.values().stream().mapToInt(List::size).sum();
    }

    public Set<String> getAllNodes() {
        return adjacencyList.keySet();
    }

    /**
     * Inner class: Edge in the graph.
     * WHY inner class? Tightly coupled to CityGraph, no reason to expose separately.
     */
    public static class Edge {
        private final String targetNode;
        private final double weight;  // distance in km

        public Edge(String targetNode, double weight) {
            this.targetNode = targetNode;
            this.weight = weight;
        }

        public String getTargetNode() { return targetNode; }
        public double getWeight()     { return weight; }

        @Override
        public String toString() {
            return String.format("->%s(%.1fkm)", targetNode, weight);
        }
    }
}
