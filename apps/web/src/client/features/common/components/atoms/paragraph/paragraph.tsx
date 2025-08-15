import type { ReactElement, ReactNode } from 'react';

const Paragraph = ({ children }: { children: ReactNode }): ReactElement => (
  <p className="leading-7">{children}</p>
);

export default Paragraph;
