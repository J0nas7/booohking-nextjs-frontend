import { serverGet } from '@/app/lib/serverGet';
import { QueryClient } from '@tanstack/react-query';

type ActionType = 'get' | 'post' | 'put' | 'delete';

interface PrefetchOptions {
    queryKey: any[];
    endpoint: string;
    actionType?: ActionType;
    initialPageParam?: number;
}

async function fetcher(endpoint: string, actionType: ActionType = 'get') {
    try {
        switch (actionType) {
            case 'get':
                return await serverGet(endpoint);
            case 'post':
            case 'put':
            case 'delete':
                // Implement serverPost, serverPut, serverDelete if needed
                throw new Error(`${actionType.toUpperCase()} not implemented yet.`);
            default:
                throw new Error(`Unknown actionType: ${actionType}`);
        }
    } catch (err) {
        console.error(`Prefetch failed to (${actionType}) fetch ${endpoint}:`, err);
        return { data: [], nextPage: null }; // fallback
    }
}

export async function customPrefetchData({ queryKey, endpoint, actionType = 'get', initialPageParam = 1 }: PrefetchOptions) {
    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = initialPageParam }) => {
            const response = await fetcher(endpoint, actionType);

            return response
        },
        getNextPageParam: (lastPage: any) => lastPage?.nextPage ?? null,
        initialPageParam,
    });

    return queryClient;
}
