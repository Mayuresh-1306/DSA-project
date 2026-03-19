package com.smartride.engine.algorithm;

import com.smartride.engine.model.DriverCandidate;

import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

/**
 * ============================================================
 *  DriverHeap - MinHeap for Nearest/Best Driver Lookup
 * ============================================================
 *
 *  DSA CONCEPT: Priority Queue (Binary Min-Heap)
 *
 *  Uses Java's PriorityQueue backed by a binary min-heap.
 *  DriverCandidate implements Comparable with a COMPOSITE SCORE,
 *  so the heap root always contains the BEST driver.
 *
 *  OPERATIONS and COMPLEXITY:
 *    insert(driver)   = O(log N)
 *    extractBest()    = O(log N)
 *    peek()           = O(1)
 *    buildHeap(N)     = O(N)
 *    size()           = O(1)
 *
 *  SPACE: O(N) where N = number of candidate drivers
 *
 *  WHY NOT just sort the array?
 *  - Sort: O(N log N) upfront, even if we only need top-1
 *  - Heap: O(N) build + O(log N) per extract
 *  - If we need top-K of N drivers, heap is O(N + K log N) vs sort's O(N log N)
 *
 *  INTERVIEW INSIGHT:
 *  "A MinHeap lets us find the best driver in O(log N) without fully
 *   sorting. For batch matching (K rides from N drivers), the heap
 *   approach is O(N + K log N) vs O(N log N) for sorting -- significant
 *   when K << N, like 10 concurrent rides from 1000 nearby drivers."
 * ============================================================
 */
public class DriverHeap {

    private final PriorityQueue<DriverCandidate> minHeap;

    public DriverHeap() {
        this.minHeap = new PriorityQueue<>();
    }

    /**
     * Build heap from a list of candidates.
     * Time: O(N) via heapify
     */
    public DriverHeap(List<DriverCandidate> candidates) {
        this.minHeap = new PriorityQueue<>(candidates);
    }

    /**
     * Insert a driver candidate into the heap.
     * Time: O(log N) - bubble-up operation
     */
    public void insert(DriverCandidate candidate) {
        minHeap.offer(candidate);
    }

    /**
     * Extract the BEST driver (lowest composite score).
     * Time: O(log N) - removal + heapify-down
     */
    public DriverCandidate extractBest() {
        return minHeap.poll();
    }

    /**
     * Peek at the best driver without removing.
     * Time: O(1)
     */
    public DriverCandidate peekBest() {
        return minHeap.peek();
    }

    /**
     * Get top-K best drivers.
     * Time: O(K log N)
     */
    public List<DriverCandidate> extractTopK(int k) {
        List<DriverCandidate> topK = new ArrayList<>();
        for (int i = 0; i < k && !minHeap.isEmpty(); i++) {
            topK.add(minHeap.poll());
        }
        return topK;
    }

    public int size() {
        return minHeap.size();
    }

    public boolean isEmpty() {
        return minHeap.isEmpty();
    }
}
