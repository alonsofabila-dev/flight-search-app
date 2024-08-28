package com.encoramx.backendflightsearch.services;


import com.encoramx.backendflightsearch.integrations.AmadeusFlightsAPIIntegration;
import org.springframework.stereotype.Service;


@Service
public class FlightSearchService {

    private final AmadeusFlightsAPIIntegration apiIntegration;


    public FlightSearchService(AmadeusFlightsAPIIntegration apiIntegration) {
        this.apiIntegration = apiIntegration;
    }


    public String airportCodes(String city){
        return apiIntegration.getAirports(city);
    }


    public String airlinesInfo(){
        return apiIntegration.getAirlinesInfo();
    }


    public String flightOffers(){
        return apiIntegration.getFlightOffers();
    }

}