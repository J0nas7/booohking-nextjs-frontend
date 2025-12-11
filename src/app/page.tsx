// External
import { dehydrate, InfiniteData } from '@tanstack/react-query'

// Internal
import { customPrefetchData } from '@/app/lib/prefetchData'
import { ServerAuth } from '@/layout/ServerAuth'
import { API_RESOURCES, env } from '@/types'
import { ServicesOverviewPage } from '@/views'
import { Metadata, ResolvingMetadata } from 'next'

let queryKey = [API_RESOURCES.services.base, 1]

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {
    const queryClient = await fetchPageQueryClient()
    const pageData: InfiniteData<any, unknown> | undefined = queryClient.getQueryData(queryKey)

    const total = pageData?.pages?.[0]?.pagination?.total ?? 0

    return { title: `Services: Choose between ${total} - ${env.app_name}` }
}

const Page = async () => {
    const queryClient = await fetchPageQueryClient()
    const dehydratedState = dehydrate(queryClient)

    return (
        <ServerAuth dehydratedState={dehydratedState}>
            <ServicesOverviewPage />
        </ServerAuth>
    )
}

// Helper function to fetch & prepopulate query client
async function fetchPageQueryClient() {
    return await customPrefetchData({
        queryKey: queryKey,
        endpoint: API_RESOURCES.services.byParent?.(1) || "",
        actionType: 'get',
    });
}

export default Page
