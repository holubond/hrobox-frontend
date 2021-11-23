import React, { FC } from 'react';

import {
  Header, Box, ButtonInvisible, Link
} from '@primer/components';
import logo from '../assets/logo.png';

const Layout: FC = ({ children }) => (
  <>
    <Header>
      <Header.Item>
        <Link href="/">
          <img src={logo} height="30" alt="logo" />
        </Link>
      </Header.Item>
      <Box sx={{ flexGrow: 1 }} />
      <Header.Item>
        <Link href="/games">
          <ButtonInvisible>Logo</ButtonInvisible>
        </Link>
      </Header.Item>
      <Header.Item>
        <ButtonInvisible>Login</ButtonInvisible>
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
