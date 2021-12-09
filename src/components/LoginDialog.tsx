import React, { FC, useState } from 'react';

import {
  Dialog, Box, Header, FormGroup, TextInput
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import useLoggedInUser from '../hooks/useLoggedInUser';
import ValidatedFormGroup from './ValidatedFormGroup';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import { useLanguage, useTranslation } from '../hooks/useTranslation';
import { Languages } from './LanguageSwitch';
import SubmitButton from './SubmitButton';
import RouterLink from './RouterLink';
import PasswordInput from './PasswordInput';

const LoginDialog: FC = () => {
  const trans = useTranslation();
  const EMAIL_SCHEMA = Joi.string().email({ tlds: { allow: false } }).required().error(() => new Error(trans('ErrEmail')));
  const PASSWORD_SCHEMA = Joi.string().min(6).required().error(() => new Error(trans('ErrPassword')));

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const [, setUserIn] = useLoggedInUser();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [, setLanguage] = useLanguage();

  const setStateToDefault = () => {
    setEmail('');
    setEmailError('');
    setPassword('');
    setPasswordError('');
    setLoading(false);
    setOpen(false);
  };

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
        switch (error.response.status) {
          case 403:
            alert(trans('WrongPassword'));
            break;
          case 404:
            alert(trans('User with given email does not exist'));
            break;
          default:
            handleErrors(error);
        }
      }).finally(() => {
        setStateToDefault();
        history.push('/');
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
        onDismiss={() => setStateToDefault()}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">{trans('Log')}</Dialog.Header>

        <Box p={3}>

          <form onSubmit={submit} className="dialog-form">
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
              <PasswordInput value={password} onChange={(e: any) => setPassword(e.target.value)} />
              <RouterLink to="/forgot" onClick={() => { setOpen(false); }}>
                {trans('ForgPassword')}
              </RouterLink>
            </ValidatedFormGroup>

            <RouterLink to="/registration" onClick={() => { setOpen(false); }}>
              {trans('Registration')}
            </RouterLink>
            <SubmitButton loading={loading}>
              {trans('Login')}
            </SubmitButton>
          </form>

        </Box>
      </Dialog>

    </>
  );
};
export default LoginDialog;
