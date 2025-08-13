import type { Tag as TagType } from '@payload-types';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Tag from './Tag';

afterEach(() => {
  cleanup();
});

const buildTag = (overrides?: Partial<TagType>): TagType => ({
  id: 'tag_1',
  name: 'TypeScript',
  updatedAt: '2025-01-01T00:00:00.000Z',
  createdAt: '2025-01-01T00:00:00.000Z',
  ...overrides,
});

describe('Tag', () => {
  it('renders the tag name', () => {
    const tag = buildTag();
    render(<Tag tag={tag} />);
    expect(screen.getByText(tag.name)).toBeInTheDocument();
  });

  it.each([['TypeScript'], ['Next.js'], ['Payload'], ['Unit Testing']])(
    'renders different tag names: %s',
    (name) => {
      render(<Tag tag={buildTag({ name })} />);
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  );
});
