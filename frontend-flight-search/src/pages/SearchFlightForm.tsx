import { getAirport } from "../services/serviceFlightSearch.ts";
import { useDebounce } from "../hooks/useDebounce.tsx";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Select, DatePicker, InputNumber, Checkbox } from 'antd';
import { Airport, SearchFormValues } from "../types/types.ts";
import dayjs, { Dayjs } from 'dayjs';
import type { SelectProps } from 'antd';


export function SearchFlightForm() {
    const [isRoundTrip, setIsRoundTrip] = useState(true);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [formValues, setFormValues] = useState<SearchFormValues>({
        departureCity: '',
        arrivalCity: '',
        departureDate: null,
        returnDate: null,
        travelers: {
            adults: 1,
            children: 0,
            infants: 0
        },
        currency: 'USD',
        nonStop: false
    });

    const { RangePicker } = DatePicker;
    
    const debouncedDepartureCity = useDebounce(formValues.departureCity, 500);
    const debouncedArrivalCity = useDebounce(formValues.arrivalCity, 500);
    const navigate = useNavigate();


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
        } catch (error) {
            console.error('Error fetching airports:', error);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedDepartureCity = formatAirportSelection(formValues.departureCity);
        const formattedArrivalCity = formatAirportSelection(formValues.arrivalCity);
        const formattedDepartureDate = formatDateToYYYYMMDD(formValues.departureDate);
        const formattedReturnDate = formatDateToYYYYMMDD(formValues.returnDate);

        const searchData = {
            ...formValues,
            departureCity: formattedDepartureCity,
            arrivalCity: formattedArrivalCity,
            departureDate: formattedDepartureDate,
            returnDate: formattedReturnDate,
        };


        navigate('/flight-offers', { state: { searchData } });
    };


    const handleSearchChange = async (searchValue: string, isArrival: boolean) => {
        if (isArrival) {
            setFormValues((prevState) => ({
                ...prevState,
                arrivalCity: searchValue,
            }))
        } else {
            setFormValues((prevState) => ({
                ...prevState,
                departureCity: searchValue,
            }))
        }
    };


    const handleCitySelect = (selectedOption: { value: string; label: string }, isArrival: boolean) => {
        if (isArrival) {
            setFormValues((prevState) => ({
                ...prevState,
                arrivalCity: selectedOption.value,
            }))
        } else {
            setFormValues((prevState) => ({
                ...prevState,
                departureCity: selectedOption.value,
            }))
        }
    };

    // use reducer o hacerlos individual
    const handleDepartureDateChange = (date: Dayjs | null) => {
        setFormValues((prevState) => ({
            ...prevState,
            departureDate: date,
        }))
    };


    const handleReturnDateChange = (date: Dayjs | null) => {
        setFormValues((prevState) => ({
            ...prevState,
            returnDate: date,
        }))
    };


    const handleAdultTravelerChange = (quantity: number) => {
        setFormValues((prevState) => ({
            ...prevState,
            travelers: {
                ...prevState.travelers,
                adults: quantity,
            }
        }));
    };


    const handleChildrenTravelerChange = (quantity: number) => {
        setFormValues((prevState) => ({
            ...prevState,
            travelers: {
                ...prevState.travelers,
                children: quantity,
            }
        }));
    };


    const handleInfantTravelerChange = (quantity: number) => {
        setFormValues((prevState) => ({
            ...prevState,
            travelers: {
                ...prevState.travelers,
                infants: quantity,
            }
        }));
    };


    const handleIsNonstopChanged = (isNonstop: boolean) => {
        setFormValues((prevState) => ({
            ...prevState,
            nonStop: isNonstop,
        }))
    }


    const handleCurrencyChange = (currency: string) => {
        setFormValues((prevState) => ({
            ...prevState,
            currency: currency,
        }))
    }


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


    const formatAirportSelection = (airport: string): string => {
        if (!airport) return '';
        const length = airport.length;
        return airport.slice(length - 3, length);
    }


    const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };


    const airportOptions: SelectProps['options'] = airports.map((airport) => ({
        value: `${capitalizeFirstLetter(airport.name)} ${airport.iataCode.toUpperCase()}`,
        label: `${capitalizeFirstLetter(airport.name)} ${airport.iataCode.toUpperCase()}, ${capitalizeFirstLetter(airport.address.countryName)}`
    }));


    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg"
            >
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
                        value={{value: formValues.departureCity, label: formValues.departureCity}}
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
                        value={{value: formValues.arrivalCity, label: formValues.arrivalCity}}
                        labelInValue={true}
                        filterOption={false}
                        onSearch={(value) => handleSearchChange(value, true)}
                        onChange={(value) => handleCitySelect(value, true)}
                        options={airportOptions.filter((airportOption) => airportOption.value !== formValues.departureCity)}
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
                                    handleDepartureDateChange(dates ? dates[0] : null);
                                    handleReturnDateChange(dates ? dates[1] : null);
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
                                onChange={(date) => {
                                    handleDepartureDateChange(date)
                                    handleReturnDateChange(null);
                                }}
                            />
                        </div>

                    )}

                    <div className="w-full md:w-1/6">
                        <label htmlFor="adults" className="block text-gray-700 font-bold mb-2">Adults</label>
                        <InputNumber
                            id="adults"
                            min={1}
                            max={10}
                            value={formValues.travelers.adults}
                            onChange={(value) => handleAdultTravelerChange(value ?? 1)}
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
                            value={formValues.travelers.children}
                            onChange={(value) => handleChildrenTravelerChange(value ?? 0)}
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
                            value={formValues.travelers.infants}
                            onChange={(value) => handleInfantTravelerChange(value ?? 0)}
                        />
                    </div>

                </div>

                <div className="mb-4">
                    <label className="flex items-center text-gray-700">
                        <Checkbox
                            name="nonStop"
                            className="mr-2"
                            checked={formValues.nonStop}
                            onChange={(e) => handleIsNonstopChanged(e.target.checked)}
                        >
                            Non-stop Travel
                        </Checkbox>
                    </label>
                </div>

                <div className="mb-4">
                    <label htmlFor="currency" className="block text-gray-700 font-bold mb-2">Currency</label>
                    <Select
                        id="currency"
                        defaultValue={formValues.currency}
                        onChange={(value) => handleCurrencyChange(value)}
                        options={[
                            {value: 'EUR', label: 'Euro'},
                            {value: 'MXN', label: 'Mexican Peso'},
                            {value: 'USD', label: 'United States Dollar'},
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
    );
}
