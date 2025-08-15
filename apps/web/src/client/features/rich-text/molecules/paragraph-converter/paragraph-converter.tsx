import type { SerializedParagraphNode } from '@payloadcms/richtext-lexical';
import type { JSXConverter } from '@payloadcms/richtext-lexical/react';
import type { ReactElement } from 'react';
import { Paragraph } from '../../../common/components/typography';

const ParagraphConverter: JSXConverter<SerializedParagraphNode> = ({
  node,
  nodesToJSX,
}): ReactElement => {
  const children = nodesToJSX({
    nodes: node.children,
    parent: node,
  });

  return <Paragraph>{children}</Paragraph>;
};

export default ParagraphConverter;
