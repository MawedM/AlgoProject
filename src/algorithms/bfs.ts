import type { Flight, Connection } from '../types/flight';

/**
 * BFS algorithm to find all possible connection options
 */
export class BFSPathFinder {
    /**
     * Find all possible paths using BFS with depth limit
     */
    static findAllPaths(
        flights: Flight[],
        start: string,
        end: string,
        maxTransfers: number = 3
    ): Connection[] {
        const graph = this.buildGraph(flights);
        const allPaths: Connection[] = [];

        // Queue stores: [current city, path of flights, visited cities]
        const queue: Array<{
            city: string;
            path: Flight[];
            visited: Set<string>;
        }> = [{
            city: start,
            path: [],
            visited: new Set([start])
        }];

        while (queue.length > 0) {
            const { city, path, visited } = queue.shift()!;

            // If we've reached the destination
            if (city === end && path.length > 0) {
                const totalPrice = path.reduce((sum, f) => sum + f.price, 0);
                const totalDuration = path.reduce((sum, f) => sum + f.duration, 0);

                allPaths.push({
                    flights: [...path],
                    totalPrice,
                    totalDuration,
                    transfers: path.length - 1
                });
                continue;
            }

            // Don't explore further if we've hit max transfers
            if (path.length > maxTransfers) continue;

            // Explore neighbors
            const neighbors = graph.get(city) || [];
            neighbors.forEach(flight => {
                if (!visited.has(flight.to)) {
                    const newVisited = new Set(visited);
                    newVisited.add(flight.to);

                    queue.push({
                        city: flight.to,
                        path: [...path, flight],
                        visited: newVisited
                    });
                }
            });
        }

        return allPaths;
    }

    /**
     * Build adjacency list graph from flights
     */
    private static buildGraph(flights: Flight[]): Map<string, Flight[]> {
        const graph = new Map<string, Flight[]>();

        flights.forEach(flight => {
            if (!graph.has(flight.from)) {
                graph.set(flight.from, []);
            }
            graph.get(flight.from)!.push(flight);
        });

        return graph;
    }

    /**
     * Find all paths and sort by criteria
     */
    static findAllPathsSorted(
        flights: Flight[],
        start: string,
        end: string,
        maxTransfers: number = 3,
        sortBy: 'price' | 'duration' | 'transfers' = 'price'
    ): Connection[] {
        const paths = this.findAllPaths(flights, start, end, maxTransfers);

        return paths.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.totalPrice - b.totalPrice;
                case 'duration':
                    return a.totalDuration - b.totalDuration;
                case 'transfers':
                    return a.transfers - b.transfers;
                default:
                    return 0;
            }
        });
    }
}
