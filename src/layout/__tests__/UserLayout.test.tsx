import { mockHandleLogoutSubmit, mockIAdmin, TestSetupProvider } from '@/jest.setup'
import { UserLayout } from "@/layout/UserLayout"
import { fireEvent, render, screen } from "@testing-library/react"
import React from 'react'

void React.createElement

// Reset mocks before each test
beforeEach(() => {
    mockHandleLogoutSubmit.mockReset()
    mockIAdmin.mockReset()
})

describe("UserLayout", () => {

    test("renders children correctly", () => {
        mockIAdmin.mockReturnValue(false)

        render(
            <TestSetupProvider>
                <UserLayout>
                    <div data-testid="child">Hello child</div>
                </UserLayout>
            </TestSetupProvider>
        )

        expect(screen.getByTestId("child")).toBeInTheDocument()
        expect(screen.getByText("Hello child")).toBeInTheDocument()
    })

    test("renders base menu for normal user (no admin)", () => {
        mockIAdmin.mockReturnValue(false)

        render(
            <TestSetupProvider>
                <UserLayout />
            </TestSetupProvider>
        )

        expect(screen.queryByText("Admin")).not.toBeInTheDocument()
        expect(screen.getByText("My Bookings")).toBeInTheDocument()
        expect(screen.getByText("Log out")).toBeInTheDocument()
    })

    test("renders Admin link when iADMIN() returns true", () => {
        mockIAdmin.mockReturnValue(true)

        render(
            <TestSetupProvider>
                <UserLayout />
            </TestSetupProvider>
        )

        expect(screen.getByText("Admin")).toBeInTheDocument()
    })

    test("clicking 'Log out' calls handleLogoutSubmit()", () => {
        mockIAdmin.mockReturnValue(false)

        render(
            <TestSetupProvider>
                <UserLayout />
            </TestSetupProvider>
        )

        const logoutBtn = screen.getByText("Log out")

        fireEvent.click(logoutBtn)

        expect(mockHandleLogoutSubmit).toHaveBeenCalledTimes(1)
    })

    test("mobile menu toggles open/close", () => {
        mockIAdmin.mockReturnValue(false)

        render(
            <TestSetupProvider>
                <UserLayout />
            </TestSetupProvider>
        )

        const mobileButton = screen.getByTestId("mobileButton")

        // Should not be visible initially
        expect(screen.queryByTestId("mobileMenu")).not.toBeInTheDocument()

        // Open menu
        fireEvent.click(mobileButton)
        expect(screen.getByTestId("mobileMenu")).toBeInTheDocument()
        expect(screen.getByTestId("mobileMenu")).toHaveTextContent("My Bookings")

        // Close menu
        fireEvent.click(mobileButton)
        expect(screen.queryByTestId("mobileMenu")).not.toBeInTheDocument()
    })

    test("mobile menu shows admin link when user is admin", () => {
        mockIAdmin.mockReturnValue(true)

        render(
            <TestSetupProvider>
                <UserLayout />
            </TestSetupProvider>
        )

        // open mobile menu
        const btn = screen.getByRole("button", { hidden: true })
        fireEvent.click(btn)

        expect(screen.getByText("Admin")).toBeInTheDocument()
    })
})
