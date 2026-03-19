package com.smartride.engine.model;

import java.util.List;

/**
 * Request body sent by Node.js for ride matching.
 */
public class MatchRequest {
    private String rideId;
    private String pickupNode;
    private String dropoffNode;
    private List<DriverInfo> availableDrivers;

    public static class DriverInfo {
        private String id;
        private double rating;
        private double[] coordinates;  // [lng, lat]

        public String getId()            { return id; }
        public void setId(String id)     { this.id = id; }
        public double getRating()        { return rating; }
        public void setRating(double r)  { this.rating = r; }
        public double[] getCoordinates() { return coordinates; }
        public void setCoordinates(double[] c) { this.coordinates = c; }
    }

    public String getRideId()                           { return rideId; }
    public void setRideId(String rideId)                { this.rideId = rideId; }
    public String getPickupNode()                       { return pickupNode; }
    public void setPickupNode(String pickupNode)        { this.pickupNode = pickupNode; }
    public String getDropoffNode()                      { return dropoffNode; }
    public void setDropoffNode(String dropoffNode)      { this.dropoffNode = dropoffNode; }
    public List<DriverInfo> getAvailableDrivers()       { return availableDrivers; }
    public void setAvailableDrivers(List<DriverInfo> d) { this.availableDrivers = d; }
}
