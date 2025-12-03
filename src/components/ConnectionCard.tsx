import React from 'react';
import type { Connection } from '../types/flight';

interface ConnectionCardProps {
    connection: Connection;
    rank?: number;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, rank }) => {
    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="connection-card">
            <div className="connection-summary">
                <div className="connection-stats">
                    {rank && (
                        <div className="stat-item">
                            <span className="stat-label">Rank</span>
                            <span className="stat-value">#{rank}</span>
                        </div>
                    )}

                    <div className="stat-item">
                        <span className="stat-label">Total Price</span>
                        <span className="stat-value price">${connection.totalPrice}</span>
                    </div>

                    <div className="stat-item">
                        <span className="stat-label">Total Duration</span>
                        <span className="stat-value">{formatDuration(connection.totalDuration)}</span>
                    </div>

                    <div className="stat-item">
                        <span className="stat-label">Transfers</span>
                        <span className="stat-value">{connection.transfers}</span>
                    </div>
                </div>

                {connection.transfers === 0 && (
                    <span className="badge badge-success">Direct Flight</span>
                )}
            </div>

            <div className="connection-flights">
                {connection.flights.map((flight, index) => (
                    <React.Fragment key={flight.id}>
                        <div className="connection-flight">
                            <span className="flight-number">{flight.id}</span>
                            <div className="flight-route">
                                <span className="city">{flight.from}</span>
                                <span className="arrow">→</span>
                                <span className="city">{flight.to}</span>
                            </div>
                            <div className="flight-airline">{flight.airline}</div>
                            <div className="detail-item">
                                <span className="detail-label">Time</span>
                                <span className="detail-value">{flight.departureTime} - {flight.arrivalTime}</span>
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

                        {index < connection.flights.length - 1 && (
                            <div className="transfer-indicator">
                                <div className="transfer-dot"></div>
                                <span>Transfer at {flight.to}</span>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
