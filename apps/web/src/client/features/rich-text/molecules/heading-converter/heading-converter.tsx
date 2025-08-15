import type { SerializedHeadingNode } from '@payloadcms/richtext-lexical';
import type { JSXConverter } from '@payloadcms/richtext-lexical/react';
import type { ReactElement } from 'react';
import { H1, H2, H3, H4, H5, H6 } from '../../../common/components/typography';

const HeadingConverter: JSXConverter<SerializedHeadingNode> = ({
  node,
  nodesToJSX,
}): ReactElement => {
  const children = nodesToJSX({
    nodes: node.children,
    parent: node,
  });

  switch (node.tag) {
    case 'h1':
      return <H1>{children}</H1>;
    case 'h2':
      return <H2>{children}</H2>;
    case 'h3':
      return <H3>{children}</H3>;
    case 'h4':
      return <H4>{children}</H4>;
    case 'h5':
      return <H5>{children}</H5>;
    case 'h6':
      return <H6>{children}</H6>;
    default:
      return <>{children}</>;
  }
};

export default HeadingConverter;
