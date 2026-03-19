package com.smartride.engine.graph;

import com.smartride.engine.model.Edge;

import java.util.*;

/**
 * ============================================================
 *  CityGraph - Weighted Adjacency List Graph Representation
 * ============================================================
 *
 *  DSA CONCEPT: Adjacency List
 *
 *  We represent the city road network as a weighted undirected graph.
 *  - Nodes  = Intersections / Landmarks (e.g., "MG_Road", "Airport")
 *  - Edges  = Roads connecting them
 *  - Weight = Distance in kilometers
 *
 *  WHY Adjacency List over Adjacency Matrix?
 *    Operation         | Adj. List    | Adj. Matrix
 *    ------------------|--------------|-------------
 *    Space             | O(V + E)     | O(V^2)
 *    Get Neighbors     | O(degree)    | O(V)
 *    Add Edge          | O(1)         | O(1)
 *    Check Edge        | O(degree)    | O(1)
 *
 *  City graphs are SPARSE (each intersection connects to 3-5 roads),
 *  so adjacency list is far more memory-efficient: O(V+E) vs O(V^2).
 *  For 100K intersections: ~500KB (list) vs ~40GB (matrix).
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
 *   where V = number of nodes, E = number of edges
 * ============================================================
 */
public class CityGraph {

    // Core adjacency list: nodeId -> list of weighted edges
    private final Map<String, List<Edge>> adjacencyList;

    // Coordinate storage: nodeId -> [latitude, longitude]
    private final Map<String, double[]> nodeCoordinates;

    public CityGraph() {
        this.adjacencyList = new HashMap<>();
        this.nodeCoordinates = new HashMap<>();
    }

    /**
     * Add a node (intersection/landmark) with its GPS coordinates.
     * Time: O(1) amortized (HashMap put)
     */
    public void addNode(String nodeId, double latitude, double longitude) {
        adjacencyList.putIfAbsent(nodeId, new ArrayList<>());
        nodeCoordinates.put(nodeId, new double[]{latitude, longitude});
    }

    /**
     * Add a weighted undirected edge (road) between two nodes.
     * Time: O(1) amortized
     */
    public void addEdge(String from, String to, double weight) {
        adjacencyList.putIfAbsent(from, new ArrayList<>());
        adjacencyList.putIfAbsent(to, new ArrayList<>());
        adjacencyList.get(from).add(new Edge(to, weight));
        adjacencyList.get(to).add(new Edge(from, weight));   // undirected
    }

    /**
     * Get all neighboring edges from a given node.
     * Time: O(1) for the lookup, O(degree) to iterate
     */
    public List<Edge> getNeighbors(String nodeId) {
        return adjacencyList.getOrDefault(nodeId, Collections.emptyList());
    }

    /**
     * Get the GPS coordinates of a node.
     * Returns [latitude, longitude] or null if not found.
     */
    public double[] getCoordinates(String nodeId) {
        return nodeCoordinates.get(nodeId);
    }

    /**
     * Check if a node exists in the graph.
     */
    public boolean hasNode(String nodeId) {
        return adjacencyList.containsKey(nodeId);
    }

    /**
     * Get total number of nodes.
     */
    public int getNodeCount() {
        return adjacencyList.size();
    }

    /**
     * Get total number of directed edges (undirected edges counted twice).
     */
    public int getEdgeCount() {
        return adjacencyList.values().stream()
                .mapToInt(List::size)
                .sum();
    }

    /**
     * Get all node IDs in the graph.
     */
    public Set<String> getAllNodes() {
        return adjacencyList.keySet();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("CityGraph { nodes=%d, edges=%d }%n", getNodeCount(), getEdgeCount() / 2));
        for (Map.Entry<String, List<Edge>> entry : adjacencyList.entrySet()) {
            sb.append(String.format("  %s -> %s%n", entry.getKey(), entry.getValue()));
        }
        return sb.toString();
    }
}
