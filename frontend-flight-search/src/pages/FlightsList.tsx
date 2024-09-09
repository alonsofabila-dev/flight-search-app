import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getOffers } from "../services/serviceFlightSearch.ts";
import { Flight } from "../components/Flight.tsx";
import { Button } from "antd";
import { Dictionaries, Offers} from "../types/types.ts";


export function FlightsList() {
    const [offers, setOffers] = useState<Offers>([]);
    const [dictionaries, setDictionaries] = useState<Dictionaries>({ carriers: {}, aircraft: {} });
    const [sortDirection, setSortDirection] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getFlightOffers();
    },[]);

    const getFlightOffers = async (sortField: string = '', sortDirection: string = '') => {
        try {
            const { searchFormValues } = location.state || {};
            const queryParams = new URLSearchParams({ sortField, sortDirection }).toString();
            const response = await getOffers({ ...searchFormValues }, `/test/flight-offers?${queryParams}`);
            setDictionaries(response.data.dictionaries);
            setOffers(response.data.data);
        } catch (error) {
            console.error('Error getting offers:', error);
        }

    }

    const handleSortByDuration = () => {
        let newDirection;
        if (sortDirection === "asc") {
            newDirection = "desc";
        } else if (sortDirection === "desc") {
            newDirection = "";
        } else {
            newDirection = "asc";
        }
        setSortDirection(newDirection);
        getFlightOffers('duration', newDirection);
    };

    const handleSortByPrice = () => {
        let newDirection;
        if (sortDirection === "asc") {
            newDirection = "desc";
        } else if (sortDirection === "desc") {
            newDirection = "";
        } else {
            newDirection = "asc";
        }
        setSortDirection(newDirection);
        getFlightOffers('grandTotal', newDirection);
    };

    const handleRedirectButton = () => {
        navigate("/");
    };


    return (
        <div className=''>
            <div className="space-x-4 mb-4 mt-4">
                <Button type="primary" onClick={handleRedirectButton}>
                    Return
                </Button>
                <Button type="default" onClick={handleSortByPrice}>
                    Sort by Price
                </Button>
                <Button type="default" onClick={handleSortByDuration}>
                    Sort by Duration
                </Button>
            </div>


            {offers && offers.length > 0 ?

                <div>
                    {offers.map((flightOffer, index) => (
                        <Flight key={index} flightOffer={flightOffer} dictionaries={dictionaries} />
                    ))}
                </div>

                :

                <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">It seems there&apos;s no flights to your destination</h2>
                    </div>
                </div>

            }

        </div>
    );
}
