import React, { FC } from 'react';

import {
  Header, Box
} from '@primer/components';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitch from './LanguageSwitch';
import LoginDialog from './LoginDialog';
import useLoggedInUser from '../hooks/useLoggedInUser';
import HelpDialog from './HelpDialog';
import RouterHeaderLink from './RouterHeaderLink';

const Layout: FC = ({ children }) => {
  const trans = useTranslation();
  const [user, setUser] = useLoggedInUser();

  return (
    <>
      <Header padding="4px">
        <Header.Item>
          <Link to="/">
            <img src={Logo} height="54" alt="logo" />
          </Link>
        </Header.Item>

        <Header.Item>
          <HelpDialog />
        </Header.Item>
        <Box sx={{ flexGrow: 1 }} />

        <RouterHeaderLink to="/games">
          {trans('Games')}
        </RouterHeaderLink>

        {user.role === 'Admin' ? (
          <RouterHeaderLink to="/tags">
            Tags
          </RouterHeaderLink>
        ) : ('')}

        <Header.Item>
          {
            user.jwt === ''
              ? <LoginDialog />
              : (
                <Header.Link onClick={() => {
                  setUser({ jwt: '', role: undefined });
                  localStorage.removeItem('jwt');
                  localStorage.removeItem('role');
                }}
                >
                  Logout
                </Header.Link>
              )
          }
        </Header.Item>

        <Header.Item>
          <LanguageSwitch />
        </Header.Item>

      </Header>
      <Box
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
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
