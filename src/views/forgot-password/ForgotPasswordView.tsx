// External
import Link from "next/link"

// Internal
import styles from "@/styles/modules/auth.module.scss"
import { Btn, Container, H1, LoadingButton, Paragraph, Txt } from '@/ui'
import React from 'react'

void React.createElement

export type ForgotPasswordFieldErrors = {
    email?: string
}

export interface ForgotPasswordViewProps {
    handleSubmit: (e: React.FormEvent<Element>) => Promise<void>
    fieldErrors: ForgotPasswordFieldErrors
    email: string
    setEmail: React.Dispatch<React.SetStateAction<string>>
    setFieldErrors: React.Dispatch<React.SetStateAction<ForgotPasswordFieldErrors>>
    forgotError: Error | null
    forgotPending: boolean
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = (props) => {
    return (
        <Container className={styles.authContainer}>
            <Container className={styles.authCard}>
                <H1 className={styles.authTitle}>Forgot Password</H1>

                <form onSubmit={props.handleSubmit} className={styles.authForm} data-testid="forgot-form">
                    <label>
                        <Container className={styles.authLabel}>
                            Email{" "}
                            {props.fieldErrors.email && (
                                <Txt className={styles.authFieldError}>{props.fieldErrors.email}</Txt>
                            )}
                        </Container>
                        <input
                            type="email"
                            value={props.email}
                            onChange={(e) => {
                                props.setEmail(e.target.value)
                                props.setFieldErrors({})
                            }}
                            className={styles.authInput}
                        />
                    </label>

                    {/* Show API error from handleForgotRequest */}
                    {props.forgotError && (
                        <Container className={styles.authError}>
                            {(props.forgotError as Error).message || "Request failed. Please try again."}
                        </Container>
                    )}

                    <Btn
                        type="submit"
                        className={styles.authButton}
                        disabled={props.forgotPending}
                    >
                        {props.forgotPending ? (
                            <LoadingButton />
                        ) : (
                            <Txt>Send Reset Link</Txt>
                        )}
                    </Btn>
                </form>

                <Paragraph className={styles.authFooter}>
                    Remember your password?{" "}
                    <Link href="/sign-in" className={styles.authLink}>
                        Login
                    </Link>
                </Paragraph>
            </Container>
        </Container>
    )
}
