// External
import { DehydratedState } from '@tanstack/react-query';
import React from "react";

// Internal
import { getCookieValue } from '@/app/lib/getCookieValue';
import { Providers } from '@/layout';

interface ServerAuthProps {
    children: React.ReactNode
    dehydratedState?: DehydratedState
}

export const ServerAuth: React.FC<ServerAuthProps> = async (props) => {
    const token = await getCookieValue("accessToken")
    const isLoggedIn = Boolean(token);

    return (
        <>
            {/* {isLoggedIn ? `Token: ${token?.substring(0, 10)}...` : "No token"} */}
            <Providers isLoggedIn={isLoggedIn} dehydratedState={props.dehydratedState}>
                {props.children}
            </Providers>
        </>
    );
};
