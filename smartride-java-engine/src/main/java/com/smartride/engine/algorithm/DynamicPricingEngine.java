package com.smartride.engine.algorithm;

/**
 * ============================================================
 *  Dynamic Pricing Engine - Supply/Demand Surge Pricing
 * ============================================================
 *
 *  HOW IT WORKS:
 *  Price = baseFare + (distance * perKmRate * surgeMultiplier)
 *
 *  surgeMultiplier = max(1.0, min(3.0, demand / supply))
 *
 *  Base Fare: Rs.30 (covers fixed costs: platform fee, insurance)
 *  Per-Km Rate: Rs.12 per kilometer
 *  Surge Cap: 3.0x (fairness limit)
 *
 *  INTERVIEW INSIGHT:
 *  "Surge pricing is a real-time economic feedback loop:
 *   1. High demand + low supply -> prices rise -> attracts more drivers
 *   2. More drivers -> supply increases -> prices normalize
 *   This is how Uber/Lyft balance the marketplace. We cap at 3x
 *   to avoid predatory pricing."
 *
 *  TIME COMPLEXITY:  O(1) - pure arithmetic
 *  SPACE COMPLEXITY: O(1)
 * ============================================================
 */
public class DynamicPricingEngine {

    private static final double BASE_FARE    = 30.0;   // Rs.30 minimum fare
    private static final double PER_KM_RATE  = 12.0;   // Rs.12 per kilometer
    private static final double MIN_SURGE    = 1.0;    // no surge
    private static final double MAX_SURGE    = 3.0;    // 3x cap

    /**
     * Calculate surge multiplier based on supply/demand ratio.
     *
     * @param activeRides      Number of active ride requests (demand)
     * @param availableDrivers Number of available drivers (supply)
     * @return Surge multiplier between 1.0 and 3.0
     */
    public double getSurgeMultiplier(int activeRides, int availableDrivers) {
        if (availableDrivers <= 0) return MAX_SURGE;
        double ratio = (double) activeRides / availableDrivers;
        return Math.max(MIN_SURGE, Math.min(MAX_SURGE, ratio));
    }

    /**
     * Calculate the final ride price.
     *
     * @param distanceKm       Total route distance in km
     * @param surgeMultiplier  Current surge multiplier
     * @return Price in Rs. (Indian Rupees)
     */
    public double calculatePrice(double distanceKm, double surgeMultiplier) {
        double price = BASE_FARE + (distanceKm * PER_KM_RATE * surgeMultiplier);
        return Math.round(price * 100.0) / 100.0; // Round to 2 decimals
    }

    /**
     * Convenience: calculate price with surge computed internally.
     */
    public double calculatePrice(double distanceKm, int activeRides, int availableDrivers) {
        double surge = getSurgeMultiplier(activeRides, availableDrivers);
        return calculatePrice(distanceKm, surge);
    }
}
