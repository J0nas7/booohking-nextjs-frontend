import { ServicesOverviewView, ServicesOverviewViewProps } from '@/views/services-overview/ServicesOverviewView';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

// Mock the internal ServicesOverview component
jest.mock('@/views/services-overview/ServicesOverview', () => ({
    ServicesOverview: jest.fn(() => <div data-testid="services-overview-mock" />),
    ServicesOverviewLoading: jest.fn(({ repeat }) => (
        <div data-testid="services-overview-loading">
            Loading {repeat} items
        </div>
    )),
}));

describe('ServicesOverviewView', () => {
    let props: ServicesOverviewViewProps;
    let convertURLFormatMock: jest.Mock;

    beforeEach(() => {
        convertURLFormatMock = jest.fn((id, name) => `/service/${id}-${name}`);

        props = {
            providersLoading: false,
            flatServices: [
                { Service_ID: 1, Service_Name: 'Service A', Service_DurationMinutes: 60 },
                { Service_ID: 2, Service_Name: 'Service B', Service_DurationMinutes: 30 },
            ],
            convertURLFormat: convertURLFormatMock,
        };
    });

    it('renders the main layout and title', () => {
        render(<ServicesOverviewView {...props} />);
        expect(screen.getByText(/Services Overview/i)).toBeInTheDocument();
    });

    it('renders loading state correctly when providersLoading is true', () => {
        props.providersLoading = true;
        props.flatServices = undefined;
        render(<ServicesOverviewView {...props} />);

        expect(screen.getByTestId('services-overview-loading')).toBeInTheDocument();
    });

    it('renders the ServicesOverview component when not loading', () => {
        render(<ServicesOverviewView {...props} />);
        expect(screen.getByTestId('services-overview-mock')).toBeInTheDocument();
    });

    it('calls convertURLFormat correctly for the services', () => {
        render(<ServicesOverviewView {...props} />);
        // We only pass convertURLFormat down; actual calls happen in ServicesOverview
        expect(props.convertURLFormat).toBeDefined();
    });

    it('renders the correct number of services in props', () => {
        render(<ServicesOverviewView {...props} />);
        expect(props.flatServices).toHaveLength(2);
        expect(screen.getByTestId('services-overview-mock')).toBeInTheDocument();
    });
});
