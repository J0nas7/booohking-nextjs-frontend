export const dynamicParams = true
export const dynamic = "force-dynamic"

import { serverGet } from '@/app/lib/serverGet'
import { ServerAuth } from '@/layout/ServerAuth'
import { API_RESOURCES, env, RESOURCE_META, ServiceStates } from '@/types'
import { ServicePage } from '@/views'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params }: { params: { serviceLink: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { serviceLink } = await params
    const serviceId: number = parseInt(serviceLink?.split('-')[0])
    const queryKeyProvider = [RESOURCE_META.services.singular, serviceId]

    const queryClient = await fetchPageQueryClient(serviceId, queryKeyProvider)
    const renderService: ServiceStates = queryClient.getQueryData(queryKeyProvider)

    if (renderService) {
        return { title: `${renderService.Service_Name}` }
    }

    return { title: `Service not found - ${env.app_name}` }
}

interface PageProps {
    params: { serviceLink: string }
}

const Page = async ({ params }: PageProps) => {
    const { serviceLink } = await params
    const serviceId: number = parseInt(serviceLink?.split('-')[0])
    const queryKeyProvider = [RESOURCE_META.services.singular, serviceId]

    const queryClient = await fetchPageQueryClient(serviceId, queryKeyProvider)
    const dehydratedState = dehydrate(queryClient)

    return (
        <ServerAuth dehydratedState={dehydratedState}>
            <ServicePage />
        </ServerAuth>
    )
}

// Helper function to fetch & prepopulate query client
async function fetchPageQueryClient(serviceId: number, queryKeyService: (number | "service")[]) {
    const queryClient = new QueryClient();

    // Prefetch service
    await queryClient.prefetchQuery({
        queryKey: queryKeyService,
        queryFn: async () => {
            const response = await serverGet(API_RESOURCES.services.byId(serviceId))

            return response.data
        }
    });

    // Read the service from cache
    const service: ServiceStates = queryClient.getQueryData(queryKeyService);

    // If service exists, prefetch it's providers
    if (service && service.Service_ID) {
        const serviceId = service.Service_ID;
        const infiniteKey = [API_RESOURCES.providers.base, serviceId];

        await queryClient.prefetchInfiniteQuery({
            queryKey: infiniteKey,
            queryFn: async ({ pageParam = 1 }) => {
                const response = await serverGet(API_RESOURCES.providers.byParent?.(serviceId) || "");

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
