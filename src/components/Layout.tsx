import React, { FC } from 'react';

import {
  Header, Box
} from '@primer/components';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import LoginDialog from './LoginDialog';
import useLoggedInUser from '../hooks/useLoggedInUser';

const Layout: FC = ({ children }) => {
  const [user, setUser] = useLoggedInUser();
  return (
    <>
      <Header padding="4px">
        <Header.Item>
          <Link to="/">
            <img src={Logo} height="54" alt="logo" />
          </Link>
        </Header.Item>

        <Box sx={{ flexGrow: 1 }} />

        <Header.Item>
          <Link className="Header__HeaderLink-sc-217i47-2 iOqtMu" to="/games">
            List of Games
          </Link>
        </Header.Item>

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
