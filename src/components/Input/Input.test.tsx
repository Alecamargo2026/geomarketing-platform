import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from '@/components/Input/Input';

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeInTheDocument();
  });

  it('renders input with label', () => {
    render(<Input label="Username" />);
    const label = screen.getByText(/username/i);
    expect(label).toBeInTheDocument();
  });

  it('renders input with error message', () => {
    render(<Input error="This field is required" />);
    const error = screen.getByText(/this field is required/i);
    expect(error).toBeInTheDocument();
  });

  it('renders disabled input', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders input with value', () => {
    render(<Input value="test value" onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('renders input with type', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');
  });
});
