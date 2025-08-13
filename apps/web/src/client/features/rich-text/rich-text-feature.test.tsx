import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HeadingConverter from './molecules/heading-converter/heading-converter';
import ParagraphConverter from './molecules/paragraph-converter/paragraph-converter';
import RichTextFeature from './rich-text-feature';

type LexicalProps = {
  converters: (args: {
    defaultConverters: Record<string, unknown>;
  }) => Record<string, unknown>;
  data: unknown;
};

const { capture } = vi.hoisted(() => ({
  capture: { props: null as LexicalProps | null },
}));

vi.mock('@payloadcms/richtext-lexical/react', () => ({
  RichText: (props: LexicalProps) => {
    capture.props = props;
    return <div data-testid="lexical-rich-text">Lexical</div>;
  },
}));

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  capture.props = null;
});

describe('RichTextFeature', () => {
  it('renders fallback when content is null/undefined', () => {
    render(<RichTextFeature content={null} />);
    expect(screen.getByText('No content')).toBeInTheDocument();

    render(<RichTextFeature content={undefined} />);
    expect(screen.getAllByText('No content').length).toBeGreaterThan(0);
  });

  it('renders plain string content inside paragraph', () => {
    render(<RichTextFeature content="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders rich content via Lexical RichText with converters wired', () => {
    const data = {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    };

    render(<RichTextFeature content={data as unknown as string} />);
    expect(screen.getByTestId('lexical-rich-text')).toBeInTheDocument();

    expect(capture.props?.data).toBe(data);

    expect(capture.props).not.toBeNull();
    // biome-ignore lint/style/noNonNullAssertion: mocking for tests
    const convertersFn = capture.props!.converters;
    const merged = convertersFn({ defaultConverters: { custom: 'present' } });

    expect(merged.heading).toBe(HeadingConverter);
    expect(merged.paragraph).toBe(ParagraphConverter);
    expect(merged.custom).toBe('present');
  });
});
