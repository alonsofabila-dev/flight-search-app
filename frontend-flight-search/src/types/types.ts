import {Dayjs} from "dayjs";

export type Airport = {
    address: {
        cityName: string;
        countryName: string;
    };
    iataCode: string;
    name: string;
}

export type SearchFormValues = {
    departureCity: string,
    arrivalCity: string,
    departureDate: Dayjs | null,
    returnDate: Dayjs | null,
    travelers: {
        adults: number,
        children: number,
        infants: number
    },
    currency: string,
    nonStop: boolean
}

export type Dictionaries = {
    carriers: Carriers,
    aircraft: Aircraft,
}

type Carriers = {
    [key: string]: string;
}

type Aircraft = {
    [key: string]: string;
}

export type Offers = Offer[];

export type Offer = {
    id: string,
    oneWay: boolean,
    instantTicketingRequired: boolean,
    itineraries: Array<Itineraries>,
    lastTicketingDay: string,
    price: Price,
    travelerPricings: Array<TravelerPricing>,
}

type Price = {
    currency: string,
    base: string,
    total: string,
    grandTotal: string,
    fees: Array<Fee>
}

export type Fee = {
    type: string,
    amount: string
}

export type TravelerPricing = {
    travelerId: string,
    travelerType: string,
    price: Price,
    fareDetailsBySegment: Array<FareDetailsBySegment>
}

export type FareDetailsBySegment = {
    cabin: string,
    class: string,
    fareBasis: string,
    includedCheckedBags: IncludedCheckedBags,
    segmentId: string,
    amenities: Array<Amenity>
}

export type Amenity = {
    description: string,
    isChargable: boolean,
    amenityType: string
}

type IncludedCheckedBags = {
    weight: number,
    weightUnit: string
}

type Itineraries = {
    duration: string;
    segments: Array<Segment>;
}

export type Segment = {
    id: string,
    number: number,
    aircraft: {
        code: string
    },
    departure: {
        iataCode: string,
        terminal: string,
        at: string
    },
    arrival: {
        iataCode: string,
        terminal: string,
        at: string
    },
    blacklistedInEU: boolean,
    duration: string
    carrierCode: string,
    segmentDuration: string,
    numberOfStops: number,
    operating: {
        carrierCode: string,
    }
}
