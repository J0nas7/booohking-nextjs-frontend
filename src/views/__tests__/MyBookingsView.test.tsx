import { BookingDTO, UserDTO } from '@/types';
import { MyBookingsView } from '@/views/my-bookings/MyBookingsView';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement

// Mock MyBookings and MyBookingsLoading
jest.mock('@/views/my-bookings/MyBookings', () => ({
    MyBookings: jest.fn(() => <div data-testid="mock-my-bookings">Mock MyBookings</div>),
    MyBookingsLoading: jest.fn(({ repeat }: any) => (
        <div data-testid="mock-my-bookings-loading">Loading {repeat} items</div>
    )),
}));

// Sample data
const authUser: UserDTO = {
    User_ID: 1,
    name: 'Test User',
    User_Email: 'test@example.com',
    User_Password: 'hashedpassword',
    role: 'ROLE_USER',
};

const flatMyBookings: BookingDTO[] = [
    {
        Booking_ID: 1,
        User_ID: 1,
        Provider_ID: 1,
        Service_ID: 1,
        Booking_StartAt: '2025-12-08T09:00:00Z',
        Booking_EndAt: '2025-12-08T09:30:00Z',
        Booking_Status: 'booked',
    },
    {
        Booking_ID: 2,
        User_ID: 1,
        Provider_ID: 2,
        Service_ID: 2,
        Booking_StartAt: '2025-12-08T10:00:00Z',
        Booking_EndAt: '2025-12-08T10:30:00Z',
        Booking_Status: 'booked',
    },
];

describe('MyBookingsView', () => {

    it('renders loading state when myBookingsLoading is true', () => {
        render(<MyBookingsView myBookingsLoading={true} authUser={authUser} flatMyBookings={undefined} />);

        // Check that loading placeholders render
        expect(screen.getAllByTestId(/mock-my-bookings-loading/i).length).toBeGreaterThan(0);

        // The actual MyBookings component should NOT be rendered when loading
        expect(screen.queryByTestId('mock-my-bookings')).not.toBeInTheDocument();
    });

    it('renders MyBookings when not loading and authUser exists', () => {
        render(<MyBookingsView myBookingsLoading={false} authUser={authUser} flatMyBookings={flatMyBookings} />);

        const myBookingsEl = screen.getByTestId('mock-my-bookings');
        expect(myBookingsEl).toBeInTheDocument();
    });

    it('does not render MyBookings if authUser is undefined', () => {
        render(<MyBookingsView myBookingsLoading={false} authUser={undefined} flatMyBookings={flatMyBookings} />);
        expect(screen.queryByTestId('mock-my-bookings')).not.toBeInTheDocument();
    });

});
