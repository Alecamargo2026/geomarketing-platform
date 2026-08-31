import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '@/components/Badge/Badge';

describe('Badge Component', () => {
  it('renders badge with text', () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText(/new/i);
    expect(badge).toBeInTheDocument();
  });

  it('renders badge with primary variant', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText(/primary/i);
    expect(badge).toHaveClass('badge-primary');
  });

  it('renders badge with success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText(/success/i);
    expect(badge).toHaveClass('badge-success');
  });

  it('renders badge with danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>);
    const badge = screen.getByText(/danger/i);
    expect(badge).toHaveClass('badge-danger');
  });

  it('renders badge with size prop', () => {
    render(<Badge size="lg">Large</Badge>);
    const badge = screen.getByText(/large/i);
    expect(badge).toHaveClass('badge-lg');
  });
});
