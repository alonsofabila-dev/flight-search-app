import api from './api.ts';
import {SearchFormValues} from "../types/types.ts";


export const getAirport = (city: string) => {
    return api.get(`/test/airports?city=${city}`);
}

export const getOffers = (searchFilter: SearchFormValues, url: string = '/test/flight-offers') => {
    return api.post(url, searchFilter);
}