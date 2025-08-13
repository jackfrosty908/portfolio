import type { ReactElement, ReactNode } from 'react';

const H5 = ({ children }: { children: ReactNode }): ReactElement => (
  <h5 className="font-bold text-base">{children}</h5>
);

export default H5;
