// Internal
import styles from "@/styles/modules/auth.module.scss"
import { Btn, Container, H1, LoadingButton, Txt } from '@/ui'
import React from 'react'

void React.createElement

export type ActivateAccountFieldErrors = {
    token?: string
}

export interface ActivateAccountViewProps {
    handleSubmit: (e: React.FormEvent<Element>) => Promise<void>
    fieldErrors: ActivateAccountFieldErrors
    setFieldErrors: React.Dispatch<ActivateAccountFieldErrors>
    token: string
    setToken: React.Dispatch<React.SetStateAction<string>>
    activateError: Error | null
    activatePending: boolean
}

export const ActivateAccountView: React.FC<ActivateAccountViewProps> = (props) => (
    <Container className={styles.authContainer}>
        <Container className={styles.authCard}>
            <H1 className={styles.authTitle}>Activate Account</H1>

            <form onSubmit={props.handleSubmit} className={styles.authForm} data-testid="activate-form">
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

                {/* Show API error from handleActivateAccount */}
                {props.activateError && (
                    <Container className={styles.authError}>
                        {(props.activateError as Error).message || "Request failed. Please try again."}
                    </Container>
                )}

                <Btn
                    type="submit"
                    className={styles.authButton}
                    disabled={props.activatePending}
                >
                    {props.activatePending ? (
                        <LoadingButton />
                    ) : (
                        <Txt>Activate Account</Txt>
                    )}
                </Btn>
            </form>
        </Container>
    </Container>
)
