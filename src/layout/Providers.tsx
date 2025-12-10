"use client"

// External
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

// Internal
import { ContextWrapper, LayoutController } from "@/layout";
import appStore from '@/redux/store';

// ---- Global SCSS Modules ----
import "@/styles/global/layout.scss";
import "@/styles/global/tailwind.scss";

export type ProviderProps = {
    children: React.ReactNode;
    isLoggedIn: boolean;
    dehydratedState?: DehydratedState
    // i18n: i18n;
};

export const Providers: React.FC<ProviderProps> = (props) => {
    const queryClient = new QueryClient();

    return (
        <Provider store={appStore(undefined)}>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={props.dehydratedState}>
                    <ContextWrapper>
                        <LayoutController isLoggedIn={props.isLoggedIn}>
                            {props.children}
                        </LayoutController>
                    </ContextWrapper>
                </HydrationBoundary>
            </QueryClientProvider>
        </Provider>
    )
}
