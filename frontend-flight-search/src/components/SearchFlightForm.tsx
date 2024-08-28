import {useEffect, useState} from 'react';
import { getAirport } from "../services/serviceFlightSearch.ts";
import { useDebounce } from "../hooks/useDebounce.tsx";
import {Select, DatePicker, InputNumber, Checkbox} from 'antd';
import type { SelectProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';


type Airport = {
    address: {
        cityName: string;
        countryName: string;
    };
    iataCode: string;
    name: string;
}
//
// type SearchFormValues = {
//     departureCity: string,
//     arrivalCity: string,
//     departureDate: string,
//     arrivalDate?: string,
//     travelers: {
//         adults: number,
//         children: number,
//         infants: number
//     },
//     currency: string,
//     nonStop: boolean
// }

// const [formValues, setFormValues] = useState<SearchFormValues>({
//     departureCity: '',
//     arrivalCity: '',
//     departureDate: '',
//     arrivalDate: '',
//     travelers: {
//         adults: 1,
//         children: 0,
//         infants: 0
//     },
//     currency: 'MXN',
//     nonStop: false
// });

export function SearchFlightForm() {
    const [isRoundTrip, setIsRoundTrip] = useState(true);
    const [departureCity, setDepartureCity] = useState('');
    const [airports, setAirports] = useState<Airport[]>([]);

    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [nonStop, setNonStop] = useState(false);
    const [currency, setCurrency] = useState('USD');

    const { RangePicker } = DatePicker;

    const debouncedDepartureCity = useDebounce(departureCity, 500);
    const debouncedArrivalCity = useDebounce(arrivalCity, 500);

    useEffect(() => {
        if (debouncedDepartureCity) {
            fetchAirports(debouncedDepartureCity);
        }
        if (debouncedArrivalCity) {
            fetchAirports(debouncedArrivalCity);
        }
    }, [debouncedDepartureCity, debouncedArrivalCity]);


    const fetchAirports = async (searchValue: string) => {
        try {
            const response = await getAirport(searchValue);
            setAirports(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error('Error fetching airports:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedDepartureDate = formatDateToYYYYMMDD(departureDate);
        const formattedReturnDate = formatDateToYYYYMMDD(returnDate);
        // Here you can use the state variables to get the form data
        console.log({
            isRoundTrip,
            departureCity,
            arrivalCity,
            departureDate: formattedDepartureDate,
            returnDate: formattedReturnDate,
            adults,
            children,
            infants,
            nonStop,
            currency,
        });
    };

    const handleSearchChange = async (searchValue: string, isArrival: boolean) => {
        if (isArrival) {
            setArrivalCity(searchValue);
        } else {
            setDepartureCity(searchValue);
        }
    };


    const handleCitySelect = (selectedOption: { value: string; label: string }, isArrival: boolean) => {
        if (isArrival) {
            setArrivalCity(selectedOption.value);
        } else {
            setDepartureCity(selectedOption.value);
        }
    };


    const capitalizeFirstLetter = (text: string) => {
        if (!text) return '';
        return text
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const formatDateToYYYYMMDD = (date: dayjs.Dayjs | null): string => {
        if (!date) return '';
        return date.format('YYYY-MM-DD');
    };



    const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };


    const airportOptions: SelectProps['options'] = airports.map((airport) => ({
        value: `${capitalizeFirstLetter(airport.name)} ${airport.iataCode.toUpperCase()}`,
        label: `${capitalizeFirstLetter(airport.name)} ${airport.iataCode.toUpperCase()}, ${capitalizeFirstLetter(airport.address.countryName)}`
    }));


    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">

                <form onSubmit={handleSubmit}>

                    <div className="flex space-x-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setIsRoundTrip(true)}
                            className={`px-4 py-2 rounded ${isRoundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Round Trip
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRoundTrip(false)}
                            className={`px-4 py-2 rounded ${!isRoundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Single Flight
                        </button>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="departureCity" className="block text-gray-700 font-bold mb-2">Origin</label>
                        <Select
                            showSearch
                            placeholder="Escribe un origen"
                            value={{value: departureCity, label: departureCity}}
                            labelInValue={true}
                            filterOption={false}
                            onSearch={(value) => handleSearchChange(value, false)}
                            onChange={(value) => handleCitySelect(value, false)}
                            options={airportOptions}
                            style={{width: '100%'}}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="arrivalCity" className="block text-gray-700 font-bold mb-2">Destination</label>
                        <Select
                            showSearch
                            placeholder="Escribe un destino"
                            value={{value: arrivalCity, label: arrivalCity}}
                            labelInValue={true}
                            filterOption={false}
                            onSearch={(value) => handleSearchChange(value, true)}
                            onChange={(value) => handleCitySelect(value, true)}
                            options={airportOptions.filter((airportOption) => airportOption.value !== departureCity)}
                            style={{width: '100%'}}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">

                        {isRoundTrip ? (
                            <div className="w-full md:w-1/2">
                                <label htmlFor="dateRange" className="block text-gray-700 font-bold mb-2">
                                    Dates
                                </label>
                                <RangePicker
                                    id="dateRange"
                                    className="w-full"
                                    placeholder={['Departure Date', 'Return Date']}
                                    disabledDate={disabledDate}
                                    onChange={(dates) => {
                                        setDepartureDate(dates ? dates[0] : null);
                                        setReturnDate(dates ? dates[1] : null);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-full md:w-1/2">
                                <label htmlFor="departureDate" className="block text-gray-700 font-bold mb-2">
                                    Departure Date
                                </label>
                                <DatePicker
                                    id="departureDate"
                                    className="w-full"
                                    disabledDate={disabledDate}
                                    onChange={(date) => setDepartureDate(date)}
                                />
                            </div>

                        )}

                        <div className="w-full md:w-1/6">
                            <label htmlFor="adults" className="block text-gray-700 font-bold mb-2">
                            Adults
                            </label>
                            <InputNumber
                                id="adults"
                                min={1}
                                max={10}
                                value={adults}
                                onChange={(value) => setAdults(value ?? 1)}
                            />
                        </div>
                        <div className="w-full md:w-1/6">
                            <label htmlFor="children" className="block text-gray-700 font-bold mb-2">
                                Children
                            </label>
                            <InputNumber
                                id="children"
                                min={0}
                                max={10}
                                value={children}
                                onChange={(value) => setChildren(value ?? 0)}
                            />
                        </div>
                        <div className="w-full md:w-1/6">
                            <label htmlFor="infants" className="block text-gray-700 font-bold mb-2">
                                Infants
                            </label>
                            <InputNumber
                                id="infants"
                                min={0}
                                max={10}
                                value={infants}
                                onChange={(value) => setInfants(value ?? 0)}
                            />
                        </div>

                    </div>

                    <div className="mb-4">
                        <label className="flex items-center text-gray-700">
                            <Checkbox
                                name="nonStop"
                                className="mr-2"
                                checked={nonStop}
                                onChange={(e) => setNonStop(e.target.checked)}
                            >
                                Non-stop Travel
                            </Checkbox>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="currency" className="block text-gray-700 font-bold mb-2">Currency</label>
                        <Select
                            id="currency"
                            defaultValue={currency}
                            onChange={(value) => setCurrency(value as string)}
                            options={[
                                { value: 'EUR', label: 'Euro' },
                                { value: 'MXN', label: 'Mexican Peso' },
                                { value: 'USD', label: 'United States Dollar' },
                            ]}
                        />
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                        >
                            Search
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}
