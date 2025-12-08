"use client"

// External
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

// Internal
import { ContextWrapper, LayoutController } from "@/layout";
import appStore from '@/redux/store';

// ---- Global SCSS Modules ----
import "@/styles/global/layout.scss";
import "@/styles/global/tailwind.scss";

export type ProviderProps = {
    children: React.ReactNode;
    // i18n: i18n;
};

export const Providers: React.FC<ProviderProps> = ({ children }) => {
    const queryClient = new QueryClient();

    return (
        <Provider store={appStore(undefined)}>
            <QueryClientProvider client={queryClient}>
                <ContextWrapper>
                    <LayoutController>
                        {children}
                    </LayoutController>
                </ContextWrapper>
            </QueryClientProvider>
        </Provider>
    )
}
