package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

import java.util.List;

public record Itinerary(
        String duration,
        List<Segment> segments
) {
}
