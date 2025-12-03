import type { Flight, City } from '../types/flight';

export const cities: City[] = [
    { code: 'NYC', name: 'New York' },
    { code: 'LAX', name: 'Los Angeles' },
    { code: 'CHI', name: 'Chicago' },
    { code: 'MIA', name: 'Miami' },
    { code: 'SEA', name: 'Seattle' },
    { code: 'DEN', name: 'Denver' },
    { code: 'ATL', name: 'Atlanta' },
    { code: 'SFO', name: 'San Francisco' },
    { code: 'LAS', name: 'Las Vegas' },
    { code: 'BOS', name: 'Boston' },
];

export const sampleFlights: Flight[] = [
    // NYC routes
    { id: 'F001', from: 'NYC', to: 'LAX', airline: 'Delta', price: 350, duration: 360, departureTime: '08:00', arrivalTime: '14:00' },
    { id: 'F002', from: 'NYC', to: 'CHI', airline: 'United', price: 180, duration: 150, departureTime: '09:00', arrivalTime: '11:30' },
    { id: 'F003', from: 'NYC', to: 'MIA', airline: 'American', price: 220, duration: 180, departureTime: '10:00', arrivalTime: '13:00' },
    { id: 'F004', from: 'NYC', to: 'BOS', airline: 'JetBlue', price: 120, duration: 75, departureTime: '07:00', arrivalTime: '08:15' },
    { id: 'F005', from: 'NYC', to: 'ATL', airline: 'Delta', price: 200, duration: 165, departureTime: '11:00', arrivalTime: '13:45' },
    { id: 'F043', from: 'NYC', to: 'DEN', airline: 'United', price: 200, duration: 240, departureTime: '13:00', arrivalTime: '17:00' },
    { id: 'F044', from: 'NYC', to: 'SEA', airline: 'Alaska', price: 320, duration: 340, departureTime: '15:00', arrivalTime: '20:40' },
    // Expensive direct NYC to SFO (fast but costly)
    { id: 'F060', from: 'NYC', to: 'SFO', airline: 'United', price: 450, duration: 360, departureTime: '06:00', arrivalTime: '12:00' },
    { id: 'F061', from: 'NYC', to: 'SFO', airline: 'Delta', price: 480, duration: 350, departureTime: '14:00', arrivalTime: '19:50' },
    // Cheaper NYC routes through budget airlines
    { id: 'F062', from: 'NYC', to: 'CHI', airline: 'Spirit', price: 120, duration: 180, departureTime: '05:00', arrivalTime: '08:00' },
    { id: 'F063', from: 'NYC', to: 'ATL', airline: 'Frontier', price: 150, duration: 185, departureTime: '06:00', arrivalTime: '09:05' },

    // LAX routes
    { id: 'F006', from: 'LAX', to: 'SFO', airline: 'United', price: 150, duration: 90, departureTime: '15:00', arrivalTime: '16:30' },
    { id: 'F007', from: 'LAX', to: 'SEA', airline: 'Alaska', price: 200, duration: 165, departureTime: '16:00', arrivalTime: '18:45' },
    { id: 'F008', from: 'LAX', to: 'LAS', airline: 'Southwest', price: 100, duration: 75, departureTime: '14:00', arrivalTime: '15:15' },
    { id: 'F009', from: 'LAX', to: 'DEN', airline: 'United', price: 180, duration: 135, departureTime: '17:00', arrivalTime: '19:15' },
    { id: 'F010', from: 'LAX', to: 'CHI', airline: 'American', price: 280, duration: 240, departureTime: '10:00', arrivalTime: '14:00' },
    { id: 'F045', from: 'LAX', to: 'NYC', airline: 'JetBlue', price: 340, duration: 330, departureTime: '22:00', arrivalTime: '06:30' },
    { id: 'F046', from: 'LAX', to: 'MIA', airline: 'American', price: 300, duration: 300, departureTime: '08:00', arrivalTime: '16:00' },
    // Budget LAX routes
    { id: 'F064', from: 'LAX', to: 'SFO', airline: 'Southwest', price: 90, duration: 105, departureTime: '07:00', arrivalTime: '08:45' },
    { id: 'F065', from: 'LAX', to: 'LAS', airline: 'Spirit', price: 60, duration: 90, departureTime: '20:00', arrivalTime: '21:30' },

    // CHI routes
    { id: 'F011', from: 'CHI', to: 'DEN', airline: 'United', price: 160, duration: 135, departureTime: '12:00', arrivalTime: '14:15' },
    { id: 'F012', from: 'CHI', to: 'ATL', airline: 'Delta', price: 170, duration: 120, departureTime: '13:00', arrivalTime: '15:00' },
    { id: 'F013', from: 'CHI', to: 'MIA', airline: 'American', price: 250, duration: 195, departureTime: '14:00', arrivalTime: '17:15' },
    { id: 'F014', from: 'CHI', to: 'SEA', airline: 'Alaska', price: 240, duration: 240, departureTime: '09:00', arrivalTime: '13:00' },
    { id: 'F015', from: 'CHI', to: 'LAX', airline: 'Southwest', price: 220, duration: 240, departureTime: '08:00', arrivalTime: '12:00' },
    { id: 'F047', from: 'CHI', to: 'NYC', airline: 'United', price: 190, duration: 140, departureTime: '16:00', arrivalTime: '19:20' },
    { id: 'F048', from: 'CHI', to: 'BOS', airline: 'American', price: 210, duration: 150, departureTime: '18:00', arrivalTime: '21:30' },
    // CHI to SFO routes (expensive direct vs cheaper connecting)
    { id: 'F066', from: 'CHI', to: 'SFO', airline: 'United', price: 380, duration: 260, departureTime: '10:00', arrivalTime: '14:20' },
    { id: 'F067', from: 'CHI', to: 'SFO', airline: 'American', price: 400, duration: 250, departureTime: '15:00', arrivalTime: '19:10' },
    { id: 'F068', from: 'CHI', to: 'DEN', airline: 'Frontier', price: 110, duration: 155, departureTime: '07:00', arrivalTime: '09:35' },

    // MIA routes
    { id: 'F016', from: 'MIA', to: 'ATL', airline: 'Delta', price: 140, duration: 120, departureTime: '14:00', arrivalTime: '16:00' },
    { id: 'F017', from: 'MIA', to: 'NYC', airline: 'JetBlue', price: 210, duration: 180, departureTime: '15:00', arrivalTime: '18:00' },
    { id: 'F018', from: 'MIA', to: 'CHI', airline: 'United', price: 260, duration: 195, departureTime: '11:00', arrivalTime: '14:15' },
    { id: 'F019', from: 'MIA', to: 'LAX', airline: 'American', price: 340, duration: 330, departureTime: '09:00', arrivalTime: '14:30' },
    { id: 'F049', from: 'MIA', to: 'DEN', airline: 'Frontier', price: 180, duration: 240, departureTime: '07:00', arrivalTime: '11:00' },
    { id: 'F069', from: 'MIA', to: 'ATL', airline: 'Spirit', price: 90, duration: 145, departureTime: '19:00', arrivalTime: '21:25' },

    // SEA routes
    { id: 'F020', from: 'SEA', to: 'SFO', airline: 'Alaska', price: 160, duration: 120, departureTime: '19:00', arrivalTime: '21:00' },
    { id: 'F021', from: 'SEA', to: 'DEN', airline: 'United', price: 190, duration: 165, departureTime: '14:00', arrivalTime: '16:45' },
    { id: 'F022', from: 'SEA', to: 'LAX', airline: 'Delta', price: 180, duration: 165, departureTime: '10:00', arrivalTime: '12:45' },
    { id: 'F023', from: 'SEA', to: 'CHI', airline: 'American', price: 270, duration: 240, departureTime: '08:00', arrivalTime: '12:00' },
    { id: 'F050', from: 'SEA', to: 'LAS', airline: 'Spirit', price: 110, duration: 150, departureTime: '20:00', arrivalTime: '22:30' },
    { id: 'F070', from: 'SEA', to: 'SFO', airline: 'Southwest', price: 120, duration: 135, departureTime: '11:00', arrivalTime: '13:15' },

    // DEN routes
    { id: 'F024', from: 'DEN', to: 'SFO', airline: 'United', price: 230, duration: 150, departureTime: '15:00', arrivalTime: '17:30' },
    { id: 'F025', from: 'DEN', to: 'ATL', airline: 'Delta', price: 200, duration: 180, departureTime: '16:00', arrivalTime: '19:00' },
    { id: 'F026', from: 'DEN', to: 'NYC', airline: 'United', price: 240, duration: 240, departureTime: '10:00', arrivalTime: '14:00' },
    { id: 'F027', from: 'DEN', to: 'LAS', airline: 'Southwest', price: 120, duration: 105, departureTime: '12:00', arrivalTime: '13:45' },
    { id: 'F051', from: 'DEN', to: 'SEA', airline: 'Alaska', price: 180, duration: 170, departureTime: '09:00', arrivalTime: '11:50' },
    { id: 'F052', from: 'DEN', to: 'MIA', airline: 'Frontier', price: 190, duration: 230, departureTime: '13:00', arrivalTime: '18:50' },
    // Cheaper DEN to SFO
    { id: 'F071', from: 'DEN', to: 'SFO', airline: 'Frontier', price: 150, duration: 175, departureTime: '18:00', arrivalTime: '20:55' },
    { id: 'F072', from: 'DEN', to: 'LAX', airline: 'Spirit', price: 130, duration: 155, departureTime: '06:00', arrivalTime: '08:35' },

    // ATL routes
    { id: 'F028', from: 'ATL', to: 'NYC', airline: 'Delta', price: 190, duration: 150, departureTime: '17:00', arrivalTime: '19:30' },
    { id: 'F029', from: 'ATL', to: 'MIA', airline: 'American', price: 150, duration: 120, departureTime: '18:00', arrivalTime: '20:00' },
    { id: 'F030', from: 'ATL', to: 'LAX', airline: 'Delta', price: 300, duration: 270, departureTime: '09:00', arrivalTime: '13:30' },
    { id: 'F031', from: 'ATL', to: 'CHI', airline: 'United', price: 180, duration: 135, departureTime: '16:00', arrivalTime: '18:15' },
    { id: 'F053', from: 'ATL', to: 'DEN', airline: 'Southwest', price: 210, duration: 190, departureTime: '11:00', arrivalTime: '14:10' },
    { id: 'F054', from: 'ATL', to: 'BOS', airline: 'JetBlue', price: 160, duration: 140, departureTime: '14:00', arrivalTime: '16:20' },
    { id: 'F073', from: 'ATL', to: 'SFO', airline: 'Delta', price: 420, duration: 300, departureTime: '12:00', arrivalTime: '17:00' },
    { id: 'F074', from: 'ATL', to: 'DEN', airline: 'Frontier', price: 160, duration: 210, departureTime: '08:00', arrivalTime: '11:30' },

    // SFO routes
    { id: 'F032', from: 'SFO', to: 'LAX', airline: 'United', price: 140, duration: 90, departureTime: '18:00', arrivalTime: '19:30' },
    { id: 'F033', from: 'SFO', to: 'SEA', airline: 'Alaska', price: 170, duration: 120, departureTime: '22:00', arrivalTime: '00:00' },
    { id: 'F034', from: 'SFO', to: 'DEN', airline: 'United', price: 180, duration: 150, departureTime: '19:00', arrivalTime: '21:30' },
    { id: 'F035', from: 'SFO', to: 'CHI', airline: 'American', price: 280, duration: 240, departureTime: '07:00', arrivalTime: '11:00' },
    { id: 'F055', from: 'SFO', to: 'LAS', airline: 'Southwest', price: 110, duration: 95, departureTime: '10:00', arrivalTime: '11:35' },
    { id: 'F075', from: 'SFO', to: 'NYC', airline: 'United', price: 460, duration: 350, departureTime: '08:00', arrivalTime: '14:50' },
    { id: 'F076', from: 'SFO', to: 'NYC', airline: 'JetBlue', price: 440, duration: 360, departureTime: '16:00', arrivalTime: '23:00' },

    // LAS routes
    { id: 'F036', from: 'LAS', to: 'LAX', airline: 'Southwest', price: 90, duration: 75, departureTime: '16:00', arrivalTime: '17:15' },
    { id: 'F037', from: 'LAS', to: 'DEN', airline: 'United', price: 130, duration: 105, departureTime: '14:00', arrivalTime: '15:45' },
    { id: 'F038', from: 'LAS', to: 'SFO', airline: 'Southwest', price: 120, duration: 90, departureTime: '15:00', arrivalTime: '16:30' },
    { id: 'F056', from: 'LAS', to: 'SEA', airline: 'Spirit', price: 100, duration: 140, departureTime: '21:00', arrivalTime: '23:20' },
    { id: 'F057', from: 'LAS', to: 'NYC', airline: 'JetBlue', price: 290, duration: 300, departureTime: '23:00', arrivalTime: '07:00' },
    { id: 'F077', from: 'LAS', to: 'SFO', airline: 'Spirit', price: 80, duration: 110, departureTime: '09:00', arrivalTime: '10:50' },

    // BOS routes
    { id: 'F039', from: 'BOS', to: 'NYC', airline: 'JetBlue', price: 110, duration: 75, departureTime: '09:00', arrivalTime: '10:15' },
    { id: 'F040', from: 'BOS', to: 'CHI', airline: 'United', price: 200, duration: 165, departureTime: '10:00', arrivalTime: '12:45' },
    { id: 'F041', from: 'BOS', to: 'MIA', airline: 'JetBlue', price: 230, duration: 195, departureTime: '11:00', arrivalTime: '14:15' },
    { id: 'F042', from: 'BOS', to: 'ATL', airline: 'Delta', price: 190, duration: 165, departureTime: '12:00', arrivalTime: '14:45' },
    { id: 'F058', from: 'BOS', to: 'DEN', airline: 'United', price: 280, duration: 260, departureTime: '08:00', arrivalTime: '12:20' },
    { id: 'F059', from: 'BOS', to: 'SFO', airline: 'Alaska', price: 350, duration: 380, departureTime: '17:00', arrivalTime: '23:20' },
    { id: 'F078', from: 'BOS', to: 'NYC', airline: 'Delta', price: 130, duration: 80, departureTime: '15:00', arrivalTime: '16:20' },
];
