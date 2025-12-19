import { UserDTO } from '@/types';
import { RegisterPageFieldErrors, RegisterView, RegisterViewProps } from '@/views/register-account/RegisterView';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

describe('RegisterView', () => {
    let props: RegisterViewProps;
    let handleSubmitMock: jest.Mock;
    let handleChangeMock: jest.Mock;
    let setPasswordConfirmMock: jest.Mock;

    const user: UserDTO = {
        User_Name: '',
        User_Email: '',
        User_Password: '',
        role: 'ROLE_USER',
    };

    beforeEach(() => {
        handleSubmitMock = jest.fn().mockResolvedValue(undefined);
        handleChangeMock = jest.fn();
        setPasswordConfirmMock = jest.fn();

        props = {
            handleSubmit: handleSubmitMock,
            fieldErrors: {},
            user,
            handleChange: handleChangeMock,
            passwordConfirm: '',
            setPasswordConfirm: setPasswordConfirmMock,
            registerError: null,
            registerPending: false,
        };
    });

    it('renders the main layout and title', () => {
        render(<RegisterView {...props} />);

        const elements = screen.getAllByText('Register');
        expect(elements).toHaveLength(2);
        elements.forEach(el => expect(el).toBeInTheDocument());

        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput).toBeInTheDocument();

        const emailInput = screen.getByLabelText(/Email/i);
        expect(emailInput).toBeInTheDocument();

        const passwordInput = screen.getByLabelText('Password');
        expect(passwordInput).toBeInTheDocument();

        const confirmInput = screen.getByLabelText(/Confirm Password/i);
        expect(confirmInput).toBeInTheDocument();

        const submitBtn = screen.getByRole('button', { name: /Register/i });
        expect(submitBtn).toBeInTheDocument();

        const loginLink = screen.getByRole('link', { name: /Login/i });
        expect(loginLink).toHaveAttribute('href', '/sign-in');
    });

    it('updates state on input change', () => {
        render(<RegisterView {...props} />);

        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(handleChangeMock).toHaveBeenCalledWith('User_Name', 'John Doe');

        const emailInput = screen.getByLabelText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        expect(handleChangeMock).toHaveBeenCalledWith('User_Email', 'john@example.com');

        const passwordInput = screen.getByLabelText(/^Password$/i);
        fireEvent.change(passwordInput, { target: { value: 'secret123' } });
        expect(handleChangeMock).toHaveBeenCalledWith('User_Password', 'secret123');

        const confirmInput = screen.getByLabelText(/Confirm Password/i);
        fireEvent.change(confirmInput, { target: { value: 'secret123' } });
        expect(setPasswordConfirmMock).toHaveBeenCalledWith('secret123');
    });

    it('displays field errors if present', () => {
        const fieldErrors: RegisterPageFieldErrors = {
            User_Name: 'Name required',
            User_Email: 'Invalid email',
            User_Password: 'Password too short',
            PasswordConfirm: 'Passwords do not match',
        };
        props.fieldErrors = fieldErrors;
        render(<RegisterView {...props} />);

        Object.values(fieldErrors).forEach(err => {
            expect(screen.getByText(err!)).toBeInTheDocument();
        });
    });

    it('displays API error if registerError is set', () => {
        props.registerError = new Error('Registration failed');
        render(<RegisterView {...props} />);

        expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });

    it('disables submit button and shows LoadingButton when registerPending is true', () => {
        props.registerPending = true;
        render(<RegisterView {...props} />);

        const btn = screen.getByTestId('submit-button');
        expect(btn).toBeDisabled();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls handleSubmit on form submission', () => {
        render(<RegisterView {...props} />);
        const form = screen.getByTestId('register-form');
        fireEvent.submit(form);
        expect(handleSubmitMock).toHaveBeenCalled();
    });
});
