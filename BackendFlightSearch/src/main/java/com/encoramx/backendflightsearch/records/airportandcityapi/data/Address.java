package com.encoramx.backendflightsearch.records.airportandcityapi.data;

public record Address(
        String cityName,
        String cityCode,
        String countryName,
        String countryCode,
        String regionCode
) {
}
