package com.encoramx.backendflightsearch.records.airportandcityapi;

import com.encoramx.backendflightsearch.records.airportandcityapi.data.Locations;
import com.encoramx.backendflightsearch.records.amadeusmeta.AmadeusMeta;

import java.util.List;

public record AirlineAndCityResponseAPI(
        AmadeusMeta meta,
        List<Locations> data
) {
}
