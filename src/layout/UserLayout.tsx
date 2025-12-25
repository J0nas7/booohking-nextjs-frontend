"use client"

// External
import { faBars, faDoorOpen, faGhost, faShield, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import React, { useState } from "react"

// Internal
import { useAuth } from '@/hooks'
import { Btn, Container, Txt } from '@/ui'
import clsx from 'clsx'

void React.createElement

export type UserLayoutProps = {
    children?: React.ReactNode
}

export const UserLayout: React.FC<UserLayoutProps> = (props) => {
    // ---- Hooks ----
    const { iADMIN } = useAuth()
    const { handleLogoutSubmit } = useAuth()

    // ---- State ----
    const [menuOpen, setMenuOpen] = useState(false)

    const baseNavigation = [
        { name: "My Bookings", href: "/my-bookings", icon: faGhost },
        { name: "Log out", function: handleLogoutSubmit, icon: faDoorOpen },
    ]

    const navigation = iADMIN()
        ? [{ name: "Admin", href: "/admin", icon: faShield }, ...baseNavigation]
        : baseNavigation

    // ---- Rendering ----
    return (
        <Container className="layoutContainer">
            {/* Topmenu */}
            <header className="topMenuHeader">
                <Container className="topMenuInner">
                    <Container className="topMenuFlex">
                        {/* Logo */}
                        <Link className="logo" href="/">
                            <FontAwesomeIcon icon={faGhost} size="2x" />
                            <Txt>Booohking</Txt>
                        </Link>

                        {/* Desktop menu */}
                        <nav className="desktopNav">
                            {navigation.map((item) => {
                                if (item.href) {
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={clsx(
                                                "desktopNavLink",
                                                { "adminLink": item.name === "Admin" }
                                            )}
                                        >
                                            <FontAwesomeIcon icon={item.icon} size="lg" />
                                            <Txt>{item.name}</Txt>
                                        </Link>
                                    )
                                }

                                return (
                                    <Btn
                                        key={item.name}
                                        onClick={item.function}
                                        className={clsx(
                                            "desktopNavLink",
                                            { "adminLink": item.name === "Admin" }
                                        )}
                                    >
                                        <FontAwesomeIcon icon={item.icon} size="lg" />
                                        <Txt>{item.name}</Txt>
                                    </Btn>
                                )
                            })}
                        </nav>

                        {/* Mobile menu button */}
                        <Container
                            className="mobileButton"
                            data-testid="mobileButton"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FontAwesomeIcon
                                icon={menuOpen ? faTimes : faBars}
                                className="h-5 w-5 text-gray-700 dark:text-gray-200"
                            />
                        </Container>
                    </Container>
                </Container>

                {/* Mobile menu */}
                {menuOpen && (
                    <nav className="mobileMenu" data-testid="mobileMenu">
                        {navigation.map((item) => {
                            if (item.href) {
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            "desktopNavLink",
                                            { "adminLink": item.name === "Admin" }
                                        )}
                                    >
                                        <FontAwesomeIcon icon={item.icon} size="lg" />
                                        <Txt>{item.name}</Txt>
                                    </Link>
                                )
                            }

                            return (
                                <Btn
                                    key={item.name}
                                    onClick={item.function}
                                    className={clsx(
                                        "desktopNavLink",
                                        { "adminLink": item.name === "Admin" }
                                    )}
                                >
                                    <FontAwesomeIcon icon={item.icon} size="lg" />
                                    <Txt>{item.name}</Txt>
                                </Btn>
                            )
                        })}
                    </nav>
                )}
            </header>

            {/* Main content */}
            <main className="mainContent">{props.children}</main>
        </Container>
    )
}
