import { useState } from "react";
import { Card, Col, Modal, Row } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import {Amenity, Dictionaries, FareDetailsBySegment, Fee, Offer, Segment, TravelerPricing} from "../types/types.ts";

interface FlightCardProps {
    flightOffer: Offer;
    dictionaries: Dictionaries;
    itineraryIndex: number;
}

export function FlightCard({ itineraryIndex, flightOffer, dictionaries }: FlightCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(flightOffer);

    const showModal = () => {
        setIsModalOpen(true);
    };

    function formatTime(datetime: string): string {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function calculateTimeDifference(endTime: string, startTime: string): string {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;

        const diffMinutes = endTotalMinutes - startTotalMinutes;
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;

        return `${diffHours}h ${remainingMinutes}m`;
    }

    function formatDuration(duration: string): string {
        const length = duration.length;
        const hours = duration.slice(length - 6, length - 4);
        const minutes = duration.slice(length - 3, length - 1);

        return `${hours}h ${minutes}m`;
    }

    const finalElement: number = (flightOffer.itineraries[itineraryIndex].segments.length - 1);

    return (
        <>
            <Col span={20}>
                <Card className="border border-gray-300 rounded-md shadow-sm h-full">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <div className="text-left">
                                <p className="font-bold text-lg">{formatTime(flightOffer.itineraries[itineraryIndex].segments[0].departure.at)}</p>
                                <p className="text-base">{flightOffer.itineraries[itineraryIndex].segments[0].departure.iataCode}</p>
                                <p className="text-sm">{finalElement === 0 ? "Nonstop" : `${finalElement} Stop`}, {formatDuration(flightOffer.itineraries[itineraryIndex].duration)}</p>
                                {flightOffer.itineraries[itineraryIndex].segments.length > 1 && (
                                    <p className="text-sm">
                                        Connecting in{" "}
                                        {flightOffer.itineraries[itineraryIndex].segments
                                            .slice(0, -1)
                                            .map((segment: Segment, index: number) => (
                                                <span key={index}>
                                            {segment.arrival.iataCode} {index < flightOffer.itineraries[itineraryIndex].segments.length - 2 && ", "}
                                        </span>
                                            ))}
                                    </p>
                                )}
                            </div>
                        </Col>

                        {flightOffer.itineraries[itineraryIndex].segments.length > 1 && (
                            <Col className="text-center">
                                <ClockCircleOutlined className="text-lg text-blue-600"/>
                                {flightOffer.itineraries[0].segments.map((segment: Segment, index: number) => {
                                    if (index < flightOffer.itineraries[itineraryIndex].segments.length - 1) {
                                        return (
                                            <p key={index}>
                                                {segment.arrival.iataCode} {calculateTimeDifference(formatTime(flightOffer.itineraries[itineraryIndex].segments[index + 1].departure.at), formatTime(segment.arrival.at))}
                                            </p>
                                        );
                                    }
                                })}
                            </Col>
                        )}

                        <Col>
                            <div className="text-right">
                                <p className="font-bold text-lg">{formatTime(flightOffer.itineraries[itineraryIndex].segments[finalElement].arrival.at)}</p>
                                <p className="text-base">{flightOffer.itineraries[itineraryIndex].segments[finalElement].arrival.iataCode}</p>
                                <a onClick={showModal} className="underline">
                                    Flight Details
                                </a>
                                <Modal open={isModalOpen}
                                       onCancel={() => setIsModalOpen(false)}
                                       width={1000}
                                       footer={null}>
                                    <Row gutter={[16, 16]}>

                                        <Col span={16}>
                                            <h2 className="text-xl font-bold mb-4">Flight Details</h2>
                                            {flightOffer.itineraries[itineraryIndex].segments.map((segment: Segment, index: number) => (
                                                <div key={index}>
                                                    <div className="bg-white p-6 mb-2 rounded-lg shadow-lg">
                                                        <h3 className="text-lg font-semibold">Segment {index + 1}</h3>
                                                        <p>Departure From: {segment.departure.iataCode}</p>
                                                        <p>Departure Time: {formatTime(segment.departure.at)}</p>
                                                        <p>Arrival In: {segment.arrival.iataCode}</p>
                                                        <p>Arrival Time: {formatTime(segment.arrival.at)}</p>
                                                        <p>Airline Code: {segment.carrierCode} ({dictionaries.carriers[segment.carrierCode]})</p>
                                                        <p>Flight Number: {segment.number}</p>
                                                        {segment.operating && segment.operating.carrierCode !== segment.carrierCode && (
                                                            <p>Operating Carrier: {segment.operating.carrierCode} ({dictionaries.carriers[segment.operating.carrierCode]})</p>
                                                        )}
                                                        <p>Aircraft Type: {segment.aircraft.code} ({dictionaries.aircraft[segment.aircraft.code]})</p>

                                                        <h4 className="text-md font-medium mt-2">Traveler Fare Details</h4>
                                                        {flightOffer.travelerPricings.map((traveler: TravelerPricing, travelerIndex: number) => (
                                                            <div key={travelerIndex}>
                                                                {flightOffer.itineraries[itineraryIndex].segments.map((segment: Segment, segmentIndex: number) => (
                                                                    traveler.fareDetailsBySegment
                                                                        .filter((fareDetail: FareDetailsBySegment) => fareDetail.segmentId === segment.id)
                                                                        .map((fareDetail: FareDetailsBySegment) => (
                                                                            <div key={segmentIndex}>
                                                                                <p>Cabin: {fareDetail.cabin}</p>
                                                                                <p>Class: {fareDetail.class}</p>
                                                                                {fareDetail.amenities && fareDetail.amenities.length > 0 && (
                                                                                    <div>
                                                                                        <p>Amenities: </p>
                                                                                        <ul className="list-disc ml-5">
                                                                                            {fareDetail.amenities.map((amenity: Amenity, amenityIndex: number) => (
                                                                                                <li key={amenityIndex}>{amenity.amenityType}: {amenity.description}</li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {index < flightOffer.itineraries[itineraryIndex].segments.length - 1 && (
                                                        <div className="text-center my-4">
                                                            <p className="text-gray-500">Layover Time: {calculateTimeDifference(formatTime(flightOffer.itineraries[itineraryIndex].segments[index + 1].departure.at), formatTime(segment.arrival.at))}</p>
                                                            <p className="text-gray-500">In: {flightOffer.itineraries[itineraryIndex].segments[index + 1].departure.iataCode}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </Col>

                                        <Col span={8}>
                                            <h2 className="text-xl font-bold mb-4">Price Breakdown</h2>
                                            <div className="bg-white p-6 mb-2 rounded-lg shadow-lg">
                                                <p>Base: ${flightOffer.price.base}</p>
                                                <p>Fees:</p>
                                                <ul className="list-disc ml-5">
                                                    {flightOffer.price.fees.map((fee: Fee, index: number) => (
                                                        <li key={index}>{fee.type.toLowerCase()}: ${fee.amount}</li>
                                                    ))}
                                                </ul>
                                                <p>Total: ${flightOffer.price.grandTotal}</p>
                                                <p>Price per traveler:</p>
                                                <ul className="list-disc ml-5">
                                                    {flightOffer.travelerPricings.map((traveler: TravelerPricing, index: number) => (
                                                        <li key={index}>{traveler.travelerType.toLowerCase()}: ${traveler.price.total}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Col>

                                    </Row>
                                </Modal>
                            </div>
                        </Col>

                    </Row>
                </Card>
            </Col>

            <Col span={4}>
                <Card
                    className="border border-gray-300 rounded-md shadow-sm p-4 mb-4 h-full flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">Total Price: ${flightOffer.price.total}</h2>
                    </div>
                </Card>
            </Col>

        </>
    )

}