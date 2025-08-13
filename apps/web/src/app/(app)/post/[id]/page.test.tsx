import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Page from './page';

type FeatureProps = { id: string };

const { capture } = vi.hoisted(() => ({ capture: { id: '' as string } }));

vi.mock('@/client/features/blog-post/BlogPostFeature', () => ({
  default: ({ id }: FeatureProps) => {
    capture.id = id;
    return <div data-id={id} data-testid="blog-post-feature" />;
  },
}));

afterEach(() => {
  cleanup();
});

describe('Post page (/post/[id])', () => {
  it('passes the route param id to BlogPostFeature', async () => {
    const ui = await Page({ params: { id: 'abc123' } });
    render(ui);
    expect(capture.id).toBe('abc123');
    expect(screen.getByTestId('blog-post-feature')).toHaveAttribute(
      'data-id',
      'abc123'
    );
  });

  it('supports different id values', async () => {
    const ui = await Page({ params: { id: 'post_42' } });
    render(ui);
    expect(capture.id).toBe('post_42');
  });
});
