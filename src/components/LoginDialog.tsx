import React, { FC, useEffect, useState } from 'react';

import {
  Dialog, Box, Button, Spinner, Header, FormGroup, TextInput
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import ValidatedFormGroup from './ValidatedFormGroup';
import routeTo from '../utils/routeTo';
import useLoggedInUser from '../hooks/useLoggedInUser';
import handleErrors from '../utils/handleErrors';
import { useLanguage, useTranslation } from '../hooks/useTranslation';
import { Languages } from './LanguageSwitch';

const LoginDialog: FC = () => {
  const trans = useTranslation();
  const EMAIL_SCHEMA = Joi.string().email({ tlds: { allow: false } }).required().error(() => new Error(trans('ErrEmail')));
  const PASSWORD_SCHEMA = Joi.string().min(6).required().error(() => new Error(trans('ErrPassword')));

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const [, setUserIn] = useLoggedInUser();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [, setLanguage] = useLanguage();
  useEffect(() => {
  }, [loading]);

  const submit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    const emailValidationError = EMAIL_SCHEMA.validate(email);

    const errors: string[] = [];

    if (emailValidationError.error) {
      setEmailError(emailValidationError.error.message);
      errors.push(emailValidationError.error.message);
    } else {
      setEmailError('');
    }

    const passwordValidationError = PASSWORD_SCHEMA.validate(password);
    if (passwordValidationError.error) {
      setPasswordError(passwordValidationError.error.message);
      errors.push(passwordValidationError.error.message);
    } else {
      setPasswordError('');
    }

    if (errors.length !== 0) {
      setLoading(false);
      return;
    }

    axios.post(routeTo('/api/auth/login'), {
      email,
      password
    })
      .then((response) => {
        setUserIn({
          jwt: response.data.jwt,
          role: response.data.role
        });
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('role', response.data.role);
        setLanguage(response.data.lang as Languages);
        localStorage.setItem('lang', response.data.lang as Languages);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Header.Link ref={returnFocusRef} onClick={() => setOpen(true)}>
        {trans('Login')}
      </Header.Link>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">{trans('Log')}</Dialog.Header>

        <Box p={3}>

          <form onSubmit={submit}>
            <ValidatedFormGroup message={emailError}>
              <FormGroup.Label>
                Email
              </FormGroup.Label>
              <TextInput
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </ValidatedFormGroup>

            <ValidatedFormGroup message={passwordError}>
              <FormGroup.Label>
                {trans('Password')}
              </FormGroup.Label>
              <TextInput
                name="myPassword"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
            </ValidatedFormGroup>

            {loading ? <Spinner color="Black" /> : <Button type="submit">{trans('Submit')}</Button> }
          </form>

        </Box>
      </Dialog>

    </>
  );
};
export default LoginDialog;
