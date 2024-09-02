package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

public record Amenities(
    String description,
    boolean isChargeable,
    String amenityType,
    AmenityProvider amenityProvider
) {
}
