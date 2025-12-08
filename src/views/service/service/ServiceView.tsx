// Internal
import { ProvidersStates, ServiceStates } from '@/types';
import { Container, H1, LoadingState } from '@/ui';
import { PickProvider, PickProviderLoading } from '@/views';
import React from 'react';

void React.createElement

export interface ServiceViewProps {
    renderService: ServiceStates
    serviceLoading: boolean
    flatProviders: ProvidersStates
    convertURLFormat: (id: number, name: string) => string
}

export const ServiceView: React.FC<ServiceViewProps> = (props) => (
    <>
        <Container className="h1-and-loader">
            <H1>{props.renderService ? props.renderService.Service_Name : "Service"}</H1>
            <LoadingState
                singular=""
                isLoading={props.serviceLoading}
                renderItem={props.renderService}
                permitted={true}
            />
        </Container>

        <LoadingState
            singular="Service"
            loadingTSX={<PickProviderLoading repeat={6} />}
            isLoading={props.serviceLoading}
            renderItem={props.renderService}
            permitted={true}
        >
            <PickProvider service={props.renderService} providers={props.flatProviders} convertURLFormat={props.convertURLFormat} />
        </LoadingState>
    </>
)
