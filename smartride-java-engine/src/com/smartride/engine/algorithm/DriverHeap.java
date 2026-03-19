package com.smartride.engine.algorithm;

import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

/**
 * ============================================================
 *  DriverHeap - MinHeap for Nearest/Best Driver Lookup
 * ============================================================
 *
 *  WHY A MIN-HEAP?
 *  We need to quickly find the BEST driver from N candidates.
 *  - Sorting: O(N log N) even if we only need the top-1
 *  - MinHeap: O(N) build + O(log N) per extract
 *
 *  WHY NOT just sort?
 *  For K rides from N drivers, heap is O(N + K log N) vs
 *  sort's O(N log N). When K << N (e.g., 10 rides from 1000
 *  nearby drivers), the heap approach is significantly faster.
 *
 *  INTERVIEW INSIGHT:
 *  "A MinHeap lets us find the best driver in O(log N) without
 *   fully sorting. For batch matching, heap is O(N + K log N)
 *   vs O(N log N) for sorting - significant when K << N."
 *
 *  OPERATIONS:
 *    insert()      = O(log N)
 *    extractBest() = O(log N)
 *    peek()        = O(1)
 *    size()        = O(1)
 *
 *  SPACE: O(N) where N = number of candidate drivers
 * ============================================================
 */
public class DriverHeap {

    // WHY PriorityQueue? Java's built-in binary min-heap implementation.
    // DriverCandidate implements Comparable, so the heap orders by composite score.
    private final PriorityQueue<DriverCandidate> minHeap;

    public DriverHeap() {
        this.minHeap = new PriorityQueue<>();
    }

    /** Insert a driver candidate. Time: O(log N) */
    public void insert(DriverCandidate candidate) {
        minHeap.offer(candidate);
    }

    /** Extract the BEST driver (lowest score). Time: O(log N) */
    public DriverCandidate extractBest() {
        return minHeap.poll();
    }

    /** Peek at the best driver without removing. Time: O(1) */
    public DriverCandidate peekBest() {
        return minHeap.peek();
    }

    /** Get top-K best drivers. Time: O(K log N) */
    public List<DriverCandidate> extractTopK(int k) {
        List<DriverCandidate> topK = new ArrayList<>();
        for (int i = 0; i < k && !minHeap.isEmpty(); i++) {
            topK.add(minHeap.poll());
        }
        return topK;
    }

    public int size()       { return minHeap.size(); }
    public boolean isEmpty() { return minHeap.isEmpty(); }
}
