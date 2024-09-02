package com.encoramx.backendflightsearch.controllers;

import com.encoramx.backendflightsearch.records.SearchFilters;
import com.encoramx.backendflightsearch.records.airportandcityapi.AirlineAndCityResponseAPI;
import com.encoramx.backendflightsearch.records.flightofferssearchapi.FlightOffersResponseApi;
import com.encoramx.backendflightsearch.services.FlightSearchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/test")
public class TestController {

    private final FlightSearchService flightSearchService;

    public TestController(FlightSearchService flightSearchService) {
        this.flightSearchService = flightSearchService;
    } 


    @GetMapping("/airports")
    public AirlineAndCityResponseAPI airports(
            @RequestParam String city
    ) {
        return flightSearchService.airportCodes(city);
    }


    @PostMapping("/flight-offers")
    public ResponseEntity<FlightOffersResponseApi> flightOffers(
            @RequestBody SearchFilters searchFilter,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortDirection
    ) {

        FlightOffersResponseApi response = flightSearchService.flightOffers(searchFilter, sortField, sortDirection);
        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }

}

