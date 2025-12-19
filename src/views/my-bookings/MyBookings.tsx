"use client"

// External
import { format, isBefore, parseISO } from "date-fns";

// Internal
import { useBookingsContext } from '@/contexts';
import { setSnackMessage, useAppDispatch } from '@/redux';
import styles from "@/styles/modules/myBookings.module.scss";
import { API_RESOURCES, BookingDTO, UserDTO } from '@/types';
import { Btn, Card, Container, LoadingButton, Txt } from "@/ui";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';

interface MyBookingsProps {
    flatMyBookings: BookingDTO[];
    authUser: UserDTO;
    pov: "ADMIN" | "USER"
}

export const MyBookings: React.FC<MyBookingsProps> = (props) => {
    // ---- Hooks ----
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const { updateBooking } = useBookingsContext()

    // ---- State ----
    const [cancelling, setCancelling] = useState<BookingDTO | undefined>(undefined)
    const now = new Date();

    const upcoming = props.flatMyBookings.filter(
        b => isBefore(now, parseISO(b.Booking_EndAt))
    );

    const past = props.flatMyBookings.filter(
        b => isBefore(parseISO(b.Booking_EndAt), now)
    );

    // ---- React Query useMutation ----
    const { mutate: doCancelBooking, isPending: cancelBookingPending } = useMutation<any, Error, BookingDTO>({
        mutationFn: async (cancelBooking) => updateBooking(cancelBooking, cancelBooking.User_ID),
        onSettled: async () => {
            setCancelling(undefined)
        },
        onError: (err, _, context) => {
            dispatch(setSnackMessage("Something went wrong cancelling the booking. Try again."))
        },
        onSuccess: async () => {
            let queryKey
            if (props.pov === "ADMIN") {
                queryKey = [`admin_${API_RESOURCES.bookings.base}`]
            } else {
                queryKey = [`my_${API_RESOURCES.bookings.base}`, props.authUser?.id]
            }
            queryClient.resetQueries({ queryKey: queryKey, exact: true })
            queryClient.removeQueries({ queryKey: queryKey })
        },
    });


    // ---- Render ----
    const renderBookingCard = (b: BookingDTO) => {
        const startDate = parseISO(b.Booking_StartAt);
        const endDate = parseISO(b.Booking_EndAt);

        const cancelBooking = async () => {
            if (confirm("Are you sure you want to cancel this booking?")) {
                const tempBooking: BookingDTO = {
                    ...b,
                    Booking_Status: "cancelled",
                    Booking_CancelledAt: new Date().toISOString()
                }

                setCancelling(tempBooking)
                doCancelBooking(tempBooking)
            }
        }

        return (
            <Card.Card key={b.Booking_ID} className={styles.bookingCard}>
                <Card.CardContent className="p-4">

                    <Card.CardHeader className="p-0">
                        <Card.CardTitle className={styles.serviceName}>
                            {b.service?.Service_Name ?? "Service"}
                        </Card.CardTitle>
                        <Card.CardDescription className={styles.providerName}>
                            {b.provider?.Provider_Name ?? "Unknown provider"}
                        </Card.CardDescription>
                    </Card.CardHeader>

                    <Container className="mt-3 text-sm">
                        <Container>
                            <Txt className="font-medium">Date:</Txt>{" "}
                            {format(startDate, "EEE, MMM d")}
                        </Container>

                        <Container className="mt-1">
                            <Txt className="font-medium">Time:</Txt>{" "}
                            {format(startDate, "HH:mm")} → {format(endDate, "HH:mm")}
                        </Container>

                        {props.pov === "ADMIN" && (
                            <Container className="mt-1">
                                <Txt className="font-medium">Booked by:</Txt>{" "}
                                {b.user?.name}{" "}
                                <Txt className="text-xs">({b.user?.email})</Txt>
                            </Container>
                        )}
                    </Container>

                    {/* Status chips */}
                    <Container className={styles.statusChip}>
                        <Txt
                            className={`${styles.chip} ${b.Booking_Status === "booked"
                                ? styles.chipBooked
                                : styles.chipCancelled
                                }`}
                        >
                            {b.Booking_Status.toUpperCase()}
                        </Txt>

                        {!b.Booking_CancelledAt && (
                            <Btn
                                className="button button-red"
                                disabled={cancelBookingPending}
                                onClick={cancelBooking}
                            >
                                {cancelling?.Booking_ID === b.Booking_ID && cancelBookingPending ? (
                                    <LoadingButton />
                                ) : (
                                    <>Cancel booking</>
                                )}
                            </Btn>
                        )}
                    </Container>
                </Card.CardContent>
            </Card.Card>
        );
    };

    return (
        <Container className={styles.container}>
            {/* UPCOMING BOOKINGS */}
            <h2 className={styles.sectionTitle}>Upcoming bookings</h2>

            {upcoming.length === 0 ? (
                <p className={styles.emptyText}>
                    You have no upcoming bookings.
                </p>
            ) : (
                <Container className={styles.gridContainer}>
                    {upcoming.map(renderBookingCard)}
                </Container>
            )}

            {/* PAST BOOKINGS */}
            <h2 className={styles.sectionTitle}>Past bookings</h2>

            {past.length === 0 ? (
                <p className={styles.emptyText}>
                    No past bookings.
                </p>
            ) : (
                <Container className={styles.gridContainer}>
                    {past.map(renderBookingCard)}
                </Container>
            )}
        </Container>
    );
}

export const MyBookingsLoading: React.FC<{ repeat: number }> = (props) => {
    const renderBookingCard = () => (
        <Card.Card className={styles.bookingCard}>
            <Card.CardContent className="p-4">

                <Card.CardHeader className="p-0">
                    <Card.CardTitle className={styles.serviceName}>
                        Service name
                    </Card.CardTitle>
                    <Card.CardDescription className={styles.providerName}>
                        Provider name
                    </Card.CardDescription>
                </Card.CardHeader>

                <Container className="mt-3 text-sm">
                    <Container className={styles.bookingMeta}>
                        <Txt>Date:</Txt>{" "}
                        {format(new Date(), "EEE, MMM d")}
                    </Container>

                    <Container className={styles.bookingMeta}>
                        <Txt>Time:</Txt>{" "}
                        {format(new Date(), "HH:mm")} → {format(new Date(), "HH:mm")}
                    </Container>
                </Container>

                {/* Status chips */}
                <Container className={styles.statusChip}>
                    <Txt className={`${styles.chip} ${styles.chipBooked}`}>
                        BOOKED
                    </Txt>
                </Container>
            </Card.CardContent>
        </Card.Card>
    );

    return (
        <Container className={clsx(styles.container, styles.containerLoading)}>
            {/* UPCOMING BOOKINGS */}
            <h2 className={styles.sectionTitle}>Upcoming bookings</h2>

            <Container className={styles.gridContainer}>
                {Array.from({ length: props.repeat }, (_, i) => (
                    <Container key={i}>{renderBookingCard()}</Container>
                ))}
            </Container>
        </Container>
    );
}
