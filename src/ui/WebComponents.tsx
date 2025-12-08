import type { WebContainerProps } from '@/ui';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export const WebBtn = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, children, ...props }, ref) => (
        <button ref={ref} className={className} {...props}>
            {children}
        </button>
    )
);

export const WebParagraph = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, children, ...props }, ref) => (
        <p ref={ref} className={className} {...props}>
            {children}
        </p>
    )
);

export const WebTxt = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
    ({ className, children, ...props }, ref) => (
        <span ref={ref} className={className} {...props}>
            {children}
        </span>
    )
);

export const WebH1 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => (
        <h1 ref={ref} className={className} {...props}>
            {children}
        </h1>
    )
);

export const WebH3 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => (
        <h3 ref={ref} className={className} {...props}>
            {children}
        </h3>
    )
);

export const WebContainer = forwardRef<HTMLDivElement, WebContainerProps>(
    ({ className, children, style, ...props }, ref) => (
        <div ref={ref} className={className} style={style} {...props}>
            {children}
        </div>
    )
);
