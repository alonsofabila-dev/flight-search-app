package com.encoramx.backendflightsearch.controllers;

import com.encoramx.backendflightsearch.services.AmadeusFlightSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/flights")
public class TestController {

    private final AmadeusFlightSearchService flightSearchService;

    @Autowired
    public TestController(AmadeusFlightSearchService flightSearchService) {
        this.flightSearchService = flightSearchService;
    }

    @GetMapping("/search-flights")
    public String searchFlights() {
        return flightSearchService.getAirportCodes();
    }
}

