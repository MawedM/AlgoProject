import React from 'react';
import type { City, SortCriteria } from '../types/flight';

interface SearchFormProps {
    cities: City[];
    fromCity: string;
    toCity: string;
    sortBy: SortCriteria;
    onFromCityChange: (city: string) => void;
    onToCityChange: (city: string) => void;
    onSortByChange: (criteria: SortCriteria) => void;
    onSearch: () => void;
    onClear: () => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
    cities,
    fromCity,
    toCity,
    sortBy,
    onFromCityChange,
    onToCityChange,
    onSortByChange,
    onSearch,
    onClear,
}) => {
    const isSearchDisabled = !fromCity || !toCity;

    return (
        <div className="glass-card search-section">
            <div className="search-grid">
                <div className="form-group">
                    <label className="form-label">From</label>
                    <select
                        className="form-select"
                        value={fromCity}
                        onChange={(e) => onFromCityChange(e.target.value)}
                    >
                        <option value="">Select departure city</option>
                        {cities.map((city) => (
                            <option key={city.code} value={city.code}>
                                {city.name} ({city.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">To</label>
                    <select
                        className="form-select"
                        value={toCity}
                        onChange={(e) => onToCityChange(e.target.value)}
                    >
                        <option value="">Select destination city</option>
                        {cities.map((city) => (
                            <option key={city.code} value={city.code}>
                                {city.name} ({city.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Sort By</label>
                    <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value as SortCriteria)}
                    >
                        <option value="price">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                        <option value="duration">Duration (Shortest First)</option>
                        <option value="airline">Airline (A-Z)</option>
                    </select>
                </div>
            </div>

            <div className="button-group">
                <button
                    className="btn btn-primary"
                    onClick={onSearch}
                    disabled={isSearchDisabled}
                    style={{ opacity: isSearchDisabled ? 0.5 : 1, cursor: isSearchDisabled ? 'not-allowed' : 'pointer' }}
                >
                    ✈️ Search Flights
                </button>
                <button className="btn btn-secondary" onClick={onClear}>
                    🔄 Clear
                </button>
            </div>
        </div>
    );
};
