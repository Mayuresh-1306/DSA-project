package com.smartride.engine.model;

/**
 * Request body for /api/engine/price - price estimation.
 */
public class PriceRequest {
    private double distance;
    private int activeRidesInZone;
    private int availableDriversInZone;

    public double getDistance()                    { return distance; }
    public void setDistance(double d)              { this.distance = d; }
    public int getActiveRidesInZone()             { return activeRidesInZone; }
    public void setActiveRidesInZone(int v)       { this.activeRidesInZone = v; }
    public int getAvailableDriversInZone()        { return availableDriversInZone; }
    public void setAvailableDriversInZone(int v)  { this.availableDriversInZone = v; }
}
