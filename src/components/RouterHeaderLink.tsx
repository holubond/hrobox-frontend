import { Header } from '@primer/components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string,
  onClick?: () => void
};

const RouterLink: FC<Props> = ({ to, onClick, children }) => (
  <Link onClick={() => { if (onClick) { onClick(); } }} to={to} style={{ textDecoration: 'none' }}>
    <Header.Item>
      <Header.Link>
        {children}
      </Header.Link>
    </Header.Item>
  </Link>
);

RouterLink.defaultProps = {
  onClick: () => {}
};

export default RouterLink;
