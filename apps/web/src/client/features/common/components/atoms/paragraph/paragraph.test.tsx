import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Paragraph from './paragraph';

afterEach(() => {
  cleanup();
});

describe('Paragraph', () => {
  it('renders paragraph text', () => {
    render(<Paragraph>Body text</Paragraph>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('renders ReactNode children', () => {
    render(
      <Paragraph>
        <span>Inline Node</span>
      </Paragraph>
    );
    expect(screen.getByText('Inline Node')).toBeInTheDocument();
  });
});
