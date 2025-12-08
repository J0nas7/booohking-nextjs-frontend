// Internal
import { BookingsStates, UserDTO } from '@/types';
import { Container, H1, LoadingState } from '@/ui';
import { MyBookings, MyBookingsLoading } from '@/views';
import { faGhost } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

void React.createElement

export interface MyBookingsViewProps {
    myBookingsLoading: boolean
    authUser: UserDTO | undefined
    flatMyBookings: BookingsStates
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = (props) => (
    <>
        <Container className="h1-and-loader">
            <H1>My Booohkings</H1>
            <LoadingState
                singular=""
                isLoading={props.myBookingsLoading || props.authUser === undefined}
                renderItem={props.flatMyBookings}
                permitted={true}
            >
                <FontAwesomeIcon icon={faGhost} />
            </LoadingState>
        </Container>

        <LoadingState
            singular="My booking"
            loadingTSX={<MyBookingsLoading repeat={6} />}
            isLoading={props.myBookingsLoading || props.authUser === undefined}
            renderItem={props.flatMyBookings}
            permitted={true}
        >
            {props.authUser && props.flatMyBookings && (
                <MyBookings flatMyBookings={props.flatMyBookings} authUser={props.authUser} pov="USER" />
            )}
        </LoadingState>
    </>
)
