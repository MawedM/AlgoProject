import React from 'react';
import type { Connection, Flight } from '../types/flight';

interface RouteComparisonProps {
    optimalConnection: Connection;
    allFlights: Flight[];
    fromCity: string;
    toCity: string;
    optimizationType: 'price' | 'duration';
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
    optimalConnection,
    allFlights,
    fromCity,
    toCity,
    optimizationType
}) => {
    // Find alternative routes for comparison
    const findAlternativeRoutes = (): Connection[] => {
        const routes: Connection[] = [];

        // Direct flights
        const directFlights = allFlights.filter(f => f.from === fromCity && f.to === toCity);
        directFlights.forEach(flight => {
            routes.push({
                flights: [flight],
                totalPrice: flight.price,
                totalDuration: flight.duration,
                transfers: 0
            });
        });

        // One-hop connections
        const firstHops = allFlights.filter(f => f.from === fromCity);
        firstHops.forEach(firstFlight => {
            const secondHops = allFlights.filter(f =>
                f.from === firstFlight.to && f.to === toCity
            );
            secondHops.forEach(secondFlight => {
                routes.push({
                    flights: [firstFlight, secondFlight],
                    totalPrice: firstFlight.price + secondFlight.price,
                    totalDuration: firstFlight.duration + secondFlight.duration,
                    transfers: 1
                });
            });
        });

        // Sort by the optimization type
        if (optimizationType === 'price') {
            routes.sort((a, b) => a.totalPrice - b.totalPrice);
        } else {
            routes.sort((a, b) => a.totalDuration - b.totalDuration);
        }

        // Return top 3 alternatives (excluding the optimal one)
        return routes.slice(0, 4);
    };

    const alternatives = findAlternativeRoutes();
    const optimalValue = optimizationType === 'price'
        ? optimalConnection.totalPrice
        : optimalConnection.totalDuration;

    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getRoutePath = (connection: Connection): string => {
        return connection.flights.map(f => f.from).concat(connection.flights[connection.flights.length - 1].to).join(' → ');
    };

    const calculateSavings = (alternativeValue: number): number => {
        return alternativeValue - optimalValue;
    };

    const getSavingsPercentage = (alternativeValue: number): number => {
        if (alternativeValue === 0) return 0;
        return Math.round((calculateSavings(alternativeValue) / alternativeValue) * 100);
    };

    return (
        <div className="route-comparison-container">
            <div className="comparison-header">
                <h3 className="comparison-title">📊 Why This Route is Optimal</h3>
                <p className="comparison-subtitle">
                    Dijkstra's algorithm compared all possible paths and found the {optimizationType === 'price' ? 'cheapest' : 'fastest'} option
                </p>
            </div>

            <div className="comparison-grid">
                {/* Optimal Route Card */}
                <div className="comparison-card optimal-card">
                    <div className="card-badge">✨ OPTIMAL ROUTE</div>
                    <div className="route-path">{getRoutePath(optimalConnection)}</div>
                    <div className="route-metrics">
                        <div className="metric-primary">
                            <span className="metric-label">
                                {optimizationType === 'price' ? 'Total Cost' : 'Total Time'}
                            </span>
                            <span className="metric-value optimal">
                                {optimizationType === 'price'
                                    ? `$${optimalConnection.totalPrice}`
                                    : formatDuration(optimalConnection.totalDuration)}
                            </span>
                        </div>
                        <div className="metric-secondary">
                            <div className="metric-item">
                                <span className="metric-label-sm">Transfers</span>
                                <span className="metric-value-sm">{optimalConnection.transfers}</span>
                            </div>
                            {optimizationType === 'price' ? (
                                <div className="metric-item">
                                    <span className="metric-label-sm">Duration</span>
                                    <span className="metric-value-sm">{formatDuration(optimalConnection.totalDuration)}</span>
                                </div>
                            ) : (
                                <div className="metric-item">
                                    <span className="metric-label-sm">Cost</span>
                                    <span className="metric-value-sm">${optimalConnection.totalPrice}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alternative Routes */}
                {alternatives.slice(1, 4).map((alternative, index) => {
                    const alternativeValue = optimizationType === 'price'
                        ? alternative.totalPrice
                        : alternative.totalDuration;
                    const savings = calculateSavings(alternativeValue);
                    const savingsPercentage = getSavingsPercentage(alternativeValue);

                    return (
                        <div key={index} className="comparison-card alternative-card">
                            <div className="card-badge alternative-badge">Alternative #{index + 1}</div>
                            <div className="route-path">{getRoutePath(alternative)}</div>
                            <div className="route-metrics">
                                <div className="metric-primary">
                                    <span className="metric-label">
                                        {optimizationType === 'price' ? 'Total Cost' : 'Total Time'}
                                    </span>
                                    <span className="metric-value">
                                        {optimizationType === 'price'
                                            ? `$${alternative.totalPrice}`
                                            : formatDuration(alternative.totalDuration)}
                                    </span>
                                </div>
                                <div className="savings-indicator">
                                    <span className="savings-label">More expensive by:</span>
                                    <span className="savings-value">
                                        {optimizationType === 'price'
                                            ? `$${savings}`
                                            : formatDuration(savings)}
                                        <span className="savings-percentage"> (+{savingsPercentage}%)</span>
                                    </span>
                                </div>
                                <div className="metric-secondary">
                                    <div className="metric-item">
                                        <span className="metric-label-sm">Transfers</span>
                                        <span className="metric-value-sm">{alternative.transfers}</span>
                                    </div>
                                    {optimizationType === 'price' ? (
                                        <div className="metric-item">
                                            <span className="metric-label-sm">Duration</span>
                                            <span className="metric-value-sm">{formatDuration(alternative.totalDuration)}</span>
                                        </div>
                                    ) : (
                                        <div className="metric-item">
                                            <span className="metric-label-sm">Cost</span>
                                            <span className="metric-value-sm">${alternative.totalPrice}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="comparison-footer">
                <div className="algorithm-insight">
                    <span className="insight-icon">💡</span>
                    <div className="insight-content">
                        <strong>Algorithm Insight:</strong> Dijkstra's algorithm explored all possible paths
                        and guaranteed this is the {optimizationType === 'price' ? 'cheapest' : 'fastest'} route.
                        The alternatives shown above would cost you
                        {optimizationType === 'price' ? ' more money' : ' more time'}.
                    </div>
                </div>
            </div>
        </div>
    );
};
