import {Card, Row} from 'antd';
import { FlightCard } from "./FlightCard.tsx";
import {Dictionaries, Offer} from "../types/types.ts";

interface FlightProps {
    flightOffer: Offer;
    dictionaries: Dictionaries;
}


export function Flight({ flightOffer, dictionaries}: FlightProps) {
    return (
        <div>
            {flightOffer.oneWay ?

                <Row gutter={[8, 8]} className="mb-2">
                    <FlightCard flightOffer={flightOffer} dictionaries={dictionaries} itineraryIndex={0}/>
                </Row>

                :

                <Card title="Departure and Return Flights" className="border border-gray-300 rounded-md shadow-sm p-4 mb-2">
                    <Row gutter={[8, 8]} className="mb-2">
                        <FlightCard flightOffer={flightOffer} dictionaries={dictionaries} itineraryIndex={0}/>
                        <FlightCard flightOffer={flightOffer} dictionaries={dictionaries} itineraryIndex={1}/>
                    </Row>
                </Card>

            }
        </div>
    );
}