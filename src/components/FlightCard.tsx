import React from 'react';
import type { Flight } from '../types/flight';

interface FlightCardProps {
    flight: Flight;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="flight-card">
            <div className="flight-header">
                <div className="flight-route">
                    <span className="city">{flight.from}</span>
                    <span className="arrow">→</span>
                    <span className="city">{flight.to}</span>
                </div>
                <div className="flight-airline">{flight.airline}</div>
            </div>

            <div className="flight-details">
                <div className="detail-item">
                    <span className="detail-label">Departure</span>
                    <span className="detail-value">{flight.departureTime}</span>
                </div>

                <div className="detail-item">
                    <span className="detail-label">Arrival</span>
                    <span className="detail-value">{flight.arrivalTime}</span>
                </div>

                <div className="detail-item">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{formatDuration(flight.duration)}</span>
                </div>

                <div className="detail-item">
                    <span className="detail-label">Price</span>
                    <span className="detail-value price">${flight.price}</span>
                </div>
            </div>
        </div>
    );
};
