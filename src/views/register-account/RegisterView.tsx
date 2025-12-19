// External
import Link from "next/link";
import React from 'react';

// Internal
import styles from "@/styles/modules/auth.module.scss";
import { UserDTO } from '@/types';
import { Btn, Container, H1, LoadingButton, Paragraph, Txt } from '@/ui';

void React.createElement;

export type RegisterPageFieldErrors = {
    name?: string
    User_Email?: string
    password?: string
    PasswordConfirm?: string
}

export interface RegisterViewProps {
    handleSubmit: (e: React.FormEvent<Element>) => Promise<void>
    fieldErrors: RegisterPageFieldErrors
    user: UserDTO
    handleChange: (field: keyof UserDTO, value: string) => void
    passwordConfirm: string
    setPasswordConfirm: React.Dispatch<React.SetStateAction<string>>
    registerError: Error | null
    registerPending: boolean
}

export const RegisterView: React.FC<RegisterViewProps> = (props) => {
    return (
        <Container className={styles.authContainer}>
            <Container className={styles.authCard}>
                <H1 className={styles.authTitle}>Register</H1>

                <form onSubmit={props.handleSubmit} className={styles.authForm} data-testid="register-form">
                    {/* Name */}
                    <label>
                        <Container className={styles.authLabel}>
                            Name{" "}
                            {props.fieldErrors.name && (
                                <Txt className={styles.authFieldError}>{props.fieldErrors.name}</Txt>
                            )}
                        </Container>
                        <input
                            type="text"
                            value={props.user.name}
                            onChange={(e) => props.handleChange("name", e.target.value)}
                            className={styles.authInput}
                        />
                    </label>

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
                            value={props.user.User_Email}
                            onChange={(e) => props.handleChange("User_Email", e.target.value)}
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
                            value={props.user.password}
                            onChange={(e) => props.handleChange("password", e.target.value)}
                            className={styles.authInput}
                        />
                    </label>

                    {/* Confirm Password */}
                    <label>
                        <Container className={styles.authLabel}>
                            Confirm Password{" "}
                            {props.fieldErrors.PasswordConfirm && (
                                <Txt className={styles.authFieldError}>{props.fieldErrors.PasswordConfirm}</Txt>
                            )}
                        </Container>
                        <input
                            type="password"
                            value={props.passwordConfirm}
                            onChange={(e) => props.setPasswordConfirm(e.target.value)}
                            className={styles.authInput}
                        />
                    </label>

                    {/* Show API error from handleRegister */}
                    {props.registerError && (
                        <Container className={styles.authError}>
                            {(props.registerError as Error).message || "Register failed. Please try again."}
                        </Container>
                    )}

                    <Btn
                        type="submit"
                        className={styles.authButton}
                        disabled={props.registerPending}
                        data-testid="submit-button"
                    >
                        {props.registerPending ? (
                            <LoadingButton />
                        ) : (
                            <>Register</>
                        )}
                    </Btn>
                </form>

                <Paragraph className={styles.authFooter}>
                    Already have an account?{" "}
                    <Link href="/sign-in" className={styles.authLink}>
                        Login
                    </Link>
                </Paragraph>
            </Container>
        </Container>
    )
}
