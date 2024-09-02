package com.encoramx.backendflightsearch.records;


public record SearchFilters(
        String departureCity,
        String arrivalCity,
        String departureDate,
        String returnDate,
        Travelers travelers,
        String currency,
        boolean nonStop
) {

}
