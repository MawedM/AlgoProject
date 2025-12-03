import React, { useEffect, useState } from 'react';
import type { Connection, Flight } from '../types/flight';

interface RouteMapProps {
    connection: Connection;
    allFlights: Flight[];
    fromCity: string;
    toCity: string;
}

// City positions on the map (approximate US geography)
const cityPositions: Record<string, { x: number; y: number }> = {
    'NYC': { x: 85, y: 35 },
    'BOS': { x: 88, y: 30 },
    'MIA': { x: 80, y: 80 },
    'ATL': { x: 75, y: 60 },
    'CHI': { x: 60, y: 35 },
    'DEN': { x: 40, y: 45 },
    'LAX': { x: 15, y: 60 },
    'SFO': { x: 10, y: 45 },
    'SEA': { x: 12, y: 20 },
    'LAS': { x: 18, y: 55 },
};

export const RouteMap: React.FC<RouteMapProps> = ({ connection, allFlights, fromCity, toCity }) => {
    const [animationStep, setAnimationStep] = useState(0);
    const [showAllRoutes, setShowAllRoutes] = useState(false);

    useEffect(() => {
        // Reset animation when connection changes
        setAnimationStep(0);
        const timer = setTimeout(() => {
            setAnimationStep(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [connection]);

    // Get all possible routes (simplified - just direct and one-hop connections)
    const getAlternativeRoutes = (): Flight[][] => {
        const routes: Flight[][] = [];

        // Direct flights
        const directFlights = allFlights.filter(f => f.from === fromCity && f.to === toCity);
        directFlights.forEach(f => routes.push([f]));

        // One-hop connections
        const firstHops = allFlights.filter(f => f.from === fromCity);
        firstHops.forEach(firstFlight => {
            const secondHops = allFlights.filter(f =>
                f.from === firstFlight.to && f.to === toCity
            );
            secondHops.forEach(secondFlight => {
                routes.push([firstFlight, secondFlight]);
            });
        });

        return routes.slice(0, 5); // Limit to 5 alternative routes
    };

    const alternativeRoutes = showAllRoutes ? getAlternativeRoutes() : [];

    const renderPath = (flights: Flight[], isOptimal: boolean, index: number = 0) => {
        const pathElements: React.JSX.Element[] = [];

        flights.forEach((flight, i) => {
            const from = cityPositions[flight.from];
            const to = cityPositions[flight.to];

            if (from && to) {
                const pathId = `path-${isOptimal ? 'optimal' : 'alt'}-${index}-${i}`;
                const shouldAnimate = isOptimal && animationStep > 0;

                pathElements.push(
                    <g key={pathId}>
                        {/* Path line */}
                        <line
                            x1={`${from.x}%`}
                            y1={`${from.y}%`}
                            x2={`${to.x}%`}
                            y2={`${to.y}%`}
                            stroke={isOptimal ? 'url(#optimalGradient)' : 'rgba(255, 255, 255, 0.15)'}
                            strokeWidth={isOptimal ? '3' : '1.5'}
                            strokeDasharray={isOptimal ? '0' : '5,5'}
                            className={shouldAnimate ? 'animated-path' : ''}
                            style={{
                                opacity: isOptimal ? 1 : 0.4,
                            }}
                        />

                        {/* Animated plane icon on optimal path */}
                        {isOptimal && shouldAnimate && (
                            <g className="plane-icon" style={{
                                animation: `flyPath${i} 2s ease-in-out ${i * 0.5}s forwards`
                            }}>
                                <circle
                                    cx={`${from.x}%`}
                                    cy={`${from.y}%`}
                                    r="1.5"
                                    fill="#43e97b"
                                    className="plane-glow"
                                />
                                <text
                                    x={`${from.x}%`}
                                    y={`${from.y}%`}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="6"
                                    className="plane-emoji"
                                >
                                    ✈️
                                </text>
                            </g>
                        )}

                        {/* Flight info label */}
                        {isOptimal && (
                            <g>
                                {/* Background for price label */}
                                <rect
                                    x={`${(from.x + to.x) / 2 - 3}%`}
                                    y={`${(from.y + to.y) / 2 + 0.5}%`}
                                    width="6%"
                                    height="2.5%"
                                    fill="rgba(0, 0, 0, 0.7)"
                                    rx="0.5"
                                    style={{
                                        opacity: shouldAnimate ? 0.9 : 0,
                                        transition: 'opacity 0.5s ease-in-out',
                                        transitionDelay: `${i * 0.5 + 1}s`
                                    }}
                                />
                                <text
                                    x={`${(from.x + to.x) / 2}%`}
                                    y={`${(from.y + to.y) / 2 + 2}%`}
                                    textAnchor="middle"
                                    fontSize="7"
                                    fill="#43e97b"
                                    fontWeight="700"
                                    className="flight-label"
                                    style={{
                                        opacity: shouldAnimate ? 1 : 0,
                                        transition: 'opacity 0.5s ease-in-out',
                                        transitionDelay: `${i * 0.5 + 1}s`,
                                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
                                    }}
                                >
                                    ${flight.price}
                                </text>
                            </g>
                        )}
                    </g>
                );

                // Add keyframe animation for plane movement
                if (isOptimal && shouldAnimate) {
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes flyPath${i} {
                            from {
                                transform: translate(0, 0);
                            }
                            to {
                                transform: translate(${to.x - from.x}%, ${to.y - from.y}%);
                            }
                        }
                    `;
                    if (!document.head.querySelector(`[data-animation="flyPath${i}"]`)) {
                        style.setAttribute('data-animation', `flyPath${i}`);
                        document.head.appendChild(style);
                    }
                }
            }
        });

        return pathElements;
    };

    const renderCity = (code: string, position: { x: number; y: number }) => {
        const isStart = code === fromCity;
        const isEnd = code === toCity;
        const isOnPath = connection.flights.some(f => f.from === code || f.to === code);

        return (
            <g key={code} className="city-node">
                {/* Glow effect for start/end cities */}
                {(isStart || isEnd) && (
                    <circle
                        cx={`${position.x}%`}
                        cy={`${position.y}%`}
                        r="6"
                        fill={isStart ? 'rgba(102, 126, 234, 0.3)' : 'rgba(67, 233, 123, 0.3)'}
                        className="city-glow"
                    />
                )}

                {/* Background circle for icon */}
                <circle
                    cx={`${position.x}%`}
                    cy={`${position.y}%`}
                    r="3.5"
                    fill={isStart ? '#667eea' : isEnd ? '#43e97b' : isOnPath ? '#4facfe' : '#6b7280'}
                    stroke={isOnPath ? '#fff' : 'rgba(255, 255, 255, 0.3)'}
                    strokeWidth="1"
                    className="city-circle"
                    style={{
                        transition: 'all 0.3s ease-in-out',
                    }}
                />

                {/* SVG Airplane Icon */}
                <g transform={`translate(${position.x}, ${position.y}) scale(0.08)`}>
                    <path
                        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                        fill="#fff"
                        transform="translate(-12, -12)" // Center the icon
                    />
                </g>

                {/* City code label below */}
                <text
                    x={`${position.x}%`}
                    y={`${position.y + 4}%`}
                    textAnchor="middle"
                    fontSize="5"
                    fontWeight="700"
                    fill={isOnPath ? '#fff' : '#b4b7c9'}
                    className="city-label"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                    {code}
                </text>

                {/* Start/End indicators */}
                {isStart && (
                    <text
                        x={`${position.x}%`}
                        y={`${position.y - 4}%`}
                        textAnchor="middle"
                        fontSize="4"
                        fill="#667eea"
                        fontWeight="800"
                        className="city-status-label"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                        START
                    </text>
                )}
                {isEnd && (
                    <text
                        x={`${position.x}%`}
                        y={`${position.y - 4}%`}
                        textAnchor="middle"
                        fontSize="4"
                        fill="#43e97b"
                        fontWeight="800"
                        className="city-status-label"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                        END
                    </text>
                )}
            </g>
        );
    };

    const totalPrice = connection.totalPrice;
    const totalDuration = connection.totalDuration;

    return (
        <div className="route-map-container">
            <div className="map-header">
                <div className="map-title-section">
                    <h3 className="map-title">🗺️ Interactive Route Visualization</h3>
                    <p className="map-subtitle">
                        Dijkstra's algorithm guarantees the optimal path
                    </p>
                </div>
                <button
                    className="btn-toggle-routes"
                    onClick={() => setShowAllRoutes(!showAllRoutes)}
                >
                    {showAllRoutes ? '👁️ Hide Alternatives' : '👁️ Show Alternative Routes'}
                </button>
            </div>

            <div className="map-stats">
                <div className="map-stat">
                    <span className="map-stat-label">Optimal Cost</span>
                    <span className="map-stat-value optimal">${totalPrice}</span>
                </div>
                <div className="map-stat">
                    <span className="map-stat-label">Total Duration</span>
                    <span className="map-stat-value">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
                <div className="map-stat">
                    <span className="map-stat-label">Stops</span>
                    <span className="map-stat-value">{connection.transfers}</span>
                </div>
            </div>

            <svg className="route-map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="optimalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#43e97b" />
                        <stop offset="100%" stopColor="#38f9d7" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background grid */}
                <g className="grid" opacity="0.1">
                    {[...Array(10)].map((_, i) => (
                        <React.Fragment key={i}>
                            <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#fff" strokeWidth="0.5" />
                            <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#fff" strokeWidth="0.5" />
                        </React.Fragment>
                    ))}
                </g>

                {/* Alternative routes (if shown) */}
                {showAllRoutes && alternativeRoutes.map((route, index) => (
                    <g key={`alt-route-${index}`}>
                        {renderPath(route, false, index)}
                    </g>
                ))}

                {/* Optimal route */}
                <g className="optimal-route">
                    {renderPath(connection.flights, true)}
                </g>

                {/* City nodes */}
                {Object.entries(cityPositions).map(([code, position]) =>
                    renderCity(code, position)
                )}
            </svg>

            <div className="map-legend">
                <div className="legend-item">
                    <div className="legend-color" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}></div>
                    <span>Optimal Path (Dijkstra)</span>
                </div>
                {showAllRoutes && (
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px dashed rgba(255, 255, 255, 0.3)' }}></div>
                        <span>Alternative Routes</span>
                    </div>
                )}
                <div className="legend-item">
                    <div className="legend-color" style={{ background: '#667eea' }}></div>
                    <span>Start City</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ background: '#43e97b' }}></div>
                    <span>Destination</span>
                </div>
            </div>
        </div>
    );
};
