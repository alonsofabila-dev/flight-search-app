package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdictionaries;

import java.util.Map;

public record Dictionaries(
        Map<String, Location> locations,
        Map<String, String> aircraft,
        Map<String, String> currencies,
        Map<String, String> carriers
) {
}