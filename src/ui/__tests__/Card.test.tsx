import { Card } from '@/ui';
import { render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

describe('Card Component', () => {
    it('renders CardMain correctly with children', () => {
        render(<Card.Card>Card Content</Card.Card>);
        const container = screen.getByText('Card Content');
        expect(container).toBeInTheDocument();
    });

    it('applies custom className to CardMain', () => {
        render(<Card.Card className="custom-class">Content</Card.Card>);
        const container = screen.getByText('Content');
        expect(container).toHaveClass('custom-class');
    });

    it('renders CardHeader correctly', () => {
        render(<Card.CardHeader>Header Content</Card.CardHeader>);
        const header = screen.getByText('Header Content');
        expect(header).toBeInTheDocument();
    });

    it('applies custom className to CardHeader', () => {
        render(<Card.CardHeader className="header-class">Header</Card.CardHeader>);
        const header = screen.getByText('Header');
        expect(header).toHaveClass('header-class');
    });

    // it('renders CardTitle correctly', () => {
    //     render(<Card.CardTitle>Title Content</Card.CardTitle>);
    //     expect(screen.getByText('Title Content')).toBeInTheDocument();
    // });

    // it('applies custom className to CardTitle', () => {
    //     render(<Card.CardTitle className="title-class">Title</Card.CardTitle>);
    //     expect(screen.getByText('Title')).toHaveClass('title-class');
    // });

    // it('renders CardDescription correctly', () => {
    //     render(<Card.CardDescription>Description Content</Card.CardDescription>);
    //     expect(screen.getByText('Description Content')).toBeInTheDocument();
    // });

    // it('applies custom className to CardDescription', () => {
    //     render(<Card.CardDescription className="desc-class">Desc</Card.CardDescription>);
    //     expect(screen.getByText('Desc')).toHaveClass('desc-class');
    // });

    it('renders CardContent correctly', () => {
        render(<Card.CardContent>Inner Content</Card.CardContent>);
        const content = screen.getByText('Inner Content');
        expect(content).toBeInTheDocument();
    });

    it('applies custom className to CardContent', () => {
        render(<Card.CardContent className="content-class">Inner</Card.CardContent>);
        const content = screen.getByText('Inner');
        expect(content).toHaveClass('content-class');
    });

    it('renders nested Card structure with custom classNames', () => {
        render(
            <Card.Card className="main">
                <Card.CardHeader className="header">
                    Header
                    {/* <Card.CardTitle className="title">Nested Title</Card.CardTitle> */}
                    {/* <Card.CardDescription className="description">
                        Nested Description
                    </Card.CardDescription> */}
                </Card.CardHeader>
                <Card.CardContent className="content">Nested Content</Card.CardContent>
            </Card.Card>
        );

        // expect(screen.getByText('Nested Title')).toHaveClass('title');
        // expect(screen.getByText('Nested Description')).toHaveClass('description');
        expect(screen.getByText('Nested Content')).toHaveClass('content');

        const mainWrapper = screen.getByText('Nested Content').parentElement;
        expect(mainWrapper).toHaveClass('main');
    });
});
