import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import H5 from './H5';

afterEach(() => {
  cleanup();
});

describe('H5', () => {
  it('renders text as level 5 heading', () => {
    render(<H5>Heading Text</H5>);
    expect(
      screen.getByRole('heading', { level: 5, name: 'Heading Text' })
    ).toBeInTheDocument();
  });

  it('renders ReactNode children', () => {
    render(
      <H5>
        <span>Node Content</span>
      </H5>
    );
    expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument();
    expect(screen.getByText('Node Content')).toBeInTheDocument();
  });
});
