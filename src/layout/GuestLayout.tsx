// External
import React from 'react';

// Internal
import { Container, Txt } from "@/ui";

import "@/styles/global/guest.scss";
import { faGhost } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Use React minimally so it isn't removed by IDE
void React.createElement;

type GuestLayoutProps = {
    children?: React.ReactNode
}

export const GuestLayout: React.FC<GuestLayoutProps> = (props) => (
    <Container data-testid="guest-wrapper" className="guest-wrapper">
        <Container data-testid="jumbotron-wrapper" className="jumbotron-wrapper">
            <FontAwesomeIcon data-testid="ghost-logo" className="ghost-logo" icon={faGhost} size="10x" />
            <Txt>Booohking</Txt>
        </Container>
        <Container data-testid="guest-contents" className="guest-contents">
            {props.children}
        </Container>
    </Container>
)
