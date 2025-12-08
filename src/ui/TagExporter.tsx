import React from 'react';

import {
    WebBtn,
    WebContainer,
    WebH1,
    WebH3,
    WebParagraph,
    WebTxt,
} from '@/ui';

/**
 * Lazy runtime check to see if we're on the web
 * Determine Next.js/React Native
 */
export const isWeb = () => {
    try {
        return (
            (typeof document !== "undefined" && typeof window !== "undefined") ||
            process.env.NEXT_RUNTIME === "edge" ||
            process.env.NODE_ENV === "production"
        );
    } catch {
        return true; // default to web in Next.js SSR
    }
};

export interface WebContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: React.CSSProperties;
    className?: string;
}

export type ContainerProps = (WebContainerProps) & {
    children?: React.ReactNode;
};

function wrapComponent<WebProps, RefType = any>(
    WebComp: React.ComponentType<WebProps>
) {
    return React.forwardRef<RefType, WebProps>((props, ref) => {
        if (isWeb()) {
            return <WebComp {...(props as WebProps)} ref={ref as any} />;
        }
    });
}

/**
 * Export SSR-safe components
 * Web and Native props are incompatible
 */

export const Btn = wrapComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(WebBtn);

export const Txt = wrapComponent<
    React.HTMLAttributes<HTMLSpanElement>
>(WebTxt);

export const Paragraph = wrapComponent<
    React.HTMLAttributes<HTMLParagraphElement>
>(WebParagraph);

type WebHeadingProps = React.HTMLAttributes<HTMLHeadingElement>;
export const H1 = wrapComponent<
    WebHeadingProps
>(WebH1);

export const H3 = wrapComponent<
    WebHeadingProps
>(WebH3);

export const Container = wrapComponent<
    WebContainerProps
>(WebContainer);
