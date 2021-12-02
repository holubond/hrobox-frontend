/* eslint-disable react/jsx-no-undef */
import React, { FC, useEffect, useState } from 'react';

import {
  Dialog, Box, Button, Link, Spinner
} from '@primer/components';
import { Form, Field } from 'react-final-form';
import axios from 'axios';
import useLoggedInUser from '../hooks/useLoggedInUser';

const LoginDialog: FC = () => {
  const [, setUserIn] = useLoggedInUser();

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const user = {
    email: '',
    password: ''
  };
  useEffect(() => {
  }, [loading]);
  return (
    <>
      <Button ref={returnFocusRef} onClick={() => setOpen(true)}>
        Login
      </Button>
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">Přihlášení</Dialog.Header>
        <Box p={3}>
          <Form
            initialValues={{
              ...user
            }}
            onSubmit={(values) => {
              setLoading(true);
              // axios.post('http://the-internet.herokuapp.com/status_codes/500', {
              axios.post('https://hrobox-backend.herokuapp.com/api/auth/login', {
                email: values.email,
                password: values.password
              })
                .then((response) => {
                  setUserIn({
                    jwt: response.data.jwt,
                    role: response.data.role,
                    lang: response.data.lang
                  });
                })
                .catch((error) => {
                  // eslint-disable-next-line no-alert
                  alert(error);
                }).finally(() => {
                  setLoading(false);
                });
            }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Box color="black">
                  Email
                </Box>
                <Field
                  name="email"
                  component="input"
                  type="email"
                  placeholder="email"
                />
                <Box color="black">
                  Password
                </Box>
                <Field
                  name="password"
                  component="input"
                  type="password"
                  placeholder="password"
                />
                <Box display="flex" flexWrap="nowrap">
                  <Link href="/#">
                    Do you need to register?
                  </Link>
                  <Box sx={{ flexGrow: 0.2 }} />
                  {loading ? <Spinner color="Black" /> : <Button type="submit">Submit</Button> }
                </Box>
              </form>
            )}
          />
        </Box>
      </Dialog>

    </>
  );
};
export default LoginDialog;
