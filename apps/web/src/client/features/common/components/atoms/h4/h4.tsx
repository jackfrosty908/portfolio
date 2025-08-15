import type { ReactElement, ReactNode } from 'react';

const H4 = ({ children }: { children: ReactNode }): ReactElement => (
  <h4 className="font-bold text-lg">{children}</h4>
);

export default H4;
