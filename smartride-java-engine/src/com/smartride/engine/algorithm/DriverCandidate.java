package com.smartride.engine.algorithm;

/**
 * ============================================================
 *  DriverCandidate - MinHeap Node for Driver Ranking
 * ============================================================
 *
 *  WHY A COMPOSITE SCORE?
 *  We don't just pick the closest driver. We use a weighted formula:
 *    score = 0.6 * normalizedDistance + 0.3 * invertedRating + 0.1 * basePenalty
 *
 *  WHY THESE WEIGHTS?
 *  - 60% proximity: riders care most about pickup time
 *  - 30% rating:    quality matters for user satisfaction
 *  - 10% base:      constant factor for availability signal
 *
 *  WHY Comparable?
 *  Java's PriorityQueue (MinHeap) uses compareTo() to maintain
 *  heap order. Lower score = better driver = extracted first.
 *
 *  TIME: O(1) construction, O(log N) in heap operations
 *  SPACE: O(1) per candidate
 * ============================================================
 */
public class DriverCandidate implements Comparable<DriverCandidate> {

    private final String driverId;
    private final double distanceToPickup;  // km
    private final double rating;            // 1.0 - 5.0
    private final double[] coordinates;     // [lng, lat]
    private final double score;

    // WHY these weights? Industry-standard Uber-like scoring:
    // proximity dominates (60%), quality second (30%), base (10%)
    private static final double W_DISTANCE = 0.6;
    private static final double W_RATING   = 0.3;
    private static final double W_AVAIL    = 0.1;

    public DriverCandidate(String driverId, double distanceToPickup,
                           double rating, double[] coordinates) {
        this.driverId = driverId;
        this.distanceToPickup = distanceToPickup;
        this.rating = rating;
        this.coordinates = coordinates;
        this.score = computeScore();
    }

    /**
     * WHY this formula?
     * normDist: 0-1 range (10km max search), closer = lower score = better
     * normRate: invert rating so 5-star -> 0.0 (best), 1-star -> 1.0 (worst)
     */
    private double computeScore() {
        double normDist = distanceToPickup / 10.0;
        double normRate = (5.0 - rating) / 4.0;
        return W_DISTANCE * normDist + W_RATING * normRate + W_AVAIL;
    }

    /** MinHeap ordering: lower score = better driver = comes first */
    @Override
    public int compareTo(DriverCandidate o) {
        return Double.compare(this.score, o.score);
    }

    public String getDriverId()         { return driverId; }
    public double getDistanceToPickup() { return distanceToPickup; }
    public double getRating()           { return rating; }
    public double[] getCoordinates()    { return coordinates; }
    public double getScore()            { return score; }

    @Override
    public String toString() {
        return String.format("Driver{id='%s', dist=%.2fkm, rating=%.1f, score=%.4f}",
                driverId, distanceToPickup, rating, score);
    }
}
