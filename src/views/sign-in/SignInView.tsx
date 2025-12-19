// External
import Link from "next/link"

// Internal
import styles from "@/styles/modules/auth.module.scss"
import { UserDTO } from '@/types'
import { Btn, Container, H1, LoadingButton, Paragraph, Txt } from '@/ui'
import React from 'react'

void React.createElement

export type SignInFieldErrors = {
    email?: string
    password?: string
}

export interface SignInViewProps {
    handleSubmit: (e: React.FormEvent<Element>) => Promise<void>
    fieldErrors: SignInFieldErrors
    user: Partial<UserDTO>
    handleChange: (field: keyof UserDTO, value: string) => void
    loginError: Error | null
    loginPending: boolean
}

export const SignInView: React.FC<SignInViewProps> = (props) => (
    <Container className={styles.authContainer}>
        <Container className={styles.authCard}>
            <H1 className={styles.authTitle}>Login</H1>

            <form onSubmit={props.handleSubmit} className={styles.authForm} data-testid="signin-form">
                {/* Email */}
                <label>
                    <Container className={styles.authLabel}>
                        Email{" "}
                        {props.fieldErrors.email && (
                            <Txt className={styles.authFieldError}>{props.fieldErrors.email}</Txt>
                        )}
                    </Container>
                    <input
                        type="email"
                        value={props.user.email || ""}
                        onChange={(e) => props.handleChange("email", e.target.value)}
                        className={styles.authInput}
                    />
                </label>

                {/* Password */}
                <label>
                    <Container className={styles.authLabel}>
                        Password{" "}
                        {props.fieldErrors.password && (
                            <Txt className={styles.authFieldError}>{props.fieldErrors.password}</Txt>
                        )}
                    </Container>
                    <input
                        type="password"
                        value={props.user.password || ""}
                        onChange={(e) => props.handleChange("password", e.target.value)}
                        className={styles.authInput}
                    />
                </label>

                {/* Show API error from handleLoginSubmit */}
                {props.loginError && (
                    <Container className={styles.authError}>
                        {(props.loginError as Error).message || "Login failed. Please try again."}
                    </Container>
                )}

                <Btn
                    type="submit"
                    className={styles.authButton}
                    disabled={props.loginPending}
                >
                    {props.loginPending ? (
                        <LoadingButton />
                    ) : (
                        <Txt>Login</Txt>
                    )}
                </Btn>
            </form>

            <Paragraph className={styles.authFooter}>
                Forgot your password?{" "}
                <Link href="/forgot-password" className={styles.authLink}>
                    Recover
                </Link>
            </Paragraph>
            <Paragraph className={styles.authFooter}>
                Don’t have an account?{" "}
                <Link href="/register-account" className={styles.authLink}>
                    Register
                </Link>
            </Paragraph>
        </Container>
    </Container>
)
