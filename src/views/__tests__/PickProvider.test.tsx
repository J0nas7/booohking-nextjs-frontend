import { ProviderDTO, ServiceDTO } from '@/types';
import { PickProvider, PickProviderLoading } from '@/views/service/service/PickProvider';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

describe('PickProvider', () => {
    const service: ServiceDTO = { Service_ID: 1, Service_Name: 'Test Service', Service_DurationMinutes: 60 };
    const providers: ProviderDTO[] = [
        {
            Provider_ID: 1,
            Provider_Name: 'Provider A',
            Provider_Timezone: 'UTC',
            working_hours: [
                { PWH_ID: 1, Provider_ID: 1, PWH_DayOfWeek: 1, PWH_StartTime: '08:00', PWH_EndTime: '16:00' },
                { PWH_ID: 2, Provider_ID: 1, PWH_DayOfWeek: 2, PWH_StartTime: '09:00', PWH_EndTime: '17:00' },
            ],
        },
        {
            Provider_ID: 2,
            Provider_Name: 'Provider B',
            Provider_Timezone: 'UTC',
            working_hours: [],
        },
    ];

    const convertURLFormat = jest.fn((id, name) => `${id}/${name}`);

    it('renders providers with correct names', () => {
        render(<PickProvider service={service} providers={providers} convertURLFormat={convertURLFormat} />);
        expect(screen.getByText('Provider A')).toBeInTheDocument();
        expect(screen.getByText('Provider B')).toBeInTheDocument();
    });

    it('renders working hours for providers with hours', () => {
        render(<PickProvider service={service} providers={providers} convertURLFormat={convertURLFormat} />);
        expect(screen.getByText('Mon: 08:00 - 16:00')).toBeInTheDocument();
        expect(screen.getByText('Tue: 09:00 - 17:00')).toBeInTheDocument();
    });

    it('renders working hours count for providers without hours as 0', () => {
        render(<PickProvider service={service} providers={providers} convertURLFormat={convertURLFormat} />);
        expect(screen.getByText('Working 0 days a week')).toBeInTheDocument();
    });

    it('generates booking links correctly', () => {
        render(<PickProvider service={service} providers={providers} convertURLFormat={convertURLFormat} />);
        const links = screen.getAllByText('Book a timeslot');
        expect(links[0].closest('a')).toHaveAttribute('href', '/book/1/Provider A');
        expect(links[1].closest('a')).toHaveAttribute('href', '/book/2/Provider B');
    });

    it('does not render if service or providers are missing', () => {
        const { container } = render(<PickProvider service={null as any} providers={null as any} convertURLFormat={convertURLFormat} />);
        expect(container.firstChild).toBeNull();
    });
});

describe('PickProviderLoading', () => {
    it('renders correct number of loading cards', () => {
        render(<PickProviderLoading repeat={3} />);
        const loadingTexts = screen.getAllByText(/Provider name/i);
        expect(loadingTexts).toHaveLength(3);
    });

    it('renders working hours placeholders for all loading cards', () => {
        render(<PickProviderLoading repeat={2} />);
        const workingHourItems = screen.getAllByText(/Mon: 08:00:00 - 16:00:00/i);
        expect(workingHourItems).toHaveLength(2);
    });
});
