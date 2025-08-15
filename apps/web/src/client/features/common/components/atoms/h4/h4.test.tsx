import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import H4 from './h4';

afterEach(() => {
  cleanup();
});

describe('H4', () => {
  it('renders text as level 4 heading', () => {
    render(<H4>Heading Text</H4>);
    expect(
      screen.getByRole('heading', { level: 4, name: 'Heading Text' })
    ).toBeInTheDocument();
  });

  it('renders ReactNode children', () => {
    render(
      <H4>
        <span>Node Content</span>
      </H4>
    );
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(screen.getByText('Node Content')).toBeInTheDocument();
  });
});
