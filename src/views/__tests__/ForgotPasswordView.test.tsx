import { ForgotPasswordView, ForgotPasswordViewProps } from '@/views/forgot-password/ForgotPasswordView';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement

describe('ForgotPasswordView', () => {
    let props: ForgotPasswordViewProps;

    beforeEach(() => {
        props = {
            email: '',
            setEmail: jest.fn(),
            setFieldErrors: jest.fn(),
            fieldErrors: {},
            handleSubmit: jest.fn().mockResolvedValue(undefined),
            forgotError: null,
            forgotPending: false,
        };
    });

    it('renders form with email input and submit button', () => {
        render(<ForgotPasswordView {...props} />);

        // Check title
        expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();

        // Check email input
        const emailInput = screen.getByLabelText(/Email/i);
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveValue('');

        // Check submit button
        const button = screen.getByRole('button', { name: /Send Reset Link/i });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();

        // Check link
        expect(screen.getByRole('link', { name: /Login/i })).toHaveAttribute('href', '/sign-in');
    });

    it('updates email state on input change', () => {
        render(<ForgotPasswordView {...props} />);

        const emailInput = screen.getByLabelText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

        expect(props.setEmail).toHaveBeenCalledWith('user@example.com');
        expect(props.setFieldErrors).toHaveBeenCalledWith({});
    });

    it('displays field errors if present', () => {
        props.fieldErrors.User_Email = 'Invalid email';
        render(<ForgotPasswordView {...props} />);

        expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });

    it('displays API error if forgotError is set', () => {
        props.forgotError = new Error('Server error');
        render(<ForgotPasswordView {...props} />);

        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
    });

    it('disables submit button and shows loading when pending', () => {
        props.forgotPending = true;
        render(<ForgotPasswordView {...props} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls handleSubmit on form submit', async () => {
        render(<ForgotPasswordView {...props} />);

        const form = screen.getByTestId('forgot-form');
        fireEvent.submit(form);

        expect(props.handleSubmit).toHaveBeenCalled();
    });
});
