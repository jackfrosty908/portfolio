import type { Post as PostType, Tag as TagType, User } from '@payload-types';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './blog-post-feature';

// Hoisted mocks
const { mockCreateClient, mockQuery } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
  mockQuery: vi.fn(),
}));

vi.mock('@/server/integrations/payload-client/client', () => ({
  default: mockCreateClient,
}));

vi.mock('@/client/features/common/components/ui/card', () => ({
  Card: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <h2 {...props}>{children}</h2>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/client/features/rich-text/rich-text-feature', () => ({
  default: ({ content }: { content: unknown }) => (
    <div data-testid="rich-text">{content ? 'Rich content' : 'No content'}</div>
  ),
}));

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateClient.mockReturnValue({ query: mockQuery });
});

const byNormalizedText =
  (expected: string) =>
  (_content: string, element: Element | null): boolean => {
    const text = element?.textContent ?? '';
    return text.replace(/\s+/g, ' ').trim() === expected;
  };

const buildPost = (overrides?: Partial<PostType>): Partial<PostType> => ({
  title: 'Post Title',
  content: null,
  tags: [],
  author: null,
  updatedAt: '2024-01-05T00:00:00.000Z',
  ...overrides,
});

describe('BlogPostFeature Page', () => {
  it('renders fallback when post is not found', async () => {
    mockQuery.mockResolvedValue({ data: { Posts: { docs: [] } } });

    const ui = await Page({ id: 'post_1' });
    render(ui);

    expect(screen.getByText('Post not found')).toBeInTheDocument();
    expect(mockCreateClient).toHaveBeenCalledOnce();
    expect(mockQuery).toHaveBeenCalledOnce();
    expect(mockQuery.mock.calls[0]?.[0]).toMatchObject({
      variables: { id: 'post_1' },
    });
  });

  it('renders title, formatted date, author name, and tags', async () => {
    const tags: TagType[] = [
      {
        id: 't1',
        name: 'TypeScript',
        updatedAt: '2024-01-01',
        createdAt: '2024-01-01',
      },
      {
        id: 't2',
        name: 'Next.js',
        updatedAt: '2024-01-01',
        createdAt: '2024-01-01',
      },
    ];
    const post = buildPost({
      title: 'Hello World',
      updatedAt: '2024-01-05T00:00:00.000Z',
      author: { first_name: 'Jane', last_name: 'Doe' } as User,
      tags,
    });

    mockQuery.mockResolvedValue({ data: { Posts: { docs: [post] } } });

    const ui = await Page({ id: 'post_2' });
    render(ui);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(
      screen.getByText(byNormalizedText('Updated 05 Jan 2024 by Jane Doe'))
    ).toBeInTheDocument();

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('renders "Anonymous" when author is a string', async () => {
    const post = buildPost({
      author: 'user_123' as unknown as User,
      title: 'Anonymous Post',
    });

    mockQuery.mockResolvedValue({ data: { Posts: { docs: [post] } } });

    const ui = await Page({ id: 'post_3' });
    render(ui);

    expect(screen.getByText('Anonymous Post')).toBeInTheDocument();
    expect(
      screen.getByText(byNormalizedText('Updated 05 Jan 2024 by Anonymous'))
    ).toBeInTheDocument();
  });

  it('renders "Anonymous" when author is missing', async () => {
    const post = buildPost({
      author: null,
      title: 'No Author Post',
    });

    mockQuery.mockResolvedValue({ data: { Posts: { docs: [post] } } });

    const ui = await Page({ id: 'post_4' });
    render(ui);

    expect(screen.getByText('No Author Post')).toBeInTheDocument();
    expect(
      screen.getByText(byNormalizedText('Updated 05 Jan 2024 by Anonymous'))
    ).toBeInTheDocument();
  });

  it('renders string tags mapped to names', async () => {
    const post = buildPost({
      title: 'String Tags',
      tags: ['GraphQL', 'Payload'] as unknown as (string | TagType)[],
    });

    mockQuery.mockResolvedValue({ data: { Posts: { docs: [post] } } });

    const ui = await Page({ id: 'post_5' });
    render(ui);

    expect(screen.getByText('GraphQL')).toBeInTheDocument();
    expect(screen.getByText('Payload')).toBeInTheDocument();
  });
});
