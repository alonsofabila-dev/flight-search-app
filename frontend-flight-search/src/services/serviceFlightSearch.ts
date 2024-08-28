import api from './api.ts';

export const getAirport = async (city: string) => {
    return api.get(`/test/airports?city=${city}`);
}