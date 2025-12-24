export const dynamicParams = true
export const dynamic = "force-dynamic"

import { serverGet } from '@/app/lib/serverGet'
import { ServerAuth } from '@/layout/ServerAuth'
import { API_RESOURCES, env, ProviderStates, RESOURCE_META } from '@/types'
import { BookingProviderPage } from '@/views'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params }: { params: { providerLink: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { providerLink } = await params
    const providerId: number = parseInt(providerLink?.split('-')[0])
    const queryKeyProvider = [RESOURCE_META.providers.singular, providerId]

    const queryClient = await fetchPageQueryClient(providerId, queryKeyProvider)
    const renderProvider: ProviderStates = queryClient.getQueryData(queryKeyProvider)

    if (renderProvider) {
        return { title: `${renderProvider.Provider_Name}` }
    }

    return { title: `Provider not found - ${env.app_name}` }
}

interface PageProps {
    params: { providerLink: string }
}

const Page = async ({ params }: PageProps) => {
    const { providerLink } = await params
    const providerId: number = parseInt(providerLink?.split('-')[0])
    const queryKeyProvider = [RESOURCE_META.providers.singular, providerId]

    const queryClient = await fetchPageQueryClient(providerId, queryKeyProvider)
    const dehydratedState = dehydrate(queryClient)

    return (
        <ServerAuth dehydratedState={dehydratedState}>
            <BookingProviderPage />
        </ServerAuth>
    )
}

// Helper function to fetch & prepopulate query client
async function fetchPageQueryClient(providerId: number, queryKeyProvider: (number | "provider")[]) {
    const queryClient = new QueryClient();

    // Prefetch provider
    await queryClient.prefetchQuery({
        queryKey: queryKeyProvider,
        queryFn: async () => {
            const response = await serverGet(API_RESOURCES.providers.byId(providerId))
            return response.data
        }
    });

    // Read the provider from cache
    const provider: ProviderStates = queryClient.getQueryData(queryKeyProvider);

    // If provider exists, prefetch available slots
    if (provider && provider.Service_ID) {
        const serviceId = provider.Service_ID;
        const infiniteKey = ['availableSlots', providerId];

        await queryClient.prefetchInfiniteQuery({
            queryKey: infiniteKey,
            queryFn: async ({ pageParam = 1 }) => {
                const params: string[] = [`page=${pageParam}`];

                if (serviceId) params.push(`service_id=${serviceId}`);

                const query = params.length ? `?${params.join("&")}` : "";

                const url = `bookings/${providerId}/available-slots${query}`
                const response = await serverGet(url);
                console.log("availableSlots", response, url)

                return response.data
            },
            getNextPageParam: (lastPage: any) => {
                if (!lastPage?.pagination) return undefined;
                return lastPage.pagination.currentPage < lastPage.pagination.lastPage
                    ? lastPage.pagination.currentPage + 1
                    : undefined;
            },
            initialPageParam: 1,
        });
    }

    return queryClient;
}

export default Page
