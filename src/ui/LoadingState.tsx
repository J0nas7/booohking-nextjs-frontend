// External
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

// Internal
import type { BookingsStates, ProvidersStates, ProviderStates, ServicesStates, ServiceStates } from '@/types';
import { Container, Txt } from '@/ui';

type LoadingStateProps = {
    singular: string
    isLoading: boolean
    renderItem: ProvidersStates | ProviderStates | ServicesStates | ServiceStates | BookingsStates
    permitted: boolean | undefined
    loadingTSX?: React.ReactNode | undefined
    tableTSX?: React.ReactNode
    children?: React.ReactNode
}

export const LoadingState: React.FC<LoadingStateProps> = (props) => (
    <>
        {props.isLoading ? (
            <>
                {props.tableTSX ? (
                    <>{props.tableTSX}</>
                ) : (
                    <Container aria-live="polite" aria-busy="true" className="loading-state loading">
                        {props.loadingTSX ? (
                            <Container role="status" className="loadingTSX">{props.loadingTSX}</Container>
                        ) : (
                            <Container role="status" className="spinnerLoader">
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    spin={true}
                                    size="2x"
                                    color="yellow"
                                    data-testid="state-spinner"
                                />
                            </Container>
                        )}
                    </Container>
                )}
            </>
        ) : props.permitted !== undefined && !props.permitted && props.singular.length ? (
            <Container className="loading-state notX">
                <Txt className="notX">
                    You don't have permission to view this {props.singular.toLowerCase()}
                </Txt>
            </Container>
        ) : !props.isLoading && props.renderItem === false && props.singular.length ? (
            <Container className="loading-state notX">
                <Txt className="notX">
                    {props.singular} not found
                </Txt>
            </Container>
        ) : !props.isLoading && Array.isArray(props.renderItem) && !props.renderItem.length && props.singular.length ? (
            <Container className="loading-state notX">
                <Txt className="notX">
                    No {props.singular.toLowerCase()}s found
                </Txt>
            </Container>
        ) : (
            props.children
        )}
    </>
)

interface LoadingButtonProps {
    className?: string
    size?: SizeProp | undefined
    color?: string
}

export const LoadingButton: React.FC<LoadingButtonProps> = (props) => (
    <FontAwesomeIcon
        icon={faSpinner}
        spin={true}
        size={props.size}
        color={props.color}
        data-testid="loading-spinner"
    />
)
