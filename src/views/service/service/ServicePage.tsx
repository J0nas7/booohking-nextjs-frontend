"use client"

// External
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

// Internal
import { useProvidersContext, useServicesContext } from '@/contexts';
import { useURLLink } from '@/hooks';
import { API_RESOURCES, ProvidersStates, RESOURCE_META, ServiceStates } from '@/types';
import { ServiceView, ServiceViewProps } from '@/views';
import { useEffect, useState } from 'react';

export const ServicePage = () => {
    // ---- Hooks ----
    const { serviceLink } = useParams<{ serviceLink: string }>();
    const { linkId: serviceId, convertURLFormat } = useURLLink(serviceLink)

    const { showService } = useServicesContext()
    const { indexProvidersById } = useProvidersContext()

    // ---- State ----
    const [flatProviders, setFlatProviders] = useState<ProvidersStates>(undefined)
    const [renderService, setRenderService] = useState<ServiceStates>(undefined)

    // ---- React Query Pagination ----
    // Providers pagination query by serviceId
    const { data: dataProviders, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: providersLoading } = useInfiniteQuery({
        queryKey: [API_RESOURCES.providers.base, parseInt(serviceId)],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await indexProvidersById(parseInt(serviceId))
            return response.data
        },
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        initialPageParam: 1
    });

    // Service query by serviceId
    const { data: dataService, isLoading: serviceLoading } = useQuery<ServiceStates>({
        queryKey: [RESOURCE_META.services.singular, parseInt(serviceId)],
        queryFn: async () => {
            const response = await showService(parseInt(serviceId))

            return response.data
        },
        enabled: !!serviceId
    })

    // ---- Effects ----
    useEffect(() => {
        setRenderService(dataService)
    }, [dataService])

    useEffect(() => {
        setFlatProviders(() => {
            return dataProviders
                ? dataProviders.pages.flatMap(page =>
                    Array.isArray(page.data) ? page.data : []
                )
                : undefined;
        })
    }, [dataProviders])

    // ---- Render ----
    const serviceViewProps: ServiceViewProps = {
        renderService,
        serviceLoading,
        flatProviders,
        convertURLFormat
    }

    return <ServiceView {...serviceViewProps} />
}
