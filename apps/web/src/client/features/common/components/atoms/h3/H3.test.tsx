import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import H3 from './H3';

afterEach(() => {
  cleanup();
});

describe('H3', () => {
  it('renders text as level 3 heading', () => {
    render(<H3>Heading Text</H3>);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Heading Text' })
    ).toBeInTheDocument();
  });

  it('renders ReactNode children', () => {
    render(
      <H3>
        <span>Node Content</span>
      </H3>
    );
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Node Content')).toBeInTheDocument();
  });
});
