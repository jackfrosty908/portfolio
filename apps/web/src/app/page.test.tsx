import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('Home page', () => {
  it('should render the landing feature', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', {
      name: "Jack's Portfolio",
    });
    expect(heading).toBeDefined();
  });
});
