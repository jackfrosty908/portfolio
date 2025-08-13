import type { SerializedParagraphNode } from '@payloadcms/richtext-lexical';
import { cleanup, render, screen } from '@testing-library/react';
import type { JSX, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ParagraphConverter from './ParagraphConverter';

type ConverterFn = (args: {
  node: SerializedParagraphNode;
  nodesToJSX: (args: {
    nodes: unknown[];
    parent: SerializedParagraphNode;
  }) => ReactNode;
}) => ReactNode;

vi.mock('../../../common/components/typography', () => ({
  Paragraph: ({ children }: { children: ReactNode }) => (
    <p data-testid="paragraph">{children}</p>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('ParagraphConverter', () => {
  it('calls nodesToJSX with node children and parent', () => {
    const node = {
      children: [{ type: 'text', text: 'Hello' }],
    } as unknown as SerializedParagraphNode;

    const nodesToJSX = vi
      .fn()
      .mockReturnValue(<span data-testid="child">Hello</span>);

    const element = (ParagraphConverter as unknown as ConverterFn)({
      node,
      nodesToJSX,
    }) as JSX.Element;
    render(element);

    expect(nodesToJSX).toHaveBeenCalledWith({
      nodes: node.children,
      parent: node,
    });
  });

  it('wraps rendered children in Paragraph', () => {
    const node = {
      children: [{ type: 'text', text: 'World' }],
    } as unknown as SerializedParagraphNode;

    const nodesToJSX = vi
      .fn()
      .mockReturnValue(<span data-testid="child">World</span>);

    const element = (ParagraphConverter as unknown as ConverterFn)({
      node,
      nodesToJSX,
    }) as JSX.Element;
    render(element);

    expect(screen.getByTestId('paragraph')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
