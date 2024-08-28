package com.encoramx.backendflightsearch.records;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SearchFilters(
        @JsonProperty("departure_airport") String departureAirport,
        @JsonProperty("arrival_airport") String arrivalAirport,
        @JsonProperty("departure_date") String departureDate,
        @JsonProperty("return_date") String returnDate,
        @JsonProperty("currency") String currency,
        @JsonProperty("non_stop") boolean nonStop,
        @JsonProperty("travelers") Travelers travelers
) {

    public record Travelers(
            @JsonProperty("adults") int adults,
            @JsonProperty("children") int children,
            @JsonProperty("infants") int infants
    ) {

    }

}
