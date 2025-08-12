'use client';

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import {
  type JSXConvertersFunction,
  RichText,
} from '@payloadcms/richtext-lexical/react';
import type { ReactElement } from 'react';
import type { Post as PostType } from '../../../../payload-types';
import { Paragraph } from '../common/components/typography';
import HeadingConverter from './molecules/heading-converter/HeadingConverter';
import ParagraphConverter from './molecules/paragraph-converter/ParagraphConverter';

type Props = { content: PostType['content'] | string | null | undefined };

const RichTextFeature = ({ content }: Props): ReactElement => {
  if (!content) {
    return <Paragraph>No content</Paragraph>;
  }
  if (typeof content === 'string') {
    return <Paragraph>{content}</Paragraph>;
  }

  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: HeadingConverter,
    paragraph: ParagraphConverter,
  });

  return (
    <RichText
      converters={converters}
      data={content as unknown as SerializedEditorState}
    />
  );
};

export default RichTextFeature;
