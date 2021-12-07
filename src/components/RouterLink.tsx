import { Link as PrimerLink } from '@primer/components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string,
  onClick?: () => void
};

const RouterLink: FC<Props> = ({ to, onClick, children }) => (
  <Link onClick={() => { if (onClick) { onClick(); } }} to={to} style={{ textDecoration: 'none' }}>
    <PrimerLink>
      {children}
    </PrimerLink>
  </Link>
);

RouterLink.defaultProps = {
  onClick: () => {}
};

export default RouterLink;
