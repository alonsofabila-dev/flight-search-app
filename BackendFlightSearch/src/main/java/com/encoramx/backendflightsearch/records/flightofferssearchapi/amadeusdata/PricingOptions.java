package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

import java.util.List;

public record PricingOptions(
        List<String> fareType,
        boolean includedCheckedBagsOnly
) {
}
