package com.smartride.engine.model;

import java.util.List;

/**
 * Result returned by Dijkstra / A* pathfinding.
 * Contains the ordered path (list of node IDs) and total distance.
 */
public class PathResult {
    private final List<String> path;
    private final double totalDistance;

    public PathResult(List<String> path, double totalDistance) {
        this.path = path;
        this.totalDistance = totalDistance;
    }

    public List<String> getPath() {
        return path;
    }

    public double getTotalDistance() {
        return totalDistance;
    }

    public boolean isReachable() {
        return path != null && !path.isEmpty();
    }

    @Override
    public String toString() {
        return String.format("PathResult{dist=%.2fkm, path=%s}", totalDistance, path);
    }
}
