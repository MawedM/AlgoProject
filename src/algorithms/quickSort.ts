import type { Flight, SortCriteria } from '../types/flight';

/**
 * QuickSort implementation to sort flights by different criteria
 */
export class FlightSorter {
    /**
     * Main QuickSort function
     */
    static quickSort(
        flights: Flight[],
        criteria: SortCriteria,
        left: number = 0,
        right: number = flights.length - 1
    ): Flight[] {
        if (left < right) {
            const pivotIndex = this.partition(flights, criteria, left, right);
            this.quickSort(flights, criteria, left, pivotIndex - 1);
            this.quickSort(flights, criteria, pivotIndex + 1, right);
        }
        return flights;
    }

    /**
     * Partition function for QuickSort
     */
    private static partition(
        flights: Flight[],
        criteria: SortCriteria,
        left: number,
        right: number
    ): number {
        const pivot = flights[right];
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (this.compare(flights[j], pivot, criteria) <= 0) {
                i++;
                [flights[i], flights[j]] = [flights[j], flights[i]];
            }
        }

        [flights[i + 1], flights[right]] = [flights[right], flights[i + 1]];
        return i + 1;
    }

    /**
     * Compare two flights based on criteria
     */
    private static compare(a: Flight, b: Flight, criteria: SortCriteria): number {
        switch (criteria) {
            case 'price':
                return a.price - b.price;
            case 'duration':
                return a.duration - b.duration;
            case 'airline':
                return a.airline.localeCompare(b.airline);
            default:
                return 0;
        }
    }

    /**
     * Public method to sort flights
     */
    static sortFlights(flights: Flight[], criteria: SortCriteria): Flight[] {
        const flightsCopy = [...flights];
        return this.quickSort(flightsCopy, criteria);
    }
}
