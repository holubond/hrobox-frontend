import React, { useEffect } from 'react';
import { Text } from '@primer/components';
import axios from 'axios';
import useLoggedInUser from '../hooks/useLoggedInUser';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';

const Role = () => {
  const [user, setUserIn] = useLoggedInUser();

  const submit = () => {
    axios.post(routeTo('/api/user/me/role'), {}, { headers: { Authorization: user.jwt } })
      .then((response) => {
        setUserIn({
          jwt: user.jwt,
          role: response.data.role
        });
        console.log(response.data.role);
        localStorage.setItem('role', response.data.role);
        // TODO: set langContext to response.data.lang
      })
      .catch((error) => {
        handleErrors(error);
      });
  };
  useEffect(() => {
    submit();
  }, []);
  return (
    <Text>
      {user.jwt}
    </Text>
  );
};
export default Role;
