"use client";

// External
import { useBookingsContext } from '@/contexts';
import { selectAuthUser, setSnackMessage, useAppDispatch, useTypedSelector } from '@/redux';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Internal
import styles from "@/styles/modules/overview.module.scss";
import { BookingDTO, ProviderStates } from '@/types';
import { Card, Container, H3, Txt } from "@/ui";
import clsx from 'clsx';

void React.createElement

type Slot = { date: string; start: string; end: string; }

interface PickTimeslotProps {
    provider: ProviderStates;
    flatAvailableSlots: any[] | undefined
}

export const PickTimeslot: React.FC<PickTimeslotProps> = (props) => {
    // ---- Hooks ----
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { storeBooking } = useBookingsContext()

    // ---- State ----
    const [pickedSlot, setPickedSlot] = useState<Slot | null>(null)
    const authUser = useTypedSelector(selectAuthUser)

    // --- React Query Mutation ---
    const { mutate: doCreateBooking, isPending: createBookingPending } = useMutation<any, Error, BookingDTO>({
        mutationFn: async (newBooking) => storeBooking(authUser?.User_ID ?? 0, newBooking),
        // If the mutation fails
        onError: (err, _, context) => {
            dispatch(setSnackMessage("Something went wrong booking the slot. Try again."))
        },
        onSuccess: async () => {
            router.push("/my-bookings")
        }
    });

    // ---- Methods ----
    const pickTimeslot = async (slot: Slot) => {
        if (authUser && props.provider) {
            setPickedSlot(slot)
            const newBooking: BookingDTO = {
                User_ID: authUser.User_ID ?? 0,
                Provider_ID: props.provider.Provider_ID ?? 0,
                Service_ID: props.provider.service?.Service_ID ?? 0,
                Booking_StartAt: new Date(`${slot.date} ${slot.start}`).toISOString(),
                Booking_EndAt: new Date(`${slot.date} ${slot.end}`).toISOString(),
                Booking_Status: "booked"
            }

            doCreateBooking(newBooking)
        }
    }

    // Group slots by date
    const slotsByDate: Record<string, Slot[]> = {};
    props.flatAvailableSlots && props.flatAvailableSlots.forEach(slot => {
        if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
        slotsByDate[slot.date].push(slot);
    });

    return (
        <>
            {Object.entries(slotsByDate).map(([date, slots]) => {
                const getDay = new Date(date).getDay()
                const workingHours = props.provider && props.provider.working_hours?.find((wh) => wh.PWH_DayOfWeek === getDay)
                return (
                    <Container key={date} className={styles.dateContainer}>
                        {/* Date header */}
                        <H3 className={styles.dateHeader}>
                            {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                        </H3>
                        {workingHours && (
                            <Txt className={styles.dateTimestamp}>
                                {workingHours.PWH_StartTime.substring(0, 5)}-{workingHours.PWH_EndTime.substring(0, 5)}{" "}
                                <Txt>({props.provider && props.provider.Provider_Timezone})</Txt>
                            </Txt>
                        )}

                        {/* Slots grid */}
                        <Container className={styles.gridContainer}>
                            {slots.map((slot, index) => {
                                const now = new Date()
                                const dateStamp = new Date(`${slot.date} ${slot.start}`)
                                const active = now.getTime() < dateStamp.getTime()

                                return (
                                    <Container
                                        key={index}
                                        onClick={() => (active && authUser) && pickTimeslot(slot)}
                                        onKeyDown={(e) => {
                                            if (active && authUser && (e.key === "Enter" || e.key === " ")) {
                                                e.preventDefault(); // prevent scrolling for space
                                                pickTimeslot(slot);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={(active && authUser) ? 0 : -1}
                                        className={clsx(
                                            authUser && "cursor-pointer"
                                        )}
                                    >
                                        <Card.Card className={styles.cardShadow}>
                                            <Card.CardHeader>
                                                <Card.CardTitle>
                                                    <Txt className={styles.cardInnerTitle}>
                                                        <Txt className={clsx(
                                                            !active && styles.cardInactive
                                                        )}>
                                                            {slot.start} → {slot.end}
                                                        </Txt>
                                                        {createBookingPending && pickedSlot === slot && (
                                                            <FontAwesomeIcon data-testid="booking-slot-spinner" icon={faSpinner} spin={true} />
                                                        )}
                                                    </Txt>
                                                </Card.CardTitle>
                                            </Card.CardHeader>
                                        </Card.Card>
                                    </Container>
                                )
                            })}
                        </Container>
                    </Container>
                )
            })}
        </>
    );
};

interface PickTimeslotLoadingProps {
    repeat: number
}

export const PickTimeslotLoading: React.FC<PickTimeslotLoadingProps> = (props) => (
    Array.from({ length: props.repeat }, (_, i) => (
        <Container key={i} className={clsx(styles.dateContainer, styles.dateContainerLoading)}>
            {/* Date header */}
            <H3 className={styles.dateHeader}>
                Day
            </H3>
            <Txt className={styles.dateTimestamp}>08:00-16:00</Txt>

            {/* Slots grid */}
            <Container className={styles.gridContainer}>
                {Array.from({ length: (props.repeat * 2) }, (_, j) => (
                    <Container key={j}>
                        <Card.Card className={styles.cardShadow}>
                            <Card.CardHeader>
                                <Card.CardTitle>
                                    <Txt className={styles.cardInnerTitle}>
                                        <Txt>08:00 → 08:30</Txt>
                                    </Txt>
                                </Card.CardTitle>
                            </Card.CardHeader>
                        </Card.Card>
                    </Container>
                ))}
            </Container>
        </Container>
    ))
);
