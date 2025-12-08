"use client";

// External
import { ProvidersStates, ServiceStates } from "@/types";

// Internal
import styles from "@/styles/modules/overview.module.scss";
import { Card, Container, Txt } from '@/ui';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

void React.createElement

interface PickProviderProps {
    service: ServiceStates;
    providers: ProvidersStates;
    convertURLFormat: (id: number, name: string) => string
}

export const PickProvider: React.FC<PickProviderProps> = (props) => (
    props.providers && props.service && (
        <Container className={styles.gridContainer}>
            {props.providers.map((provider) => (
                <Card.Card key={provider.Provider_ID} className={styles.cardShadow}>
                    <Card.CardHeader>
                        <Container className="flex justify-between items-start">
                            <Container>
                                <Card.CardTitle className={styles.cardTitle}>{provider.Provider_Name}</Card.CardTitle>
                                <Card.CardDescription className={styles.cardDescription}>
                                    <Txt>Working {provider.working_hours?.length || 0} days a week</Txt>
                                </Card.CardDescription>
                            </Container>
                            <Container className="flex gap-2">
                                <Link
                                    className={styles.editButton}
                                    href={`/book/${props.convertURLFormat(provider.Provider_ID ?? 0, provider.Provider_Name)}`}
                                >
                                    Book a timeslot
                                </Link>
                            </Container>
                        </Container>
                    </Card.CardHeader>

                    <Card.CardContent className={styles.cardContent}>
                        {/* Working Hours */}
                        {provider.working_hours && provider.working_hours.length > 0 && (
                            <Container className={styles.sectionContainer}>
                                <h4 className={styles.sectionTitle}>Working Hours:</h4>
                                <ul className={styles.list}>
                                    {provider.working_hours.map((wh) => {
                                        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                        const dayName = wh.PWH_DayOfWeek != null ? dayNames[wh.PWH_DayOfWeek] : "Unknown";
                                        return (
                                            <li key={wh.PWH_ID} className={styles.workingHourItem}>
                                                {dayName}: {wh.PWH_StartTime} - {wh.PWH_EndTime}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Container>
                        )}
                    </Card.CardContent>
                </Card.Card>
            ))}
        </Container>
    )
);

export const PickProviderLoading: React.FC<{ repeat: number }> = (props) => (
    <Container className={clsx(styles.gridContainer, styles.gridContainerLoading)}>
        {Array.from({ length: props.repeat }, (_, i) => (
            <Card.Card key={i} className={styles.cardShadow}>
                <Card.CardHeader>
                    <Container className="flex justify-between items-start">
                        <Container>
                            <Card.CardTitle className={styles.cardTitle}>Provider name</Card.CardTitle>
                            <Card.CardDescription className={styles.cardDescription}>
                                <Txt>Working 6 days a week</Txt>
                            </Card.CardDescription>
                        </Container>
                        <Container className="flex gap-2">
                            <Txt className={styles.editButton}>
                                Book a timeslot
                            </Txt>
                        </Container>
                    </Container>
                </Card.CardHeader>

                <Card.CardContent className={styles.cardContent}>
                    {/* Working Hours */}
                    <Container className={styles.sectionContainer}>
                        <h4 className={styles.sectionTitle}>Working Hours:</h4>
                        <ul className={styles.list}>
                            <li className={styles.workingHourItem}>Mon: 08:00:00 - 16:00:00</li>
                            <li className={styles.workingHourItem}>Tue: 08:00:00 - 16:00:00</li>
                            <li className={styles.workingHourItem}>Wed: 08:00:00 - 16:00:00</li>
                            <li className={styles.workingHourItem}>Thu: 08:00:00 - 16:00:00</li>
                            <li className={styles.workingHourItem}>Fri: 08:00:00 - 16:00:00</li>
                            <li className={styles.workingHourItem}>Sat: 08:00:00 - 16:00:00</li>
                        </ul>
                    </Container>
                </Card.CardContent>
            </Card.Card>
        ))}
    </Container>
);
