import { ResetPasswordView, ResetPasswordViewProps } from '@/views';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement

describe('ResetPasswordView', () => {
    let props: ResetPasswordViewProps;

    beforeEach(() => {
        const setState = jest.fn();
        props = {
            handleSubmit: jest.fn().mockResolvedValue(undefined),
            fieldErrors: {},
            token: '',
            setToken: setState,
            setFieldErrors: setState,
            password: '',
            setPassword: setState,
            passwordConfirm: '',
            setPasswordConfirm: setState,
            resetError: null,
            resetPending: false,
        };
    });

    it('renders all input fields and title', () => {
        render(<ResetPasswordView {...props} />);

        expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
        expect(screen.getByLabelText(/Token from e-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });

    it('renders field errors if provided', () => {
        props.fieldErrors = {
            token: 'Invalid token',
            password: 'Password too short',
            passwordConfirm: 'Passwords do not match',
        };
        render(<ResetPasswordView {...props} />);

        expect(screen.getByText('Invalid token')).toBeInTheDocument();
        expect(screen.getByText('Password too short')).toBeInTheDocument();
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('renders API error if resetError is provided', () => {
        props.resetError = new Error('Reset failed');
        render(<ResetPasswordView {...props} />);

        expect(screen.getByText('Reset failed')).toBeInTheDocument();
    });

    it('disables submit button and shows LoadingButton when resetPending is true', () => {
        props.resetPending = true;
        render(<ResetPasswordView {...props} />);

        const btn = screen.getByTestId('submit-button');
        expect(btn).toBeDisabled();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls handleSubmit on form submission', async () => {
        render(<ResetPasswordView {...props} />);
        const form = screen.getByTestId('reset-form');
        expect(form).toBeInTheDocument();

        fireEvent.submit(form!);
        expect(props.handleSubmit).toHaveBeenCalled();
    });

    it('updates state on input change', () => {
        render(<ResetPasswordView {...props} />);

        const tokenInput = screen.getByLabelText(/Token from e-mail/i);
        fireEvent.change(tokenInput, { target: { value: 'abc123' } });
        expect(props.setToken).toHaveBeenCalledWith('abc123');
        expect(props.setFieldErrors).toHaveBeenCalledWith({});

        const passwordInput = screen.getByLabelText(/New Password/i);
        fireEvent.change(passwordInput, { target: { value: 'password1' } });
        expect(props.setPassword).toHaveBeenCalledWith('password1');
        expect(props.setFieldErrors).toHaveBeenCalledWith({});

        const confirmInput = screen.getByLabelText(/Confirm Password/i);
        fireEvent.change(confirmInput, { target: { value: 'password1' } });
        expect(props.setPasswordConfirm).toHaveBeenCalledWith('password1');
    });
});
