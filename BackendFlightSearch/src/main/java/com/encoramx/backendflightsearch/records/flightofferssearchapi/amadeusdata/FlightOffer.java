package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

import java.util.List;

public record FlightOffer(
        String type,
        String id,
        String source,
        boolean instantTicketingRequired,
        boolean nonHomogeneous,
        boolean oneWay,
        String lastTicketingDate,
        int numberOfBookableSeats,
        List<Itinerary> itineraries,
        Price price,
        PricingOptions pricingOptions,
        List<String> validatingAirlineCodes,
        List<TravelerPricing> travelerPricings
) {
}
