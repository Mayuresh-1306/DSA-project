package com.smartride.engine.model;

/**
 * Request body for /api/engine/route - compute shortest path.
 */
public class RouteRequest {
    private String source;
    private String destination;

    public String getSource()                 { return source; }
    public void setSource(String source)      { this.source = source; }
    public String getDestination()            { return destination; }
    public void setDestination(String dest)   { this.destination = dest; }
}
