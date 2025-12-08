// Internal
import { BookingsStates, UserDTO } from '@/types';
import { Container, H1, LoadingState } from '@/ui';
import { MyBookings, MyBookingsLoading } from '@/views';
import { faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

void React.createElement

export interface AdminBookingsViewProps {
    adminBookingsLoading: boolean
    authUser: UserDTO | undefined
    flatAdminBookings: BookingsStates
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = (props) => (
    <>
        <Container className="h1-and-loader">
            <H1>Admin Booohkings</H1>
            <LoadingState
                singular=""
                isLoading={props.adminBookingsLoading || props.authUser === undefined}
                renderItem={props.flatAdminBookings}
                permitted={true}
            >
                <FontAwesomeIcon icon={faShield} data-testid="heading-icon" />
            </LoadingState>
        </Container>

        <LoadingState
            singular="Admin booking"
            loadingTSX={<MyBookingsLoading repeat={6} />}
            isLoading={props.adminBookingsLoading || props.authUser === undefined}
            renderItem={props.flatAdminBookings}
            permitted={true}
        >
            {props.authUser && props.authUser.User_Role === "ROLE_ADMIN" && props.flatAdminBookings && (
                <MyBookings flatMyBookings={props.flatAdminBookings} authUser={props.authUser} pov="ADMIN" />
            )}
        </LoadingState>
    </>
)
