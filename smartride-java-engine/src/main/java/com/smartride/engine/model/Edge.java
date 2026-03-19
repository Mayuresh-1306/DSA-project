package com.smartride.engine.model;

/**
 * Represents a weighted edge in the city graph.
 *
 * Each edge connects the current node to a target node
 * with a weight representing real-world distance in km.
 */
public class Edge {
    private final String targetNode;
    private final double weight;

    public Edge(String targetNode, double weight) {
        this.targetNode = targetNode;
        this.weight = weight;
    }

    public String getTargetNode() {
        return targetNode;
    }

    public double getWeight() {
        return weight;
    }

    @Override
    public String toString() {
        return String.format("(%s, %.2fkm)", targetNode, weight);
    }
}
