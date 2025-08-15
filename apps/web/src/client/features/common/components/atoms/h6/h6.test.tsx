import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import H6 from './h6';

afterEach(() => {
  cleanup();
});

describe('H6', () => {
  it('renders text as level 6 heading', () => {
    render(<H6>Heading Text</H6>);
    expect(
      screen.getByRole('heading', { level: 6, name: 'Heading Text' })
    ).toBeInTheDocument();
  });

  it('renders ReactNode children', () => {
    render(
      <H6>
        <span>Node Content</span>
      </H6>
    );
    expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
    expect(screen.getByText('Node Content')).toBeInTheDocument();
  });
});
