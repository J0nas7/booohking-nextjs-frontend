import { mockStoreBooking, TestSetupProvider } from '@/jest.setup';
import { ProviderStates } from '@/types';
import { PickTimeslot, PickTimeslotLoading } from '@/views';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

// Mock Redux hooks
const mockDispatch = jest.fn();
jest.mock('@/redux', () => ({
    useAppDispatch: () => mockDispatch,
    useTypedSelector: jest.fn(() => ({ User_ID: 1, User_Role: 'ROLE_USER' })),
    selectAuthUser: jest.fn(),
    setSnackMessage: jest.fn(),
}));

describe('PickTimeslot', () => {
    let provider: ProviderStates;
    let flatAvailableSlots: any[];

    beforeEach(() => {
        jest.clearAllMocks();
        provider = {
            Provider_Name: 'Provider A',
            Provider_ID: 1,
            working_hours: [{ PWH_DayOfWeek: new Date().getDay(), PWH_StartTime: '08:00', PWH_EndTime: '16:00' }],
        } as ProviderStates;

        flatAvailableSlots = [
            { date: new Date().toISOString().substring(0, 10), start: '09:00', end: '09:30' },
            { date: new Date().toISOString().substring(0, 10), start: '10:00', end: '10:30' },
        ];
    });

    it('renders slots grouped by date', () => {
        render(<PickTimeslot provider={provider} flatAvailableSlots={flatAvailableSlots} />);
        const dateHeader = screen.getByText((content, element) => element?.tagName === 'H3' && content.includes(new Date().toLocaleDateString(undefined, { weekday: 'long' })));
        expect(dateHeader).toBeInTheDocument();

        flatAvailableSlots.forEach(slot => {
            expect(screen.getByText(`${slot.start} → ${slot.end}`)).toBeInTheDocument();
        });
    });

    it('clicking a slot triggers storeBooking', () => {
        render(
            <TestSetupProvider>
                <PickTimeslot provider={provider} flatAvailableSlots={flatAvailableSlots} />
            </TestSetupProvider>
        );
        const slotElement = screen.getByText(`${flatAvailableSlots[0].start} → ${flatAvailableSlots[0].end}`).closest('div');
        expect(slotElement).toBeInTheDocument();
        fireEvent.click(slotElement!);
        expect(mockStoreBooking).toHaveBeenCalled();
    });

    // it('renders spinner when booking is pending', () => {
    //     render(
    //         <TestSetupProvider>
    //             <PickTimeslot provider={provider} flatAvailableSlots={flatAvailableSlots} />
    //         </TestSetupProvider>
    //     );

    //     // Spinner should appear on clicked slot if pending
    //     const slotElement = screen.getByText(/09:00 → 09:30/).closest('div');
    //     fireEvent.click(slotElement!);

    //     // Assert spinner appears
    //     expect(screen.getByTestId('booking-slot-spinner')).toBeInTheDocument();
    // });
});

describe('PickTimeslotLoading', () => {
    it('renders correct number of loading slots', () => {
        render(<PickTimeslotLoading repeat={2} />);
        const headers = screen.getAllByText('Day');
        expect(headers.length).toBe(2);
        const slotTexts = screen.getAllByText('08:00 → 08:30');
        expect(slotTexts.length).toBe(8); // 2*2*2 slots
    });
});
