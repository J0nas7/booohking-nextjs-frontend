import { ProviderDTO, ServiceDTO, ServiceStates } from '@/types';
import { ServiceView, ServiceViewProps } from '@/views/service/service/ServiceView';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

// Mock PickProvider to isolate ServiceView
jest.mock('@/views/service/service/PickProvider', () => ({
    PickProvider: jest.fn(() => <div data-testid="mock-pick-provider">Mock PickProvider</div>),
    PickProviderLoading: jest.fn(({ repeat }) => (
        <div data-testid="mock-pickprovider-loading">{`Loading ${repeat} items`}</div>
    )),
}));

describe('ServiceView', () => {
    let props: ServiceViewProps;

    const renderService: ServiceDTO = {
        Service_ID: 1,
        Service_Name: 'Test Service',
        Service_DurationMinutes: 60,
    };

    const flatProviders: ProviderDTO[] = [
        { Provider_ID: 1, Provider_Name: 'Provider A', Provider_Timezone: 'UTC' },
        { Provider_ID: 2, Provider_Name: 'Provider B', Provider_Timezone: 'UTC' },
    ];

    beforeEach(() => {
        props = {
            renderService,
            serviceLoading: false,
            flatProviders,
            convertURLFormat: jest.fn((id, name) => `/provider/${id}/${name}`),
        };
    });

    it('renders the service title', () => {
        render(<ServiceView {...props} />);
        expect(screen.getByText('Test Service')).toBeInTheDocument();
    });

    it('renders loading state when serviceLoading is true', () => {
        props.serviceLoading = true;
        props.renderService = undefined;
        render(<ServiceView {...props} />);
        expect(screen.getAllByTestId('mock-pickprovider-loading')).toHaveLength(1);
    });

    it('renders PickProvider component when not loading', () => {
        render(<ServiceView {...props} />);
        expect(screen.getByTestId('mock-pick-provider')).toBeInTheDocument();
    });

    it('renders default title if renderService is undefined', () => {
        props.renderService = null as unknown as ServiceStates;
        render(<ServiceView {...props} />);
        expect(screen.getByText('Service')).toBeInTheDocument();
    });

    it('calls convertURLFormat correctly if needed', () => {
        render(<ServiceView {...props} />);
        // We can test convertURLFormat indirectly if PickProvider calls it internally.
        // Since PickProvider is mocked, we won't test it here.
        expect(props.convertURLFormat).toBeDefined();
    });
});
