import React, { FC, useEffect, useState } from 'react';

import {
  Dialog, Box, Button, Link, Spinner, Header, FormGroup
} from '@primer/components';
import { Form, Field } from 'react-final-form';
import axios from 'axios';
import useLoggedInUser from '../hooks/useLoggedInUser';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';

const LoginDialog: FC = () => {
  const [, setUserIn] = useLoggedInUser();

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const submit = (values: any) => {
    setLoading(true);
    axios.post(routeTo('/api/auth/login'), {
      email: values.email,
      password: values.password
    })
      .then((response) => {
        setUserIn({
          jwt: response.data.jwt,
          role: response.data.role
        });
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('role', response.data.role);
        // TODO: set langContext to response.data.lang
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setLoading(false);
      });
  };
  const user = {
    email: '',
    password: ''
  };
  useEffect(() => {
  }, [loading]);
  return (
    <>
      <Header.Link ref={returnFocusRef} onClick={() => setOpen(true)}>
        Login
      </Header.Link>
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
              submit(values);
            }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormGroup.Label color="Black">
                    Email
                  </FormGroup.Label>
                  <Field
                    name="email"
                    component="input"
                    type="email"
                    placeholder="email"
                  />
                </FormGroup>
                <FormGroup>
                  <FormGroup.Label color="Black">
                    Password
                  </FormGroup.Label>
                  <Field
                    name="password"
                    component="input"
                    type="password"
                    placeholder="password"
                  />
                </FormGroup>

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
