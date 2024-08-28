package com.encoramx.backendflightsearch.records;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AmadeusAccessInfo(
        String type,
        String username,
        @JsonProperty("application_name") String applicationName,
        @JsonProperty("client_id") String clientId,
        @JsonProperty("token_type") String tokenType,
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("expires_in") int expireIn,
        String state,
        String scope
) {

}
