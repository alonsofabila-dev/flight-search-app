package com.encoramx.backendflightsearch.records.airportandcityapi.data;


public record Locations(
        String type,
        String subType,
        String name,
        String detailedName,
        String id,
        Self self,
        String timeZoneOffset,
        String iataCode,
        GeoCode geoCode,
        Address address,
        Analytics analytics
) {
}
