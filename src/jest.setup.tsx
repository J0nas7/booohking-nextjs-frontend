// jest.setup.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

void React.createElement

// Define types for mock components
type MockContainerProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    "data-testid"?: string;
};

type MockTxtProps = React.HTMLAttributes<HTMLSpanElement> & {
    children: React.ReactNode;
    'data-testid'?: string;
};

type MockParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
    children: React.ReactNode;
    'data-testid'?: string;
};

type MockBtnProps = React.HTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    'data-testid'?: string;
};

type MockHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
    children: React.ReactNode;
    'data-testid'?: string;
};

type MockFontAwesomeIconProps = {
    className?: string;
    icon?: string;
    size?: string;
    color?: string;
    'data-testid'?: string;
};

// Define mock components
const MockContainer = jest.fn(({ children, ...props }: MockContainerProps) => (
    <div {...props}>{children}</div>
));

const MockTxt = jest.fn(({ children, 'data-testid': testId, ...props }: MockTxtProps) => (
    <span data-testid={testId} {...props}>{children}</span>
));

const MockParagraph = jest.fn(({ children, 'data-testid': testId, ...props }: MockParagraphProps) => (
    <p data-testid={testId} {...props}>{children}</p>
));

const MockBtn = jest.fn(({ children, 'data-testid': testId, ...props }: MockBtnProps) => (
    <button data-testid={testId} {...props}>{children}</button>
));

const MockH1 = jest.fn(({ children, 'data-testid': testId, ...props }: MockHeadingProps) => (
    <h1 data-testid={testId} {...props}>{children}</h1>
));

const MockH3 = jest.fn(({ children, 'data-testid': testId, ...props }: MockHeadingProps) => (
    <h3 data-testid={testId} {...props}>{children}</h3>
));

const MockFontAwesomeIcon = jest.fn(({ className, 'data-testid': testId, icon, size, color }: MockFontAwesomeIconProps) => (
    <div data-testid={testId} className={className} data-icon={icon} data-size={size} data-color={color} />
));

// Mock the modules
jest.mock('@/ui/TagExporter', () => ({
    Container: MockContainer,
    Txt: MockTxt,
    Paragraph: MockParagraph,
    Btn: MockBtn,
    H1: MockH1,
    H3: MockH3,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: MockFontAwesomeIcon,
}));

// Mock the Redux hook
jest.mock('@/redux', () => ({
    selectAuthUser: jest.fn(),
    useTypedSelector: jest.fn((selector) => ({ User_ID: 1 })), // mock auth user
    useAppDispatch: () => jest.fn(),
    setSnackMessage: jest.fn(),
}));

// Mock the layout components
jest.mock('@/layout', () => {
    const actual = jest.requireActual('@/layout');
    return {
        ...actual,
        OnlyPrivateRoutes: jest.fn(({ children }: { children: React.ReactNode }) => (
            <div data-testid="only-private-routes">{children}</div>
        )),
        OnlyPublicRoutes: jest.fn(({ children }: { children: React.ReactNode }) => (
            <div data-testid="only-public-routes">{children}</div>
        )),
    }
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    })),
    useSearchParams: jest.fn(() => ({})),
    usePathname: jest.fn(() => ({})),
}));

// Mock hooks
// Default mock for useAuth
export const mockHandleLogoutSubmit = jest.fn()
export const mockIAdmin = jest.fn()

jest.mock('@/hooks', () => ({
    useCookies: jest.fn(() => [{}, jest.fn(), jest.fn()]),
    useAuth: () => ({
        iADMIN: mockIAdmin,
        handleLogoutSubmit: mockHandleLogoutSubmit,
    }),
}));

// Mock BookingsContext
export const mockStoreBooking = jest.fn().mockResolvedValue({});
jest.mock('@/contexts', () => ({
    useBookingsContext: () => ({ storeBooking: mockStoreBooking }),
}));

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Mock next/link so it behaves like a normal anchor tag
jest.mock("next/link", () => {
    return ({ children, href, ...props }: any) => (
        <a href={href} {...props}>{children}</a>
    );
});

export const mockUseMutation = jest.fn((options: any) => ({
    mutate: (booking: any) => options.mutationFn(booking),
    isPending: false,
}));

jest.mock('@tanstack/react-query', () => {
    const actual = jest.requireActual('@tanstack/react-query');
    return {
        ...actual,
        useMutation: (options: any) => mockUseMutation(options),
    };
});

// Create a mock Redux store
const mockStore = configureStore([]);

interface TestSetupProviderProps {
    children: React.ReactNode
}

export const TestSetupProvider: React.FC<TestSetupProviderProps> = (props) => {
    const queryClient = new QueryClient()

    let store;

    store = mockStore({
        auth: { isLoggedIn: false },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                {props.children}
            </Provider>
        </QueryClientProvider>
    )
}
