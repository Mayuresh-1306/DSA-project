package com.smartride.engine.model;

/**
 * ============================================================
 *  DriverCandidate - MinHeap Node for Driver Ranking
 * ============================================================
 *
 *  DSA CONCEPT: Comparable + PriorityQueue (MinHeap)
 *
 *  Each driver candidate gets a composite SCORE.
 *  Java's PriorityQueue uses compareTo() to maintain heap order.
 *
 *  SCORE FORMULA (lower = better):
 *    score = 0.6 * normalizedDistance + 0.3 * invertedRating + 0.1 * basePenalty
 *
 *    Where:
 *      normalizedDistance = distanceToPickup / 10.0  (max ~10km search)
 *      invertedRating    = (5.0 - rating) / 4.0     (5-star -> 0.0, 1-star -> 1.0)
 *      basePenalty       = 0.1 (constant for available drivers)
 *
 *  INTERVIEW INSIGHT:
 *  "We don't just pick the closest driver - we compute a weighted composite
 *   score balancing proximity (60%), driver quality (30%), and a small
 *   availability factor (10%). The MinHeap always gives us the optimal
 *   candidate in O(log N) extract time."
 *
 *  TIME: O(1) construction, O(log N) in PriorityQueue operations
 *  SPACE: O(1) per candidate
 * ============================================================
 */
public class DriverCandidate implements Comparable<DriverCandidate> {

    private final String driverId;
    private final double distanceToPickup;   // km
    private final double rating;             // 1.0 - 5.0
    private final double[] coordinates;      // [lng, lat]
    private final double score;

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

    private double computeScore() {
        double normDist  = distanceToPickup / 10.0;           // 0 - 1
        double normRate  = (5.0 - rating) / 4.0;              // 5-star->0.0, 1-star->1.0
        return W_DISTANCE * normDist + W_RATING * normRate + W_AVAIL;
    }

    /** MinHeap ordering: lower score = better driver */
    @Override
    public int compareTo(DriverCandidate o) {
        return Double.compare(this.score, o.score);
    }

    public String getDriverId()        { return driverId; }
    public double getDistanceToPickup() { return distanceToPickup; }
    public double getRating()          { return rating; }
    public double[] getCoordinates()   { return coordinates; }
    public double getScore()           { return score; }

    @Override
    public String toString() {
        return String.format("Driver{id='%s', dist=%.2fkm, rating=%.1f, score=%.4f}",
                driverId, distanceToPickup, rating, score);
    }
}
