// External
import Link from "next/link"

// Internal
import styles from "@/styles/modules/auth.module.scss"
import { UserDTO } from '@/types'
import { Btn, Container, H1, LoadingButton, Paragraph, Txt } from '@/ui'
import React from 'react'

void React.createElement

export type SignInFieldErrors = {
    User_Email?: string
    User_Password?: string
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
                        {props.fieldErrors.User_Email && (
                            <Txt className={styles.authFieldError}>{props.fieldErrors.User_Email}</Txt>
                        )}
                    </Container>
                    <input
                        type="email"
                        value={props.user.User_Email || ""}
                        onChange={(e) => props.handleChange("User_Email", e.target.value)}
                        className={styles.authInput}
                    />
                </label>

                {/* Password */}
                <label>
                    <Container className={styles.authLabel}>
                        Password{" "}
                        {props.fieldErrors.User_Password && (
                            <Txt className={styles.authFieldError}>{props.fieldErrors.User_Password}</Txt>
                        )}
                    </Container>
                    <input
                        type="password"
                        value={props.user.User_Password || ""}
                        onChange={(e) => props.handleChange("User_Password", e.target.value)}
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
