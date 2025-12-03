// Flight data types
export interface Flight {
    id: string;
    from: string;
    to: string;
    airline: string;
    price: number;
    duration: number; // in minutes
    departureTime: string;
    arrivalTime: string;
}

export interface Connection {
    flights: Flight[];
    totalPrice: number;
    totalDuration: number;
    transfers: number;
}

export interface City {
    code: string;
    name: string;
}

export type SortCriteria = 'price' | 'duration' | 'airline';
export type PathAlgorithm = 'dijkstra' | 'bfs';
