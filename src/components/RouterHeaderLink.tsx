import { Box } from '@primer/components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import './RouterHeaderLink.css';

type Props = {
  to: string,
  onClick?: () => void
};

const RouterLink: FC<Props> = ({ to, onClick, children }) => (
  <Box className="RouterHeaderLink-wrapper">
    <Link className="RouterHeaderLink" onClick={() => { if (onClick) { onClick(); } }} to={to}>
      {children}
    </Link>
  </Box>
);

RouterLink.defaultProps = {
  onClick: () => {}
};

export default RouterLink;
