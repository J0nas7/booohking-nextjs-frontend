import { TestSetupProvider } from '@/jest.setup';
import { LayoutController } from '@/layout';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement

// Mock the layout components
jest.mock('@/layout', () => {
    return {
        ...jest.requireActual('@/layout'),
        GuestLayout: jest.fn(({ children }: { children: React.ReactNode }) => (
            <div data-testid="guest-layout">{children}</div>
        )),
        UserLayout: jest.fn(({ children }: { children: React.ReactNode }) => (
            <div data-testid="user-layout">{children}</div>
        ))
    };
});

describe('LayoutController Component', () => {
    it('renders with className="booohking-wrapper" when logged in', () => {
        // Mock the Redux selector to return `true` for isLoggedIn
        require('@/redux').useTypedSelector.mockReturnValue(true);

        render(<TestSetupProvider><LayoutController><div>Test Child</div></LayoutController></TestSetupProvider>);

        // Check if the Container has the correct className
        const container = screen.getByTestId('mock-container');
        expect(container).toHaveClass('booohking-wrapper');
    });

    it('renders with className="booohking-wrapper" when not logged in', () => {
        // Mock the Redux selector to return `false` for isLoggedIn
        require('@/redux').useTypedSelector.mockReturnValue(false);

        render(<TestSetupProvider><LayoutController><div>Test Child</div></LayoutController></TestSetupProvider>);

        // Check if the Container has the correct className
        const container = screen.getByTestId('mock-container');
        expect(container).toHaveClass('booohking-wrapper');
    });
});
