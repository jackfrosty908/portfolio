import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import H2 from './h2';

afterEach(() => {
  cleanup();
});

describe('H2', () => {
  it('renders text as level 2 heading', () => {
    render(<H2>Heading Text</H2>);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Heading Text' })
    ).toBeInTheDocument();
  });

  it('renders ReactNode children', () => {
    render(
      <H2>
        <span>Node Content</span>
      </H2>
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Node Content')).toBeInTheDocument();
  });
});
