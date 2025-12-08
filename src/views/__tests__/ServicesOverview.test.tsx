import { ServicesOverview, ServicesOverviewLoading } from '@/views/services-overview/ServicesOverview';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

describe('ServicesOverview', () => {
    const convertURLFormatMock = jest.fn((id, name) => `${id}-${name}`);

    const servicesMock = [
        {
            Service_ID: 1,
            Service_Name: 'Service A',
            Service_DurationMinutes: 60,
            providers: [
                { Provider_ID: 1, Provider_Name: 'Provider 1', Provider_Timezone: 'UTC' },
                { Provider_ID: 2, Provider_Name: 'Provider 2', Provider_Timezone: 'UTC' }
            ]
        },
        {
            Service_ID: 2,
            Service_Name: 'Service B',
            Service_DurationMinutes: 30,
            providers: [{ Provider_ID: 2, Provider_Name: 'Provider 2', Provider_Timezone: 'UTC' }]
        }
    ];

    it('renders all services correctly', () => {
        render(<ServicesOverview services={servicesMock} convertURLFormat={convertURLFormatMock} />);

        // Check service names
        expect(screen.getByText('Service A')).toBeInTheDocument();
        expect(screen.getByText('Service B')).toBeInTheDocument();

        // Check durations
        expect(screen.getByText(/Duration: 60 minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/Duration: 30 minutes/i)).toBeInTheDocument();

        // Check number of providers

        expect(screen.getByText(/Number of Providers: 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Number of Providers: 1/i)).toBeInTheDocument();

        // Check links
        expect(screen.getAllByText('Go to booking')[0]).toHaveAttribute('href', '/service/1-Service A');
        expect(screen.getAllByText('Go to booking')[1]).toHaveAttribute('href', '/service/2-Service B');

        // Ensure convertURLFormat was passed correctly
        expect(convertURLFormatMock).toBeDefined();
    });

    it('renders loading state with the correct number of placeholders', () => {
        render(<ServicesOverviewLoading repeat={3} />);

        const loadingCards = screen.getAllByText(/Service name/i);
        expect(loadingCards).toHaveLength(3);

        const durations = screen.getAllByText(/Duration: 30 minutes/i);
        expect(durations).toHaveLength(3);

        const providers = screen.getAllByText(/Number of Providers: 3/i);
        expect(providers).toHaveLength(3);

        const bookingPlaceholders = screen.getAllByText('Go to booking');
        expect(bookingPlaceholders).toHaveLength(3);
    });

    it('handles empty services array gracefully', () => {
        render(<ServicesOverview services={[]} convertURLFormat={convertURLFormatMock} />);
        // No service cards should render
        expect(screen.queryByText('Go to booking')).not.toBeInTheDocument();
    });

    it('handles undefined services gracefully', () => {
        render(<ServicesOverview services={undefined as any} convertURLFormat={convertURLFormatMock} />);
        expect(screen.queryByText('Go to booking')).not.toBeInTheDocument();
    });
});
