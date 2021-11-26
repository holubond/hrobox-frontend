import React, { FC } from 'react';

import {
  Header, Box, Link
} from '@primer/components';
import Logo from '../assets/logo.png';

const Layout: FC = ({ children }) => (
  <>
    <Header padding="4px">
      <Header.Item>
        <Link href="/" lineHeight="0">
          <img src={Logo} height="54" alt="logo" />
        </Link>
      </Header.Item>
      <Box sx={{ flexGrow: 1 }} />
      <Header.Item>
        <Link href="/games">
          List of Games
        </Link>
      </Header.Item>
      <Header.Item>
        Login
      </Header.Item>
    </Header>
    <Box
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        pt: 8,
        gap: 2
      }}
    >
      {children}
    </Box>

  </>
);
export default Layout;
