import type { ReactElement, ReactNode } from 'react';

const H1 = ({ children }: { children: ReactNode }): ReactElement => (
  <h1 className="font-bold text-3xl">{children}</h1>
);

export default H1;
