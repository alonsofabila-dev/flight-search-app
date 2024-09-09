package com.encoramx.backendflightsearch.integrations;

import com.encoramx.backendflightsearch.records.AmadeusAccessInfo;
import com.encoramx.backendflightsearch.records.SearchFilters;
import com.encoramx.backendflightsearch.records.airportandcityapi.AirlineAndCityResponseAPI;
import com.encoramx.backendflightsearch.records.flightofferssearchapi.FlightOffersResponseApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
public class AmadeusFlightsAPIIntegration {

    Logger logger = LoggerFactory.getLogger(AmadeusFlightsAPIIntegration.class);

    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.client-id}")
    private String apiKey;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.client-secret}")
    private String apiSecret;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.authorization-grant-type}")
    private String authorizationGrantType;

    @Value("${spring.security.oauth2.client.provider.amadeus-api-provider.token-uri}")
    private String tokenUrl;


    public AmadeusFlightsAPIIntegration(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }


    private String getAccessToken() {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = "grant_type=" + authorizationGrantType +
                "&client_id=" + apiKey +
                "&client_secret=" + apiSecret;

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<AmadeusAccessInfo> responseEntity = restTemplate.postForEntity(tokenUrl, requestEntity, AmadeusAccessInfo.class);
            return Objects.requireNonNull(responseEntity.getBody()).accessToken();
        } catch (RestClientException e) {
            logger.error(e.getMessage());
            return "Failed to retrieve access token";
        }

    }


    public AirlineAndCityResponseAPI getAirports(String city) {
        String endpoint = "/v1/reference-data/locations" +
                "?subType=CITY" +
                "&keyword=" + city +
                "&page[limit]=5" +
                "&page[offset]=0" +
                "&sort=analytics.travelers.score" +
                "&view=LIGHT";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getAccessToken());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = "https://test.api.amadeus.com" + endpoint;

        ResponseEntity<AirlineAndCityResponseAPI> response = restTemplate.exchange(url, HttpMethod.GET, entity, AirlineAndCityResponseAPI.class);

        return response.getBody();
    }


    public FlightOffersResponseApi getFlightOffers(SearchFilters searchFilter) {
        String endpoint;

        if (searchFilter.returnDate().isEmpty()) {
            endpoint = "/v2/shopping/flight-offers" +
                    "?originLocationCode=" + searchFilter.departureCity() +
                    "&destinationLocationCode=" + searchFilter.arrivalCity() +
                    "&departureDate=" + searchFilter.departureDate() +
                    "&adults=" + searchFilter.travelers().adults() +
                    "&children=" + searchFilter.travelers().children() +
                    "&infants=" + searchFilter.travelers().infants() +
                    "&nonStop=" + searchFilter.nonStop() +
                    "&currencyCode=" + searchFilter.currency() +
                    "&max=50";
        } else {
            endpoint = "/v2/shopping/flight-offers" +
                    "?originLocationCode=" + searchFilter.departureCity() +
                    "&destinationLocationCode=" + searchFilter.arrivalCity() +
                    "&departureDate=" + searchFilter.departureDate() +
                    "&returnDate=" + searchFilter.returnDate() +
                    "&adults=" + searchFilter.travelers().adults() +
                    "&children=" + searchFilter.travelers().children() +
                    "&infants=" + searchFilter.travelers().infants() +
                    "&nonStop=" + searchFilter.nonStop() +
                    "&currencyCode=" + searchFilter.currency() +
                    "&max=50";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getAccessToken());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = "https://test.api.amadeus.com" + endpoint;

        ResponseEntity<FlightOffersResponseApi> response = restTemplate.exchange(url, HttpMethod.GET, entity, FlightOffersResponseApi.class);

        return response.getBody();
    }

//
//        public TransformedAPIResponse sendFlightOffers(FlightOffersResponseApi flightOffersResponse) {
//        Map<String, String> carriers = flightOffersResponse.dictionaries().carriers();
//
//        List<FlightOffers> flightOffers = flightOffersResponse.data().stream().map(flightOffer -> {
//            boolean oneWay = flightOffer.oneWay();
//
//            Itineraries itineraries = new Itineraries(
//                    flightOffer.itineraries().getFirst().duration(),
//                    flightOffer.itineraries().getFirst().segments().stream().map(segment ->
//                        new Segments(
//                                segment.departure(),
//                                segment.arrival(),
//                                segment.carrierCode(),
//                                segment.duration()
//                        )
//                    ).toList()
//            );
//
//            Pricing pricing = new Pricing(
//                    flightOffer.price().currency(),
//                    flightOffer.price().grandTotal(),
//                    flightOffer.travelerPricings().stream().map(travelerPricing ->
//                            new TravelersPricing(
//                                    travelerPricing.travelerType(),
//                                    travelerPricing.price().total()
//                            )
//                    ).toList()
//            );
//
//            return new FlightOffers(oneWay, itineraries, pricing);
//
//        }).toList();
//
//        return new TransformedAPIResponse(carriers, flightOffers);
//    }
}
