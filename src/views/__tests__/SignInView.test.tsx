import { UserDTO } from '@/types';
import { SignInView, SignInViewProps } from '@/views/sign-in/SignInView';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

describe('SignInView', () => {
    let props: SignInViewProps;
    let handleSubmitMock: jest.Mock;
    let handleChangeMock: jest.Mock;

    const user: Partial<UserDTO> = {
        User_Email: '',
        User_Password: ''
    };

    beforeEach(() => {
        handleSubmitMock = jest.fn().mockResolvedValue(undefined);
        handleChangeMock = jest.fn();

        props = {
            handleSubmit: handleSubmitMock,
            fieldErrors: {},
            user,
            handleChange: handleChangeMock,
            loginError: null,
            loginPending: false
        };
    });

    it('renders the main layout and title', () => {
        render(<SignInView {...props} />);

        const elements = screen.getAllByText('Login');
        expect(elements).toHaveLength(2);
        elements.forEach(el => expect(el).toBeInTheDocument());

        // Email and password inputs
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

        // Submit button
        const button = screen.getByRole('button', { name: /Login/i });
        expect(button).toBeInTheDocument();

        // Footer links
        expect(screen.getByRole('link', { name: /Recover/i })).toHaveAttribute('href', '/forgot-password');
        expect(screen.getByRole('link', { name: /Register/i })).toHaveAttribute('href', '/register-account');
    });

    it('updates state on email and password input change', () => {
        render(<SignInView {...props} />);

        const emailInput = screen.getByLabelText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        expect(handleChangeMock).toHaveBeenCalledWith('User_Email', 'user@example.com');

        const passwordInput = screen.getByLabelText(/Password/i);
        fireEvent.change(passwordInput, { target: { value: 'secret123' } });
        expect(handleChangeMock).toHaveBeenCalledWith('User_Password', 'secret123');
    });

    it('displays field-specific errors', () => {
        props.fieldErrors.User_Email = 'Invalid email';
        props.fieldErrors.User_Password = 'Password required';
        render(<SignInView {...props} />);

        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.getByText('Password required')).toBeInTheDocument();
    });

    it('displays API error if loginError is set', () => {
        props.loginError = new Error('Login failed');
        render(<SignInView {...props} />);

        expect(screen.getByText('Login failed')).toBeInTheDocument();
    });

    it('disables submit button and shows LoadingButton when loginPending is true', () => {
        props.loginPending = true;
        render(<SignInView {...props} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls handleSubmit on form submission', () => {
        render(<SignInView {...props} />);
        const form = screen.getByTestId('signin-form');
        fireEvent.submit(form);

        expect(handleSubmitMock).toHaveBeenCalled();
    });

    it('renders empty values when user object is empty', () => {
        render(<SignInView {...props} />);

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        expect(emailInput).toHaveValue('');
        expect(passwordInput).toHaveValue('');
    });
});
