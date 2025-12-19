// Internal
import styles from "@/styles/modules/auth.module.scss"
import { Btn, Container, H1, LoadingButton, Txt } from '@/ui'
import React from 'react'

void React.createElement

export type ResetPasswordFieldErrors = {
    email?: string
    token?: string
    password?: string
    passwordConfirm?: string
}

export interface ResetPasswordViewProps {
    handleSubmit: (e: React.FormEvent<Element>) => Promise<void>
    fieldErrors: ResetPasswordFieldErrors
    token: string
    setToken: React.Dispatch<React.SetStateAction<string>>
    setFieldErrors: React.Dispatch<React.SetStateAction<ResetPasswordFieldErrors>>
    password: string
    setPassword: React.Dispatch<React.SetStateAction<string>>
    passwordConfirm: string
    setPasswordConfirm: React.Dispatch<React.SetStateAction<string>>
    resetError: Error | null
    resetPending: boolean
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = (props) => (
    <Container className={styles.authContainer}>
        <Container className={styles.authCard}>
            <H1 className={styles.authTitle}>Reset Your Password</H1>

            <form onSubmit={props.handleSubmit} className={styles.authForm} data-testid="reset-form">
                <label>
                    <Container className={styles.authLabel}>
                        Token from e-mail{" "}
                        {props.fieldErrors.token && (
                            <Txt className={styles.authFieldError}>{props.fieldErrors.token}</Txt>
                        )}
                    </Container>
                    <input
                        type="text"
                        value={props.token}
                        onChange={(e) => {
                            props.setToken(e.target.value)
                            props.setFieldErrors({})
                        }}
                        className={styles.authInput}
                    />
                </label>

                <label>
                    <Container className={styles.authLabel}>
                        New Password{" "}
                        {props.fieldErrors.password && (
                            <Txt className={styles.authFieldError}>{props.fieldErrors.password}</Txt>
                        )}
                    </Container>
                    <input
                        type="password"
                        value={props.password}
                        onChange={(e) => {
                            props.setPassword(e.target.value)
                            props.setFieldErrors({})
                        }}
                        className={styles.authInput}
                    />
                </label>

                {/* Confirm Password */}
                <label>
                    <Container className={styles.authLabel}>
                        Confirm Password{" "}
                        {props.fieldErrors.passwordConfirm && (
                            <Txt className={styles.authFieldError}>{props.fieldErrors.passwordConfirm}</Txt>
                        )}
                    </Container>
                    <input
                        type="password"
                        value={props.passwordConfirm}
                        onChange={(e) => props.setPasswordConfirm(e.target.value)}
                        className={styles.authInput}
                    />
                </label>

                {/* Show API error from handleResetPassword */}
                {Boolean(props.fieldErrors.email || props.resetError) && (
                    <Container className={styles.authError}>
                        {props.fieldErrors.email || (props.resetError as Error).message || "Request failed. Please try again."}
                    </Container>
                )}

                <Btn
                    type="submit"
                    className={styles.authButton}
                    disabled={props.resetPending}
                    data-testid="submit-button"
                >
                    {props.resetPending ? (
                        <LoadingButton />
                    ) : (
                        <Txt>Reset Password</Txt>
                    )}
                </Btn>
            </form>
        </Container>
    </Container>
)
