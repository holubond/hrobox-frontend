import React, { useEffect } from 'react';
import { Box, Button, Text } from '@primer/components';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import useLoggedInUser from '../hooks/useLoggedInUser';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import { useTranslation } from '../hooks/useTranslation';

const Role = () => {
  const [user, setUserIn] = useLoggedInUser();
  const history = useHistory();
  const trans = useTranslation();

  const submit = () => {
    axios.get(routeTo('/api/user/me/role'), { headers: { Authorization: `Bearer ${user.jwt}` } })
      .then((response) => {
        setUserIn({
          jwt: user.jwt,
          role: response.data.role
        });
        localStorage.setItem('role', response.data.role);
        if (response.data.role === 'Admin' || response.data.role === 'Verified') {
          history.push('/');
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  useEffect(() => {
    submit();
  }, []);

  return (
    <Box>
      {user.role === 'Banned' ? (
        <Text>
          {trans('We are sorry but your account was banned!')}
        </Text>
      ) : (
        <>
          <Box>
            <Text>
              {trans('We are waiting for admins to verif your account.')}
            </Text>
          </Box>
          <Button variant="large" onClick={submit}>{trans('Refresh')}</Button>
        </>
      )}
    </Box>
  );
};
export default Role;
