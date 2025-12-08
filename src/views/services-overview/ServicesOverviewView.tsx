// Internal
import { ServicesStates } from '@/types';
import { Container, H1, LoadingState } from '@/ui';
import { ServicesOverview, ServicesOverviewLoading } from '@/views';
import React from 'react';

void React.createElement

export interface ServicesOverviewViewProps {
    providersLoading: boolean
    flatServices: ServicesStates
    convertURLFormat: (id: number, name: string) => string
}

export const ServicesOverviewView: React.FC<ServicesOverviewViewProps> = (props) => (
    <>
        <Container className="h1-and-loader">
            <H1>Services Overview</H1>
            <LoadingState
                singular=""
                isLoading={props.providersLoading}
                renderItem={props.flatServices}
                permitted={true}
            />
        </Container>
        <LoadingState
            singular="Service"
            loadingTSX={<ServicesOverviewLoading repeat={6} />}
            isLoading={props.providersLoading}
            renderItem={props.flatServices}
            permitted={true}
        >
            <ServicesOverview services={props.flatServices} convertURLFormat={props.convertURLFormat} />
        </LoadingState>
    </>
)
