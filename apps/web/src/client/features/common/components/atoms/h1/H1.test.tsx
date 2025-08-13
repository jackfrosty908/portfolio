import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import H1 from './H1';

afterEach(() => {
  cleanup();
});

describe('H1', () => {
  it('renders text as level 1 heading', () => {
    render(<H1>Heading Text</H1>);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Heading Text' })
    ).toBeInTheDocument();
  });

  it('renders ReactNode children', () => {
    render(
      <H1>
        <span>Node Content</span>
      </H1>
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Node Content')).toBeInTheDocument();
  });
});
