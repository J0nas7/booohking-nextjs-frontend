// External
import type { ReactNode } from 'react';

// Internal
import { BookingsProvider, ProvidersProvider, ServicesProvider, UsersProvider } from '@/contexts';

// Type for provider components
type ProviderComponent = React.FC<{ children: ReactNode }>;

// Array of providers
const providers: ProviderComponent[] = [
    UsersProvider,
    BookingsProvider,
    ServicesProvider,
    ProvidersProvider
    // etc.
];

export const ContextWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    return providers.reduceRight(
        (acc, Provider) => <Provider>{acc}</Provider>,
        children
    );
};
