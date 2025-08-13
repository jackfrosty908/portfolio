import type { SerializedHeadingNode } from '@payloadcms/richtext-lexical';
import { cleanup, render, screen } from '@testing-library/react';
import type { JSX, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HeadingConverter from './HeadingConverter';

type ConverterFn = (args: {
  node: SerializedHeadingNode;
  nodesToJSX: (args: {
    nodes: unknown[];
    parent: SerializedHeadingNode;
  }) => ReactNode;
}) => ReactNode;

vi.mock('../../../common/components/typography', () => ({
  H1: ({ children }: { children: ReactNode }) => (
    <h1 data-testid="h1">{children}</h1>
  ),
  H2: ({ children }: { children: ReactNode }) => (
    <h2 data-testid="h2">{children}</h2>
  ),
  H3: ({ children }: { children: ReactNode }) => (
    <h3 data-testid="h3">{children}</h3>
  ),
  H4: ({ children }: { children: ReactNode }) => (
    <h4 data-testid="h4">{children}</h4>
  ),
  H5: ({ children }: { children: ReactNode }) => (
    <h5 data-testid="h5">{children}</h5>
  ),
  H6: ({ children }: { children: ReactNode }) => (
    <h6 data-testid="h6">{children}</h6>
  ),
}));

afterEach(() => {
  cleanup();
});

const makeNode = (tag: SerializedHeadingNode['tag']): SerializedHeadingNode =>
  ({
    tag,
    children: [{ type: 'text', text: 'Hello' }],
  }) as unknown as SerializedHeadingNode;

describe('HeadingConverter', () => {
  it('calls nodesToJSX with node children and parent', () => {
    const node = makeNode('h3');
    const nodesToJSX = vi.fn().mockReturnValue(<span>Child</span>);

    const element = (HeadingConverter as unknown as ConverterFn)({
      node,
      nodesToJSX,
    }) as JSX.Element;
    render(element);

    expect(nodesToJSX).toHaveBeenCalledWith({
      nodes: node.children,
      parent: node,
    });
  });

  it.each([
    ['h1', 'h1'],
    ['h2', 'h2'],
    ['h3', 'h3'],
    ['h4', 'h4'],
    ['h5', 'h5'],
    ['h6', 'h6'],
  ] as const)('renders %s via the matching component', (tag, testId) => {
    const node = makeNode(tag);
    const nodesToJSX = vi.fn().mockReturnValue(<span>Child</span>);

    const element = (HeadingConverter as unknown as ConverterFn)({
      node,
      nodesToJSX,
    }) as JSX.Element;
    render(element);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('renders children in a fragment for unknown tags', () => {
    const node = makeNode('h1');
    (node as unknown as { tag: string }).tag = 'h7';
    const nodesToJSX = vi.fn().mockReturnValue(<span>Unknown</span>);

    const element = (HeadingConverter as unknown as ConverterFn)({
      node,
      nodesToJSX,
    }) as JSX.Element;
    render(element);

    expect(screen.queryByTestId('h1')).toBeNull();
    expect(screen.queryByTestId('h2')).toBeNull();
    expect(screen.queryByTestId('h3')).toBeNull();
    expect(screen.queryByTestId('h4')).toBeNull();
    expect(screen.queryByTestId('h5')).toBeNull();
    expect(screen.queryByTestId('h6')).toBeNull();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
