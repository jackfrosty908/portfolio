import type { Tag as TagType } from '@payload-types';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TagList from './TagList';

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

const makeTags = (names: string[]): TagType[] =>
  names.map((name, idx) =>
    buildTag({
      id: `tag_${idx + 1}`,
      name,
    })
  );

describe('TagList', () => {
  it('renders all tag names', () => {
    const names = ['TypeScript', 'Next.js', 'Payload'];
    render(<TagList tags={makeTags(names)} />);
    for (const name of names) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('supports duplicate tag names', () => {
    const names = ['TypeScript', 'TypeScript'];
    render(<TagList tags={makeTags(names)} />);
    expect(screen.getAllByText('TypeScript')).toHaveLength(2);
  });
});
