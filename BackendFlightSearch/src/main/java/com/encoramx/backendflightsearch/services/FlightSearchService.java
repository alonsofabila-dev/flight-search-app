package com.encoramx.backendflightsearch.services;


import com.encoramx.backendflightsearch.integrations.AmadeusFlightsAPIIntegration;
import com.encoramx.backendflightsearch.records.SearchFilters;
import com.encoramx.backendflightsearch.records.airportandcityapi.AirlineAndCityResponseAPI;
import com.encoramx.backendflightsearch.records.flightofferssearchapi.FlightOffersResponseApi;
import com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata.FlightOffer;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class FlightSearchService {

    private final AmadeusFlightsAPIIntegration apiIntegration;


    public FlightSearchService(AmadeusFlightsAPIIntegration apiIntegration) {
        this.apiIntegration = apiIntegration;
    }


    public AirlineAndCityResponseAPI airportCodes(String city) {
        return apiIntegration.getAirports(city);
    }


    public FlightOffersResponseApi flightOffers(SearchFilters searchFilter, String sortField, String sortDirection) {

        FlightOffersResponseApi response = apiIntegration.getFlightOffers(searchFilter);

        List<FlightOffer> sortedFlightOffers = response.data();

        if ("grandTotal".equalsIgnoreCase(sortField)) {
            if ("asc".equalsIgnoreCase(sortDirection)) {
                sortedFlightOffers = sortedFlightOffers.stream()
                        .sorted(Comparator.comparing(flightOffer -> Double.parseDouble(flightOffer.price().grandTotal())))
                        .collect(Collectors.toList());
            }  else if ("desc".equalsIgnoreCase(sortDirection)) {
                sortedFlightOffers = sortedFlightOffers.stream()
                        .sorted(Comparator.comparing(flightOffer -> Double.parseDouble(((FlightOffer)flightOffer).price().grandTotal())).reversed())
                        .collect(Collectors.toList());
            }
        }
        if ("duration".equalsIgnoreCase(sortField)) {
            if ("asc".equalsIgnoreCase(sortDirection)) {
                sortedFlightOffers = sortedFlightOffers.stream()
                        .sorted(Comparator.comparing(flightOffer -> flightOffer.itineraries().getFirst().duration()))
                        .collect(Collectors.toList());
            } else if ("desc".equalsIgnoreCase(sortDirection)) {
                sortedFlightOffers = sortedFlightOffers.stream()
                        .sorted(Comparator.comparing(flightOffer -> ((FlightOffer)flightOffer).itineraries().getFirst().duration()).reversed())
                        .collect(Collectors.toList());
            }
        }

        return new FlightOffersResponseApi(response.meta(), sortedFlightOffers, response.dictionaries());
    }

}