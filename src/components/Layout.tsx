import React, { FC } from 'react';

import {
  Header, Box, Dropdown
} from '@primer/components';
import Logo from '../assets/logo.png';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitch from './LanguageSwitch';

const Layout: FC = ({ children }) => {
  const trans = useTranslation();
  return (
    <>
      <Header padding="4px">
        <Header.Item>
          <Header.Link href="/" lineHeight="0">
            <img src={Logo} height="54" alt="logo" />
          </Header.Link>
        </Header.Item>
        <Box sx={{ flexGrow: 1 }} />
        <Header.Item>
          <Header.Link href="/games">
            {trans('Games')}
          </Header.Link>
        </Header.Item>
        <Header.Item>
          {trans('Login')}
        </Header.Item>
        <Header.Item>
          <Dropdown>
            <LanguageSwitch />
          </Dropdown>
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
};
export default Layout;
