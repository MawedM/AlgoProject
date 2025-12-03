import type { Flight, Connection } from '../types/flight';

/**
 * Dijkstra's algorithm to find the cheapest/fastest path between cities
 */
export class DijkstraPathFinder {
    /**
     * Find the optimal path using Dijkstra's algorithm
     */
    static findOptimalPath(
        flights: Flight[],
        start: string,
        end: string
    ): Connection | null {
        // Build adjacency list
        const graph = this.buildGraph(flights);

        // Initialize distances and previous nodes
        const distances: Map<string, number> = new Map();
        const previous: Map<string, { city: string; flight: Flight } | null> = new Map();
        const unvisited = new Set<string>();

        // Get all cities
        const cities = new Set<string>();
        flights.forEach(f => {
            cities.add(f.from);
            cities.add(f.to);
        });

        // Initialize all distances to infinity
        cities.forEach(city => {
            distances.set(city, Infinity);
            previous.set(city, null);
            unvisited.add(city);
        });

        // Distance to start is 0
        distances.set(start, 0);

        while (unvisited.size > 0) {
            // Find unvisited node with minimum distance
            let current: string | null = null;
            let minDistance = Infinity;

            unvisited.forEach(city => {
                const dist = distances.get(city)!;
                if (dist < minDistance) {
                    minDistance = dist;
                    current = city;
                }
            });

            if (current === null || current === end) break;
            if (minDistance === Infinity) break;

            unvisited.delete(current);

            // Check all neighbors
            const neighbors = graph.get(current) || [];
            neighbors.forEach(({ flight, cost }) => {
                if (!unvisited.has(flight.to)) return;

                const newDistance = distances.get(current!)! + cost;
                if (newDistance < distances.get(flight.to)!) {
                    distances.set(flight.to, newDistance);
                    previous.set(flight.to, { city: current!, flight });
                }
            });
        }

        // Reconstruct path
        if (distances.get(end) === Infinity) {
            return null;
        }

        return this.reconstructPath(previous, start, end);
    }

    /**
     * Build adjacency list graph from flights
     */
    private static buildGraph(flights: Flight[]): Map<string, Array<{ flight: Flight; cost: number }>> {
        const graph = new Map<string, Array<{ flight: Flight; cost: number }>>();

        flights.forEach(flight => {
            if (!graph.has(flight.from)) {
                graph.set(flight.from, []);
            }

            // Cost can be price or duration
            graph.get(flight.from)!.push({
                flight,
                cost: flight.price // Default to price, can be changed to duration
            });
        });

        return graph;
    }

    /**
     * Reconstruct the path from previous nodes
     */
    private static reconstructPath(
        previous: Map<string, { city: string; flight: Flight } | null>,
        start: string,
        end: string
    ): Connection {
        const flights: Flight[] = [];
        let current = end;

        while (current !== start) {
            const prev = previous.get(current);
            if (!prev) break;
            flights.unshift(prev.flight);
            current = prev.city;
        }

        const totalPrice = flights.reduce((sum, f) => sum + f.price, 0);
        const totalDuration = flights.reduce((sum, f) => sum + f.duration, 0);

        return {
            flights,
            totalPrice,
            totalDuration,
            transfers: flights.length - 1
        };
    }

    /**
     * Find optimal path optimized by duration
     */
    static findFastestPath(flights: Flight[], start: string, end: string): Connection | null {
        // Modify flights to use duration as cost
        const modifiedFlights = flights.map(f => ({ ...f, price: f.duration }));
        const result = this.findOptimalPath(modifiedFlights, start, end);

        if (result) {
            // Restore original prices
            result.flights = result.flights.map(f => {
                const original = flights.find(flight => flight.id === f.id);
                return original || f;
            });
            result.totalPrice = result.flights.reduce((sum, f) => sum + f.price, 0);
        }

        return result;
    }
}
