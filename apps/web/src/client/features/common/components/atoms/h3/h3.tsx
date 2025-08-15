import type { ReactElement, ReactNode } from 'react';

const H3 = ({ children }: { children: ReactNode }): ReactElement => (
  <h3 className="font-bold text-xl">{children}</h3>
);

export default H3;
