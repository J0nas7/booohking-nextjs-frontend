"use client"

// External
import { useInfiniteQuery } from '@tanstack/react-query';

// Internal
import { useServicesContext } from '@/contexts';
import { useURLLink } from '@/hooks';
import { API_RESOURCES, ServicesStates } from '@/types';
import { ServicesOverviewView, ServicesOverviewViewProps } from '@/views';
import { useEffect, useState } from 'react';

export const ServicesOverviewPage = () => {
    // ---- Hooks ----
    const { convertURLFormat } = useURLLink("")
    const { indexServicesById } = useServicesContext()

    // ---- State ----
    const [flatServices, setFlatServices] = useState<ServicesStates>(undefined)

    // --- React Query Pagination ---
    const { data: renderServices, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: providersLoading } = useInfiniteQuery({
        queryKey: [API_RESOURCES.services.base, 1],
        queryFn: async ({ pageParam = 1 }) => await indexServicesById(1),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        initialPageParam: 1
    });

    // ---- Effects ----
    useEffect(() => {
        setFlatServices(() => {
            return renderServices
                ? renderServices.pages.flatMap(page =>
                    Array.isArray(page.data) ? page.data : []
                )
                : undefined;
        })
    }, [renderServices])

    // ---- Render ----
    const servicesOverviewViewProps: ServicesOverviewViewProps = {
        providersLoading,
        flatServices,
        convertURLFormat
    }

    return <ServicesOverviewView {...servicesOverviewViewProps} />
}
