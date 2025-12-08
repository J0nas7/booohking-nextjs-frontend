import { BookingDTO } from '@/types';
import { LoadingButton, LoadingState } from '@/ui/LoadingState';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement

describe('LoadingState Component', () => {

    it('renders default spinner when loading and no loadingTSX or tableTSX', () => {
        render(<LoadingState singular="Booking" isLoading={true} renderItem={undefined} permitted={true} />);
        const spinner = screen.getByTestId('state-spinner');
        expect(spinner).toBeInTheDocument();
    });

    it('renders loadingTSX when provided', () => {
        render(
            <LoadingState
                singular="Booking"
                isLoading={true}
                renderItem={undefined}
                permitted={true}
                loadingTSX={<div data-testid="custom-loading">Loading Custom</div>}
            />
        );
        expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
        expect(screen.getByText('Loading Custom')).toBeInTheDocument();
    });

    it('renders tableTSX when provided', () => {
        render(
            <LoadingState
                singular="Booking"
                isLoading={true}
                renderItem={undefined}
                permitted={true}
                tableTSX={<table data-testid="table-tsx"><tbody><tr><td>Table</td></tr></tbody></table>}
            />
        );
        expect(screen.getByTestId('table-tsx')).toBeInTheDocument();
        expect(screen.getByText('Table')).toBeInTheDocument();
    });

    it("shows permission denied message when permitted is false", () => {
        render(
            <LoadingState
                singular="Service"
                isLoading={false}
                renderItem={undefined}
                permitted={false}
            />
        );
        expect(screen.getByText(/you don't have permission to view this service/i)).toBeInTheDocument();
    });

    it('shows "not found" when renderItem is false', () => {
        render(
            <LoadingState
                singular="Provider"
                isLoading={false}
                renderItem={false}
                permitted={true}
            />
        );
        expect(screen.getByText(/Provider not found/i)).toBeInTheDocument();
    });

    it('shows "No ... found" when renderItem is empty array', () => {
        render(
            <LoadingState
                singular="Booking"
                isLoading={false}
                renderItem={[]}
                permitted={true}
            />
        );
        expect(screen.getByText(/No bookings found/i)).toBeInTheDocument();
    });

    it('renders children if none of the conditions match', () => {
        const bookingItem: BookingDTO = {
            User_ID: 1,
            Provider_ID: 1,
            Service_ID: 1,
            Booking_StartAt: '2025-12-08T12:00:00Z',
            Booking_EndAt: '2025-12-08T13:00:00Z',
            Booking_Status: 'booked',
        }
        render(
            <LoadingState
                singular="Booking"
                isLoading={false}
                renderItem={[bookingItem]}
                permitted={true}
            >
                <div data-testid="child">Child Content</div>
            </LoadingState>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});

describe('LoadingButton Component', () => {
    it('renders spinner with default props', () => {
        render(<LoadingButton size="3x" color="red" />);
        const spinner = screen.getByTestId('loading-spinner');
        expect(spinner).toBeInTheDocument();
    });

    it('renders and applies size and color props', () => {
        render(<LoadingButton size="3x" color="red" />);
        const spinner = screen.getByTestId('loading-spinner');

        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveAttribute('data-size', '3x');
        expect(spinner).toHaveAttribute('data-color', 'red');
    });
});
