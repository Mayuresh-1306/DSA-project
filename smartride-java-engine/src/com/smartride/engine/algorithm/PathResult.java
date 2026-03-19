package com.smartride.engine.algorithm;

import java.util.List;
import java.util.Collections;

/**
 * PathResult - Immutable result of a shortest-path computation.
 * WHY a separate class? Clean separation of algorithm output from algorithm logic.
 */
public class PathResult {
    private final List<String> path;
    private final double totalDistance;

    public PathResult(List<String> path, double totalDistance) {
        this.path = path;
        this.totalDistance = totalDistance;
    }

    public static PathResult unreachable() {
        return new PathResult(Collections.emptyList(), Double.MAX_VALUE);
    }

    public List<String> getPath()      { return path; }
    public double getTotalDistance()    { return totalDistance; }
    public boolean isReachable()       { return totalDistance < Double.MAX_VALUE; }
}
