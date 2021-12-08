import { Header } from '@primer/components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string
};

const RouterLink: FC<Props> = ({ to, children }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <Header.Item>
      <Header.Link>
        {children}
      </Header.Link>
    </Header.Item>
  </Link>
);

export default RouterLink;
