package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

import java.util.List;

public record TravelerPricing(
        String travelerId,
        String fareOption,
        String travelerType,
        Price price,
        List<FareDetailsBySegment> fareDetailsBySegment
) {
}
