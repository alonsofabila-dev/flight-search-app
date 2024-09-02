package com.encoramx.backendflightsearch.records.flightofferssearchapi.amadeusdata;

import java.util.List;

public record Price(
        String currency,
        String total,
        String base,
        List<Fee> fees,
        String grandTotal
) {
}
