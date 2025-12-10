"use client"

// External
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

// Internal
import { useProvidersContext, useServicesContext } from '@/contexts';
import { useURLLink } from '@/hooks';
import { API_RESOURCES, env, ProvidersStates, RESOURCE_META, ServiceStates } from '@/types';
import { ServiceView, ServiceViewProps } from '@/views';
import { useEffect } from 'react';

export const ServicePage = () => {
    // ---- Hooks ----
    const { serviceLink } = useParams<{ serviceLink: string }>();
    const { linkId: serviceId, convertURLFormat } = useURLLink(serviceLink)

    const { showService } = useServicesContext()
    const { indexProvidersById } = useProvidersContext()

    // --- React Query Pagination ---
    // Providers pagination query by serviceId
    const { data: renderProviders, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: providersLoading } = useInfiniteQuery({
        queryKey: [API_RESOURCES.providers.base, serviceId],
        queryFn: async ({ pageParam = 1 }) => await indexProvidersById(parseInt(serviceId)),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        initialPageParam: 1
    });

    // Service query by serviceId
    const { data: renderService, isLoading: serviceLoading } = useQuery<ServiceStates>({
        queryKey: [RESOURCE_META.services.singular, serviceId],
        queryFn: async () => await showService(parseInt(serviceId)),
        enabled: !!serviceId
    })

    const flatProviders: ProvidersStates = renderProviders
        ? renderProviders.pages.flatMap(page =>
            Array.isArray(page.data) ? page.data : []
        )
        : undefined;

    // ---- Effects ----
    useEffect(() => {
        if (renderService) {
            document.title = renderService.Service_Name + " - " + env.app_name;
        } else if (renderService === false) {
            document.title = "Service not found - " + env.app_name;
        }
    }, [renderService])

    // ---- Render ----
    const serviceViewProps: ServiceViewProps = {
        renderService,
        serviceLoading,
        flatProviders,
        convertURLFormat
    }

    return <ServiceView {...serviceViewProps} />
}
