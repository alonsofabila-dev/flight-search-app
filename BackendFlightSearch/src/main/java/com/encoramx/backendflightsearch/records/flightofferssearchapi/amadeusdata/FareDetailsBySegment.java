package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record FareDetailsBySegment(
        String segmentId,
        String cabin,
        String fareBasis,
        String brandedFare,
        String brandedFareLabel,
        @JsonProperty("class") String flightClass,
        IncludedCheckedBags includedCheckedBags,
        List<Amenities> amenities
) {
}
