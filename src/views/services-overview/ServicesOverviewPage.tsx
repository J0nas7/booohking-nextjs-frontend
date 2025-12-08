"use client"

// External
import { useEffect } from 'react';

// Internal
import { useServicesContext } from '@/contexts';
import { useURLLink } from '@/hooks';
import { env, ServicesStates } from '@/types';
import { ServicesOverviewView, ServicesOverviewViewProps } from '@/views';
import { useInfiniteQuery } from '@tanstack/react-query';

export const ServicesOverviewPage = () => {
    // ---- Hooks ----
    const { convertURLFormat } = useURLLink("")
    const { indexServicesById } = useServicesContext()

    // ---- Effects ----
    useEffect(() => {
        document.title = "Welcome - " + env.app_name;
    }, [])

    // --- React Query Pagination ---
    const { data: renderServices, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: providersLoading } = useInfiniteQuery({
        queryKey: [`services`, 1],
        queryFn: async ({ pageParam = 1 }) => await indexServicesById(1),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        initialPageParam: 1
    });

    const flatServices: ServicesStates = renderServices
        ? renderServices.pages.flatMap(page =>
            Array.isArray(page.data) ? page.data : []
        )
        : undefined;

    // ---- Render ----
    const servicesOverviewViewProps: ServicesOverviewViewProps = {
        providersLoading,
        flatServices,
        convertURLFormat
    }

    return <ServicesOverviewView {...servicesOverviewViewProps} />
}
