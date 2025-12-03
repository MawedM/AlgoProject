import { useState, useEffect } from 'react';
import './index.css';
import type { Flight, SortCriteria, Connection } from './types/flight';
import { cities, sampleFlights } from './data/sampleData';
import { FlightSorter } from './algorithms/quickSort';
import { DijkstraPathFinder } from './algorithms/dijkstra';
import { BFSPathFinder } from './algorithms/bfs';
import { SearchForm } from './components/SearchForm';
import { FlightCard } from './components/FlightCard';
import { ConnectionCard } from './components/ConnectionCard';
import { RouteMap } from './components/RouteMap';
import { RouteComparison } from './components/RouteComparison';

type ViewMode = 'all-flights' | 'dijkstra-cheapest' | 'dijkstra-fastest' | 'bfs-all';

function App() {
  const [fromCity, setFromCity] = useState<string>('');
  const [toCity, setToCity] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortCriteria>('price');
  const [viewMode, setViewMode] = useState<ViewMode>('all-flights');
  const [sortedFlights, setSortedFlights] = useState<Flight[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [optimalConnection, setOptimalConnection] = useState<Connection | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sort all flights on mount and when sort criteria changes
  useEffect(() => {
    const sorted = FlightSorter.sortFlights(sampleFlights, sortBy);
    setSortedFlights(sorted);
  }, [sortBy]);

  const handleSearch = () => {
    setHasSearched(true);

    if (!fromCity || !toCity) {
      return;
    }

    // Find optimal path using Dijkstra (cheapest)
    const cheapestPath = DijkstraPathFinder.findOptimalPath(
      sampleFlights,
      fromCity,
      toCity
    );

    // Find fastest path using Dijkstra
    const fastestPath = DijkstraPathFinder.findFastestPath(
      sampleFlights,
      fromCity,
      toCity
    );

    // Find all paths using BFS
    const allPaths = BFSPathFinder.findAllPathsSorted(
      sampleFlights,
      fromCity,
      toCity,
      3,
      'price'
    );

    // Set results based on current view mode
    if (viewMode === 'dijkstra-cheapest') {
      setOptimalConnection(cheapestPath);
      setConnections([]);
    } else if (viewMode === 'dijkstra-fastest') {
      setOptimalConnection(fastestPath);
      setConnections([]);
    } else if (viewMode === 'bfs-all') {
      setConnections(allPaths);
      setOptimalConnection(null);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setHasSearched(false);
    setOptimalConnection(null);
    setConnections([]);
  };

  const getFilteredFlights = (): Flight[] => {
    if (!fromCity && !toCity) {
      return sortedFlights;
    }

    return sortedFlights.filter(flight => {
      const matchesFrom = !fromCity || flight.from === fromCity;
      const matchesTo = !toCity || flight.to === toCity;
      return matchesFrom && matchesTo;
    });
  };

  const renderContent = () => {
    if (viewMode === 'all-flights') {
      const filteredFlights = getFilteredFlights();

      if (filteredFlights.length === 0) {
        return (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h3 className="empty-title">No flights found</h3>
            <p className="empty-description">
              Try adjusting your search criteria
            </p>
          </div>
        );
      }

      return (
        <div className="flight-grid">
          {filteredFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">Ready to find connections</h3>
          <p className="empty-description">
            Select departure and destination cities, then click "Search Flights"
          </p>
        </div>
      );
    }

    if (!fromCity || !toCity) {
      return (
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3 className="empty-title">Missing information</h3>
          <p className="empty-description">
            Please select both departure and destination cities
          </p>
        </div>
      );
    }

    if (viewMode === 'dijkstra-cheapest' || viewMode === 'dijkstra-fastest') {
      if (!optimalConnection) {
        return (
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3 className="empty-title">No route found</h3>
            <p className="empty-description">
              No connection available between {fromCity} and {toCity}
            </p>
          </div>
        );
      }

      return (
        <div>
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              {viewMode === 'dijkstra-cheapest' ? '💰 Cheapest Route' : '⚡ Fastest Route'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Found using Dijkstra's algorithm - guaranteed optimal path
            </p>
          </div>
          <RouteMap
            connection={optimalConnection}
            allFlights={sampleFlights}
            fromCity={fromCity}
            toCity={toCity}
          />
          <RouteComparison
            optimalConnection={optimalConnection}
            allFlights={sampleFlights}
            fromCity={fromCity}
            toCity={toCity}
            optimizationType={viewMode === 'dijkstra-cheapest' ? 'price' : 'duration'}
          />
          <ConnectionCard connection={optimalConnection} />
        </div>
      );
    }

    if (viewMode === 'bfs-all') {
      if (connections.length === 0) {
        return (
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3 className="empty-title">No routes found</h3>
            <p className="empty-description">
              No connections available between {fromCity} and {toCity}
            </p>
          </div>
        );
      }

      return (
        <div>
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              🗺️ All Possible Routes ({connections.length})
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Found using BFS algorithm - sorted by price (max 3 transfers)
            </p>
          </div>
          {connections.map((connection, index) => (
            <ConnectionCard
              key={index}
              connection={connection}
              rank={index + 1}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  const handleClear = () => {
    setFromCity('');
    setToCity('');
    setHasSearched(false);
    setOptimalConnection(null);
    setConnections([]);
    setViewMode('all-flights');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">✈️ Flight Connection Finder</h1>
        <p className="app-subtitle">
          Advanced flight routing with QuickSort, Dijkstra & BFS algorithms
        </p>
      </header>

      <SearchForm
        cities={cities}
        fromCity={fromCity}
        toCity={toCity}
        sortBy={sortBy}
        onFromCityChange={setFromCity}
        onToCityChange={setToCity}
        onSortByChange={setSortBy}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="tabs">
          <button
            className={`tab ${viewMode === 'all-flights' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('all-flights')}
          >
            📋 All Flights (QuickSort)
          </button>
          <button
            className={`tab ${viewMode === 'dijkstra-cheapest' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('dijkstra-cheapest')}
          >
            💰 Cheapest Route (Dijkstra)
          </button>
          <button
            className={`tab ${viewMode === 'dijkstra-fastest' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('dijkstra-fastest')}
          >
            ⚡ Fastest Route (Dijkstra)
          </button>
          <button
            className={`tab ${viewMode === 'bfs-all' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('bfs-all')}
          >
            🗺️ All Routes (BFS)
          </button>
        </div>

        <div className="section-header">
          <h2 className="section-title">
            {viewMode === 'all-flights' && 'Available Flights'}
            {viewMode === 'dijkstra-cheapest' && 'Optimal Route - Cheapest'}
            {viewMode === 'dijkstra-fastest' && 'Optimal Route - Fastest'}
            {viewMode === 'bfs-all' && 'All Possible Routes'}
          </h2>
          {viewMode === 'all-flights' && (
            <span className="badge badge-info">
              {getFilteredFlights().length} flights
            </span>
          )}
        </div>

        {renderContent()}
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
          🧮 Algorithms Used
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>QuickSort:</strong>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              Efficiently sorts all flights by price, duration, or airline in O(n log n) time
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Dijkstra's Algorithm:</strong>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              Finds the guaranteed optimal (cheapest or fastest) path between cities
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>BFS (Breadth-First Search):</strong>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              Discovers all possible connection options with up to 3 transfers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
