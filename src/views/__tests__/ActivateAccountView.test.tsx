import { ActivateAccountView, ActivateAccountViewProps } from '@/views';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

void React.createElement;

describe('ActivateAccountView', () => {
    let props: ActivateAccountViewProps;
    let handleSubmitMock: jest.Mock;
    let setTokenMock: jest.Mock;
    let setFieldErrorsMock: jest.Mock;

    beforeEach(() => {
        handleSubmitMock = jest.fn().mockResolvedValue(undefined);
        setTokenMock = jest.fn();
        setFieldErrorsMock = jest.fn();

        props = {
            handleSubmit: handleSubmitMock,
            fieldErrors: {},
            setFieldErrors: setFieldErrorsMock,
            token: '',
            setToken: setTokenMock,
            activateError: null,
            activatePending: false
        };
    });

    it('renders the main layout and title', () => {
        render(<ActivateAccountView {...props} />);

        const elements = screen.getAllByText('Activate Account');
        expect(elements).toHaveLength(2);
        elements.forEach(el => expect(el).toBeInTheDocument());

        const form = screen.getByTestId('activate-form');
        expect(form).toBeInTheDocument();
    });

    it('renders the token input and updates state on change', () => {
        render(<ActivateAccountView {...props} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');

        fireEvent.change(input, { target: { value: '12345' } });
        expect(setTokenMock).toHaveBeenCalledWith('12345');
        expect(setFieldErrorsMock).toHaveBeenCalledWith({});
    });

    it('displays field-specific error', () => {
        props.fieldErrors.token = 'Token is required';
        render(<ActivateAccountView {...props} />);
        expect(screen.getByText('Token is required')).toBeInTheDocument();
    });

    it('displays API error when present', () => {
        props.activateError = new Error('Activation failed');
        render(<ActivateAccountView {...props} />);
        expect(screen.getByText('Activation failed')).toBeInTheDocument();
    });

    it('shows LoadingButton when activatePending is true', () => {
        props.activatePending = true;
        render(<ActivateAccountView {...props} />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows "Activate Account" text when activatePending is false', () => {
        render(<ActivateAccountView {...props} />);
        const elements = screen.getAllByText('Activate Account');
        expect(elements).toHaveLength(2);
        elements.forEach(el => expect(el).toBeInTheDocument());
    });

    it('submits the form correctly', () => {
        render(<ActivateAccountView {...props} />);
        const form = screen.getByTestId('activate-form');
        fireEvent.submit(form);
        expect(handleSubmitMock).toHaveBeenCalled();
    });
});
