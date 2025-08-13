import type { ReactElement, ReactNode } from 'react';

const H2 = ({ children }: { children: ReactNode }): ReactElement => (
  <h2 className="font-bold text-2xl">{children}</h2>
);

export default H2;
