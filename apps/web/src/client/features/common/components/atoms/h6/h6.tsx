import type { ReactElement, ReactNode } from 'react';

const H6 = ({ children }: { children: ReactNode }): ReactElement => (
  <h6 className="font-bold text-sm">{children}</h6>
);

export default H6;
