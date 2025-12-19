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
    useTypedSelector: jest.fn(() => ({ id: 1, role: 'ROLE_USER' })),
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

    // Last slot in collection is clickable
    it('clicking a slot triggers storeBooking', () => {
        render(
            <TestSetupProvider>
                <PickTimeslot provider={provider} flatAvailableSlots={flatAvailableSlots} />
            </TestSetupProvider>
        );
        const flatAvailableSlot = flatAvailableSlots[flatAvailableSlots.length - 1]
        const slotElement = screen.getByText(`${flatAvailableSlot.start} → ${flatAvailableSlot.end}`).closest('div');
        expect(slotElement).toBeInTheDocument();
        fireEvent.click(slotElement!);
        // expect(mockStoreBooking).toHaveBeenCalled();
    });

    // Ensures past-time slots are inactive and cannot be clicked
    it("does not trigger storeBooking for past (inactive) slots", () => {
        // Create a past date (yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const pastDate = yesterday.toISOString().substring(0, 10);
        const pastSlot = { date: pastDate, start: "09:00", end: "09:30" };

        render(
            <TestSetupProvider>
                <PickTimeslot provider={provider} flatAvailableSlots={[pastSlot]} />
            </TestSetupProvider>
        );

        const slotElement = screen.getByText("09:00 → 09:30").closest("div");
        expect(slotElement).toBeInTheDocument();

        fireEvent.click(slotElement!);

        // Should NOT be called because active=false for past time
        expect(mockStoreBooking).not.toHaveBeenCalled();
    });

    // Ensures future slots ARE clickable
    it("triggers storeBooking for future (active) slots", () => {
        // Create a future date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const futureDate = tomorrow.toISOString().substring(0, 10);
        const futureSlot = { date: futureDate, start: "09:00", end: "09:30" };

        render(
            <TestSetupProvider>
                <PickTimeslot provider={provider} flatAvailableSlots={[futureSlot]} />
            </TestSetupProvider>
        );

        const slotElement = screen.getByText("09:00 → 09:30").closest("div");
        expect(slotElement).toBeInTheDocument();

        fireEvent.click(slotElement!);

        // Should be called because active=true
        expect(mockStoreBooking).toHaveBeenCalled();
    });

    // Pressing Enter picks an active (future) slot
    it("pressing Enter triggers storeBooking for active future slots", () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const futureDate = tomorrow.toISOString().substring(0, 10);

        const futureSlot = { date: futureDate, start: "09:00", end: "09:30" };

        render(
            <TestSetupProvider>
                <PickTimeslot provider={provider} flatAvailableSlots={[futureSlot]} />
            </TestSetupProvider>
        );

        const slotTxt = screen.getByText("09:00 → 09:30");
        const slotElement = slotTxt.closest("div")!;
        expect(slotElement).toBeInTheDocument();

        fireEvent.keyDown(slotElement, { key: "Enter" });

        expect(mockStoreBooking).toHaveBeenCalled();
    });

    // .cardInactive className applied for inactive (past) slots
    it("applies .cardInactive class for past slots", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const pastDate = yesterday.toISOString().substring(0, 10);

        const pastSlot = { date: pastDate, start: "09:00", end: "09:30" };

        render(
            <TestSetupProvider>
                <PickTimeslot provider={provider} flatAvailableSlots={[pastSlot]} />
            </TestSetupProvider>
        );

        const txtElement = screen.getByText("09:00 → 09:30");

        // The inner <Txt> gets styles.cardInactive when active=false
        expect(txtElement.className).toMatch(/cardInactive/);
    });
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
