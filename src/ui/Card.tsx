"use client";

// External
import React, { ReactNode } from "react";

// Internal
import styles from "@/styles/modules/card.module.scss";
import { Container, H3, Paragraph } from "@/ui";

void React.createElement

interface CardProps {
    children: ReactNode;
    className?: string;
}

interface CardSubProps {
    children: ReactNode;
    className?: string;
}

// --- Main Components ---
const CardMain = ({ children, className = "" }: CardProps) => {
    return (
        <Container className={`${styles.card} ${className}`}>
            {children}
        </Container>
    );
};

const CardHeader = ({ children, className = "" }: CardSubProps) => {
    return (
        <Container className={`${styles.header} ${className}`}>
            {children}
        </Container>
    );
};

const CardTitle = ({ children, className = "" }: CardSubProps) => {
    return (
        <H3 className={`${styles.title} ${className}`}>
            {children}
        </H3>
    );
};

const CardDescription = ({ children, className = "" }: CardSubProps) => {
    return (
        <Paragraph className={`${styles.description} ${className}`}>
            {children}
        </Paragraph>
    );
};

const CardContent = ({ children, className = "" }: CardSubProps) => {
    return (
        <Container className={`${styles.content} ${className}`}>
            {children}
        </Container>
    );
};

// --- Export all as a single object ---
export const Card = {
    Card: CardMain,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
};
