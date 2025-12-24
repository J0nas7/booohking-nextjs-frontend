"use client"

// External
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Internal
import { useProvidersContext } from '@/contexts';
import { useURLLink } from '@/hooks';
import { selectAuthUser, useTypedSelector } from '@/redux';
import { ProviderStates, RESOURCE_META } from '@/types';
import { BookingProviderView, BookingProviderViewProps } from '@/views';

export const BookingProviderPage = () => {
    // ---- Hooks ----
    const { providerLink } = useParams<{ providerLink: string }>();
    const { linkId: providerId, convertURLFormat } = useURLLink(providerLink)

    const { showProvider, readAvailableSlots } = useProvidersContext()

    // ---- State ----
    const containerRef = useRef<HTMLDivElement>(null);
    const authUser = useTypedSelector(selectAuthUser)
    const [renderProvider, setRenderProvider] = useState<ProviderStates>(undefined)
    const [flatAvailableSlots, setFlatAvailableSlots] = useState<any[] | undefined>(undefined)

    // ---- React Query Pagination ----
    // Provider query by providerId
    const { data: providerData, isLoading: providerLoading } = useQuery<ProviderStates>({
        queryKey: [RESOURCE_META.providers.singular, parseInt(providerId)],
        queryFn: async () => {
            const response = await showProvider(parseInt(providerId))
            return response.data
        },
        enabled: !!providerId // only fetch if ID exists
    })

    // Available slots query by providerId and serviceId
    const infiniteKey = [`availableSlots`, parseInt(providerId)]
    const { data: renderAvailableSlots, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: availableSlotsLoading } = useInfiniteQuery({
        queryKey: infiniteKey,
        queryFn: async ({ pageParam = 1 }) => {
            const response = await readAvailableSlots(
                parseInt(providerId),
                providerData && providerData.Service_ID || 0,
                pageParam
            )
            return response.data
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage?.pagination) return undefined;
            return lastPage.pagination.currentPage < lastPage.pagination.lastPage
                ? lastPage.pagination.currentPage + 1
                : undefined;
        },
        initialPageParam: 1,
        // only runs AFTER provider finishes
        // DISABLE CACHE COMPLETELY
        staleTime: 0,      // always stale → always refetch
        gcTime: 0,         // delete from cache immediately when unused
        refetchOnMount: true
    })

    // ---- Effects ----
    useEffect(() => {
        setFlatAvailableSlots(() => {
            return renderAvailableSlots
                ? renderAvailableSlots.pages.flatMap(page =>
                    Array.isArray(page.data) ? page.data : []
                )
                : undefined;
        })
    }, [renderAvailableSlots])

    useEffect(() => {
        setRenderProvider(providerData)
    }, [providerData])

    // Handle infinity scroll
    useEffect(() => {
        console.log("scroll init")
        const container = containerRef.current;
        if (!container) return;
        console.log("scroll", container)

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px buffer

            if (isNearBottom && hasNextPage && !isFetchingNextPage) {
                console.log("scroll availableSlots fetchingNext")
                fetchNextPage();
            }
        };

        const tryFetchMore = () => {
            console.log("scroll tryFetchMore", (hasNextPage && !isFetchingNextPage && container.scrollHeight <= container.clientHeight))
            if (hasNextPage && !isFetchingNextPage && container.scrollHeight <= container.clientHeight) {
                fetchNextPage();
            }
        };

        tryFetchMore();
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, containerRef.current, flatAvailableSlots]);

    // ---- Render ----
    const bookingProviderViewProps: BookingProviderViewProps = {
        renderProvider,
        providerLoading,
        availableSlotsLoading,
        flatAvailableSlots,
        authUser,
        convertURLFormat,
        containerRef,
        hasNextPage,
        isFetchingNextPage
    }

    return <BookingProviderView {...bookingProviderViewProps} />
}
