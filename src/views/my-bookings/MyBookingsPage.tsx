"use client"

// External
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

// Internal
import { useBookingsContext } from '@/contexts';
import { selectAuthUser, useTypedSelector } from '@/redux';
import { BookingsStates, env } from '@/types';
import { MyBookingsView, MyBookingsViewProps } from '@/views';

export const MyBookingsPage = () => {
    // ---- Hooks ----
    const { indexBookingsById } = useBookingsContext()

    // ---- State ----
    const authUser = useTypedSelector(selectAuthUser)

    // ---- React Query Pagination ----
    // My bookings by userId
    const { data: renderMyBookings, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: myBookingsLoading } = useInfiniteQuery({
        queryKey: [`myBookings`, authUser?.User_ID],
        queryFn: async ({ pageParam = 1 }) =>
            await indexBookingsById(authUser?.User_ID ?? 0),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        initialPageParam: 1,
        enabled: !!authUser?.User_ID,
        // DISABLE CACHE COMPLETELY
        staleTime: 0,      // always stale → always refetch
        gcTime: 0,         // delete from cache immediately when unused
        refetchOnMount: true
    })

    const flatMyBookings: BookingsStates = renderMyBookings
        ? renderMyBookings.pages
            .map(page => (Array.isArray(page.data) ? [...page.data].reverse() : []))
            .flat()
        : undefined;

    // ---- Effects ----
    useEffect(() => {
        document.title = "My Booohkings - " + env.app_name;
    }, [])

    // ---- Render ----
    const myBookingsViewProps: MyBookingsViewProps = {
        myBookingsLoading,
        authUser,
        flatMyBookings
    }

    return <MyBookingsView {...myBookingsViewProps} />
}
