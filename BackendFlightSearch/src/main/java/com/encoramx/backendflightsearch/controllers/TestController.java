package com.encoramx.backendflightsearch.controllers;

import com.encoramx.backendflightsearch.services.FlightSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/test")
public class TestController {

    private final FlightSearchService flightSearchService;

    @Autowired
    public TestController(FlightSearchService flightSearchService) {
        this.flightSearchService = flightSearchService;
    }

    @GetMapping("/airports")
    public String airports(
            @RequestParam() String city
    ) {
        return flightSearchService.airportCodes(city);
    }

    @GetMapping("/airline-info")
    public String airlineInfo() {
        return flightSearchService.airlinesInfo();
    }

    @GetMapping("/flight-offers")
    public String flightOffers() {
        return flightSearchService.flightOffers();
    }

}

