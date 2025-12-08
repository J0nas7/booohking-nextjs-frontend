import { ProviderStates } from '@/types';
import { BookingProviderView, BookingProviderViewProps } from '@/views';
import { render, screen } from '@testing-library/react';
import React, { createRef } from 'react';

void React.createElement

// Mock PickTimeslot and PickTimeslotLoading
jest.mock('@/views/bookings/provider/PickTimeslot', () => ({
    PickTimeslot: jest.fn(({ provider, flatAvailableSlots }: any) => (
        <div data-testid="mock-pick-timeslot">
            PickTimeslot: {provider?.Provider_Name}, Slots: {flatAvailableSlots?.length ?? 0}
        </div>
    )),
    PickTimeslotLoading: jest.fn(({ repeat }: any) => (
        <div data-testid="mock-pick-timeslot-loading">Loading {repeat} items</div>
    )),
}));

describe('BookingProviderView', () => {
    let props: BookingProviderViewProps;

    beforeEach(() => {
        props = {
            renderProvider: {
                Provider_Name: 'Provider A',
                Service_ID: 1,
                service: { Service_Name: 'Service A' },
            } as ProviderStates,
            providerLoading: false,
            availableSlotsLoading: false,
            flatAvailableSlots: [{ id: 1 }, { id: 2 }],
            convertURLFormat: (id: number, name: string) => `${id}-${name}`,
            containerRef: createRef<HTMLDivElement>(),
            hasNextPage: true,
            isFetchingNextPage: false,
        };
    });

    it('renders provider name and H1', () => {
        render(<BookingProviderView {...props} />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Provider A');
    });

    it('renders PickTimeslotLoading when providerLoading is true', () => {
        props.providerLoading = true;
        props.renderProvider = undefined
        render(<BookingProviderView {...props} />);
        expect(screen.getByTestId('mock-pick-timeslot-loading')).toBeInTheDocument();
    });

    it('renders PickTimeslot with correct props', () => {
        render(<BookingProviderView {...props} />);
        const pickTimeslot = screen.getByTestId('mock-pick-timeslot');
        expect(pickTimeslot).toHaveTextContent('PickTimeslot: Provider A');
        expect(pickTimeslot).toHaveTextContent('Slots: 2');
    });

    it('renders "No more time slots yet" when hasNextPage is false', () => {
        props.hasNextPage = false;
        render(<BookingProviderView {...props} />);
        expect(screen.getByText('No more time slots yet')).toBeInTheDocument();
    });

    it('renders LoadingButton when isFetchingNextPage is true', () => {
        props.isFetchingNextPage = true;
        render(<BookingProviderView {...props} />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders link back to service page', () => {
        render(<BookingProviderView {...props} />);
        const link = screen.getByRole('link', { name: /Go back to providers/i });
        expect(link).toHaveAttribute('href', '/service/1-Service A');
    });
});
