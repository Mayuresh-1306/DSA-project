package com.smartride.engine.algorithm;

/**
 * ============================================================
 *  Dynamic Pricing Engine - Supply/Demand Surge Pricing
 * ============================================================
 *
 *  WHY DYNAMIC PRICING?
 *  Creates a real-time economic feedback loop:
 *  1. High demand + low supply -> prices rise -> attracts more drivers
 *  2. More drivers -> supply increases -> prices normalize
 *
 *  FORMULA:
 *  Price = baseFare + (distance * perKmRate * surgeMultiplier)
 *  surgeMultiplier = max(1.0, min(3.0, demand / supply))
 *
 *  WHY CAP AT 3x?
 *  Uber caps surge to prevent predatory pricing. 3x is the
 *  industry-standard maximum multiplier.
 *
 *  TIME:  O(1) - pure arithmetic
 *  SPACE: O(1)
 * ============================================================
 */
public class DynamicPricingEngine {

    private static final double BASE_FARE   = 30.0;  // Rs.30 minimum fare
    private static final double PER_KM_RATE = 12.0;  // Rs.12 per kilometer
    private static final double MIN_SURGE   = 1.0;   // no surge
    private static final double MAX_SURGE   = 3.0;   // 3x cap

    /**
     * Calculate surge multiplier based on supply/demand ratio.
     * WHY ratio? Simple, O(1), and mirrors real-world Uber pricing.
     */
    public double getSurgeMultiplier(int activeRides, int availableDrivers) {
        if (availableDrivers <= 0) return MAX_SURGE;
        double ratio = (double) activeRides / availableDrivers;
        return Math.max(MIN_SURGE, Math.min(MAX_SURGE, ratio));
    }

    /**
     * Calculate final ride price.
     * WHY round to 2 decimals? Clean currency display.
     */
    public double calculatePrice(double distanceKm, double surgeMultiplier) {
        double price = BASE_FARE + (distanceKm * PER_KM_RATE * surgeMultiplier);
        return Math.round(price * 100.0) / 100.0;
    }

    public double getBaseFare()   { return BASE_FARE; }
    public double getPerKmRate()  { return PER_KM_RATE; }
}
