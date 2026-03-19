package com.smartride.engine.model;

import java.util.List;

/**
 * Response sent back to Node.js after matching completes.
 */
public class MatchResult {
    private String matchedDriverId;
    private double routeDistance;
    private List<String> routePath;
    private double optimizedPrice;
    private double surgeMultiplier;
    private double driverDistanceToPickup;
    private double driverScore;
    private double estimatedTimeMinutes;

    public MatchResult() {}

    public MatchResult(String matchedDriverId, double routeDistance, List<String> routePath,
                       double optimizedPrice, double surgeMultiplier,
                       double driverDistanceToPickup, double driverScore,
                       double estimatedTimeMinutes) {
        this.matchedDriverId = matchedDriverId;
        this.routeDistance = routeDistance;
        this.routePath = routePath;
        this.optimizedPrice = optimizedPrice;
        this.surgeMultiplier = surgeMultiplier;
        this.driverDistanceToPickup = driverDistanceToPickup;
        this.driverScore = driverScore;
        this.estimatedTimeMinutes = estimatedTimeMinutes;
    }

    // Getters & Setters
    public String getMatchedDriverId()     { return matchedDriverId; }
    public void setMatchedDriverId(String v) { this.matchedDriverId = v; }
    public double getRouteDistance()        { return routeDistance; }
    public void setRouteDistance(double v)  { this.routeDistance = v; }
    public List<String> getRoutePath()     { return routePath; }
    public void setRoutePath(List<String> v) { this.routePath = v; }
    public double getOptimizedPrice()      { return optimizedPrice; }
    public void setOptimizedPrice(double v) { this.optimizedPrice = v; }
    public double getSurgeMultiplier()     { return surgeMultiplier; }
    public void setSurgeMultiplier(double v) { this.surgeMultiplier = v; }
    public double getDriverDistanceToPickup() { return driverDistanceToPickup; }
    public void setDriverDistanceToPickup(double v) { this.driverDistanceToPickup = v; }
    public double getDriverScore()         { return driverScore; }
    public void setDriverScore(double v)   { this.driverScore = v; }
    public double getEstimatedTimeMinutes() { return estimatedTimeMinutes; }
    public void setEstimatedTimeMinutes(double v) { this.estimatedTimeMinutes = v; }
}
