import { BookingsStates, UserDTO } from '@/types';
import { AdminBookingsView, AdminBookingsViewProps } from '@/views';
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

describe('AdminBookingsView', () => {
    let props: AdminBookingsViewProps;

    beforeEach(() => {
        props = {
            adminBookingsLoading: false,
            authUser: { role: "ROLE_ADMIN", id: 1 } as UserDTO,
            flatAdminBookings: [],
        };
    });

    it('renders the main H1 heading', () => {
        render(<AdminBookingsView {...props} />);
        expect(screen.getByText(/Admin Booohkings/i)).toBeInTheDocument();
    });

    it('renders the first LoadingState with FontAwesomeIcon', () => {
        render(<AdminBookingsView {...props} />);
        expect(screen.getByTestId('heading-icon')).toBeInTheDocument();
    });

    it('renders the second LoadingState with MyBookingsLoading when loading', () => {
        props.adminBookingsLoading = true;
        props.flatAdminBookings = undefined
        render(<AdminBookingsView {...props} />);
        expect(screen.getByTestId('mock-my-bookings-loading')).toBeInTheDocument();
    });

    it('renders MyBookings when authUser is admin and bookings exist', () => {
        props.flatAdminBookings = [{ Booking_ID: 1, User_ID: 1, Provider_ID: 1, Service_ID: 1, Booking_StartAt: '', Booking_EndAt: '', Booking_Status: 'booked' }] as BookingsStates;
        render(<AdminBookingsView {...props} />);
        expect(screen.getByTestId('mock-my-bookings')).toBeInTheDocument();
    });

    it('does not render MyBookings if authUser is not admin', () => {
        props.authUser = { role: "ROLE_USER", id: 2 } as UserDTO;
        render(<AdminBookingsView {...props} />);
        expect(screen.queryByTestId('mock-my-bookings')).not.toBeInTheDocument();
    });
});
