// External
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Internal
import { GuestLayout } from '@/layout';

void React.createElement

describe('GuestLayout Component', () => {
    it('renders without crashing', () => {
        render(<GuestLayout />);
        expect(screen.getByTestId('guest-wrapper')).toBeInTheDocument();
    });

    it('displays the ghost logo and "Booohking" text', () => {
        render(<GuestLayout />);
        const ghostLogo = screen.getByTestId('ghost-logo');
        const booohkingText = screen.getByText('Booohking');

        expect(ghostLogo).toBeInTheDocument();
        expect(booohkingText).toBeInTheDocument();
    });

    it('renders children correctly', () => {
        const testChildren = <div data-testid="test-children">Test Children</div>;
        render(<GuestLayout>{testChildren}</GuestLayout>);

        expect(screen.getByTestId('test-children')).toBeInTheDocument();
        expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it('applies the correct class names to containers', () => {
        render(<GuestLayout />);
        const guestWrapper = screen.getByTestId('guest-wrapper');
        const jumbotronWrapper = screen.getByTestId('jumbotron-wrapper');
        const guestContents = screen.getByTestId('guest-contents');

        expect(guestWrapper).toHaveClass('guest-wrapper');
        expect(jumbotronWrapper).toHaveClass('jumbotron-wrapper');
        expect(guestContents).toHaveClass('guest-contents');
    });

    it('matches the snapshot', () => {
        const { asFragment } = render(<GuestLayout />);
        expect(asFragment()).toMatchSnapshot();
    });
});
