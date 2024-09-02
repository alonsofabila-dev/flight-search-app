package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

public record Segment(
        Departure departure,
        Arrival arrival,
        String carrierCode,
        String number,
        Aircraft aircraft,
        Operating operating,
        String duration,
        String id,
        int numberOfStops,
        boolean blacklistedInEU
) {
}
