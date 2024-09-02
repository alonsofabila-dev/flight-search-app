package com.encoramx.backendflightsearch.records.flightofferssearchapi;

import com.encoramx.backendflightsearch.records.amadeusmeta.AmadeusMeta;
import com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata.FlightOffer;
import com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdictionaries.Dictionaries;

import java.util.List;

public record FlightOffersResponseApi(
        AmadeusMeta meta,
        List<FlightOffer> data,
        Dictionaries dictionaries
) {
}
