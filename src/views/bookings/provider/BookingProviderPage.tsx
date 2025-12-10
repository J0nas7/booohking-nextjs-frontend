"use client"

// External
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Internal
import { useProvidersContext } from '@/contexts';
import { useURLLink } from '@/hooks';
import { env, ProviderDTO, ProviderStates, RESOURCE_META } from '@/types';
import { BookingProviderView, BookingProviderViewProps } from '@/views';

export const BookingProviderPage = () => {
    // ---- Hooks ----
    const { providerLink } = useParams<{ providerLink: string }>();
    const { linkId: providerId, convertURLFormat } = useURLLink(providerLink)

    const { showProvider, readAvailableSlots } = useProvidersContext()

    // ---- State ----
    const containerRef = useRef<HTMLDivElement>(null);

    // ---- React Query Pagination ----
    // Provider query by providerId
    const { data: renderProvider, isLoading: providerLoading } = useQuery<ProviderStates>({
        queryKey: [RESOURCE_META.providers.singular, providerId],
        queryFn: async () => await showProvider(parseInt(providerId)),
        enabled: !!providerId // only fetch if ID exists
    })

    // Available slots query by providerId and serviceId
    const { data: renderAvailableSlots, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: availableSlotsLoading } = useInfiniteQuery({
        queryKey: [`availableSlots`, providerId],
        queryFn: async ({ pageParam = 1 }) => {
            if (!renderProvider) return [];
            return await readAvailableSlots(
                parseInt(providerId),
                renderProvider.Service_ID,
                pageParam
            );
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage?.pagination) return undefined;
            return lastPage.pagination.currentPage < lastPage.pagination.lastPage
                ? lastPage.pagination.currentPage + 1
                : undefined;
        },
        initialPageParam: 1,
        enabled: !!(renderProvider && (renderProvider as ProviderDTO).Service_ID), // only runs AFTER provider finishes
        // DISABLE CACHE COMPLETELY
        staleTime: 0,      // always stale → always refetch
        gcTime: 0,         // delete from cache immediately when unused
        refetchOnMount: true
    })

    const flatAvailableSlots = renderAvailableSlots
        ? renderAvailableSlots.pages.flatMap(page =>
            Array.isArray(page.data) ? page.data : []
        )
        : undefined;

    // ---- Effects ----
    useEffect(() => {
        if (renderProvider) {
            document.title = renderProvider.Provider_Name + " - " + env.app_name;
        } else if (renderProvider === false) {
            document.title = "Provider not found - " + env.app_name;
        }
    }, [renderProvider])

    // Handle infinity scroll
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px buffer

            if (isNearBottom && hasNextPage && !isFetchingNextPage) { fetchNextPage(); }
        };

        const tryFetchMore = () => {
            if (hasNextPage && !isFetchingNextPage && container.scrollHeight <= container.clientHeight) {
                fetchNextPage();
            }
        };

        tryFetchMore();
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, containerRef.current]);

    // ---- Render ----
    const bookingProviderViewProps: BookingProviderViewProps = {
        renderProvider,
        providerLoading,
        availableSlotsLoading,
        flatAvailableSlots,
        convertURLFormat,
        containerRef,
        hasNextPage,
        isFetchingNextPage
    }

    return <BookingProviderView {...bookingProviderViewProps} />
}
