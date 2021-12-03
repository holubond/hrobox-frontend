import React, { FC } from 'react';

import {
  Header, Box, Button
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
          <Link to="/games">
            List of Games
          </Link>
        </Header.Item>

        <Header.Item>
          {
            user.jwt === ''
              ? <LoginDialog />
              : <Button onClick={() => { setUser({ jwt: '', role: undefined }); }}>Logout</Button>
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
