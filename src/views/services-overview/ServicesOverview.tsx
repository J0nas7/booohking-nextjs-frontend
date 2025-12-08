"use client";

import styles from "@/styles/modules/overview.module.scss";
import { ServicesStates } from "@/types";
import { Card, Container, Txt } from "@/ui";
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

void React.createElement;

interface ServicesOverviewProps {
    services: ServicesStates;
    convertURLFormat: (id: number, name: string) => string
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = (props) => (
    <Container className={styles.gridContainer}>
        {props.services && props.services.map((service) => (
            <Card.Card key={service.Service_ID} className={styles.cardShadow}>
                <Card.CardHeader>
                    <Container className="flex justify-between items-start">
                        <Container>
                            <Card.CardTitle className={styles.cardTitle}>{service.Service_Name}</Card.CardTitle>
                            <Card.CardDescription className={styles.cardDescription}>
                                <Txt>
                                    Duration: {service.Service_DurationMinutes} minutes<br />
                                </Txt>
                                <Txt>
                                    Number of Providers: {service.providers?.length}
                                </Txt>
                            </Card.CardDescription>
                        </Container>
                    </Container>
                </Card.CardHeader>

                <Card.CardContent className={styles.cardContent}>
                    <Link
                        className={styles.editButton}
                        href={`/service/${props.convertURLFormat(service.Service_ID ?? 0, service.Service_Name)}`}
                    >
                        Go to booking
                    </Link>
                </Card.CardContent>
            </Card.Card>
        ))}
    </Container>
);

export const ServicesOverviewLoading: React.FC<{ repeat: number }> = (props) => (
    <Container className={clsx(styles.gridContainer, styles.gridContainerLoading)}>
        {Array.from({ length: props.repeat }, (_, i) => (
            <Card.Card key={i} className={styles.cardShadow}>
                <Card.CardHeader>
                    <Container className="flex justify-between items-start">
                        <Container>
                            <Card.CardTitle className={styles.cardTitle}>Service name</Card.CardTitle>
                            <Card.CardDescription className={styles.cardDescription}>
                                <Txt>
                                    Duration: 30 minutes<br />
                                </Txt>
                                <Txt>
                                    Number of Providers: 3
                                </Txt>
                            </Card.CardDescription>
                        </Container>
                    </Container>
                </Card.CardHeader>

                <Card.CardContent className={styles.cardContent}>
                    <Txt className={styles.editButton}>
                        Go to booking
                    </Txt>
                </Card.CardContent>
            </Card.Card>
        ))}
    </Container>
);
