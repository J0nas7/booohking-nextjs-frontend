// External
import Link from 'next/link';

// Internal
import styles from "@/styles/modules/overview.module.scss";
import { ProviderStates, UserDTO } from '@/types';
import { Container, H1, LoadingButton, LoadingState, Txt } from '@/ui';
import { PickTimeslot, PickTimeslotLoading } from '@/views';
import React, { RefObject } from 'react';

void React.createElement

export interface BookingProviderViewProps {
    renderProvider: ProviderStates
    providerLoading: boolean
    availableSlotsLoading: boolean
    flatAvailableSlots: any[] | undefined
    authUser: UserDTO | undefined
    convertURLFormat: (id: number, name: string) => string
    containerRef: RefObject<HTMLDivElement | null>
    hasNextPage: boolean
    isFetchingNextPage: boolean
}

export const BookingProviderView: React.FC<BookingProviderViewProps> = (props) => (
    <>
        <Container className="h1-and-loader">
            <H1>{props.renderProvider ? props.renderProvider.Provider_Name : "Provider"}</H1>
            <LoadingState
                singular=""
                isLoading={(!props.authUser || (props.providerLoading || props.availableSlotsLoading))}
                renderItem={props.flatAvailableSlots}
                permitted={true}
            />
        </Container>

        <LoadingState
            singular="Provider"
            loadingTSX={<PickTimeslotLoading repeat={3} />}
            isLoading={props.providerLoading}
            renderItem={props.renderProvider}
            permitted={true}
        >
            {props.renderProvider && (
                <>
                    <Container className={styles.bookHeader}>
                        <Container>
                            <Txt className="text-lg">{props.renderProvider.service?.Service_Name}</Txt>
                            <Txt className="text-sm">
                                {" "}(
                                {props.renderProvider.Provider_Timezone} Timezone{" "}
                                {props.renderProvider.Provider_Timezone
                                    ? new Intl.DateTimeFormat("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                        timeZone: props.renderProvider.Provider_Timezone,
                                    }).format(new Date())
                                    : ""}
                                )
                            </Txt>
                        </Container>
                        {props.renderProvider.service && (
                            <Link href={`/service/${props.convertURLFormat(props.renderProvider.Service_ID ?? 0, props.renderProvider.service?.Service_Name ?? "")}`}>
                                Go back to providers
                            </Link>
                        )}
                    </Container>

                    <Container className="max-h-[calc(100vh-202px)] overflow-auto" ref={props.containerRef}>
                        {props.availableSlotsLoading ? (
                            <PickTimeslotLoading repeat={3} />
                        ) : (
                            <>
                                <PickTimeslot
                                    provider={props.renderProvider}
                                    flatAvailableSlots={props.flatAvailableSlots}
                                />

                                {props.hasNextPage ? (
                                    <>
                                        {props.isFetchingNextPage && (
                                            <LoadingButton
                                                size="2x"
                                                color="yellow"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>No more time slots yet</>
                                )}
                            </>
                        )}
                    </Container>
                </>
            )}
        </LoadingState>
    </>
)
