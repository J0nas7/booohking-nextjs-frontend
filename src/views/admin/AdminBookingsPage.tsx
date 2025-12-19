"use client"

// External
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

// Internal
import { useBookingsContext } from '@/contexts';
import { useAuth } from '@/hooks';
import { selectAuthUser, useTypedSelector } from '@/redux';
import { API_RESOURCES, BookingsStates, env } from '@/types';
import { AdminBookingsView, AdminBookingsViewProps } from '@/views';
import { useRouter } from 'next/navigation';

export const AdminBookingsPage = () => {
    // ---- Hooks ----
    const router = useRouter()
    const { iADMIN } = useAuth()
    const { indexBookings } = useBookingsContext()

    // ---- State ----
    const authUser = useTypedSelector(selectAuthUser)

    // ---- React Query Pagination ----
    // My bookings by userId
    const { data: renderAdminBookings, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: adminBookingsLoading } = useInfiniteQuery({
        queryKey: [`admin_${API_RESOURCES.bookings.base}`],
        queryFn: async ({ pageParam = 1 }) =>
            await indexBookings(),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        initialPageParam: 1,
        enabled: !!authUser?.id,
        // DISABLE CACHE COMPLETELY
        staleTime: 0,      // always stale → always refetch
        gcTime: 0,         // delete from cache immediately when unused
        refetchOnMount: true
    })

    const flatAdminBookings: BookingsStates = renderAdminBookings
        ? renderAdminBookings.pages
            .map(page => (Array.isArray(page.data) ? [...page.data].reverse() : []))
            .flat()
        : undefined;

    // ---- Effects ----
    useEffect(() => {
        document.title = "Admin Booohkings - " + env.app_name;
    }, [])

    useEffect(() => {
        if (authUser && !iADMIN()) {
            router.push("/")
        }
    }, [authUser])

    // ---- Render ----
    const adminBookingsViewProps: AdminBookingsViewProps = {
        adminBookingsLoading,
        authUser,
        flatAdminBookings
    }

    return <AdminBookingsView {...adminBookingsViewProps} />
}
