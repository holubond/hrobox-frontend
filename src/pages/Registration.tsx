import React, { useEffect, useState } from 'react';
import { Box, FormGroup, TextInput } from '@primer/components';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import useLoggedInUser from '../hooks/useLoggedInUser';
import routeTo from '../utils/routeTo';
import ValidatedFormGroup from '../components/ValidatedFormGroup';
import SubmitButton from '../components/SubmitButton';

const Registration = () => {
  const trans = useTranslation();
  const navigate = useHistory();

  const NAME_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrPassword')));
  const EMAIL_SCHEMA = Joi.string().email({ tlds: { allow: false } }).required().error(() => new Error(trans('ErrEmail')));
  const PASSWORD_SCHEMA = Joi.string().min(6).required().error(() => new Error(trans('ErrPassword')));

  const [loading, setLoading] = useState(false);
  const [, setUserIn] = useLoggedInUser();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

    const nameValidationError = NAME_SCHEMA.validate(name);
    if (nameValidationError.error) {
      setPasswordError(nameValidationError.error.message);
      errors.push(nameValidationError.error.message);
    } else {
      setNameError('');
    }

    if (errors.length !== 0) {
      setLoading(false);
      return;
    }

    axios.post(routeTo('/api/auth/register'), {
      name,
      email,
      password,
      lang: 'cs'
    })
      .then((response) => {
        setUserIn({
          jwt: response.data.jwt,
          role: response.data.role
        });
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('role', response.data.role);
        navigate.push('/role');
      })
      .catch((error) => {
        alert(error.message);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
  }, [loading]);
  return (
    <Box p={4}>
      <form onSubmit={submit} className="dialog-form">
        <ValidatedFormGroup message={nameError}>
          <FormGroup.Label>
            {trans('Name')}
          </FormGroup.Label>
          <TextInput
            name="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </ValidatedFormGroup>

        <ValidatedFormGroup message={emailError}>
          <FormGroup.Label>
            Email
          </FormGroup.Label>
          <TextInput
            name="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </ValidatedFormGroup>

        <ValidatedFormGroup message={passwordError}>
          <FormGroup.Label>
            {trans('Password')}
          </FormGroup.Label>
          <TextInput
            name="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </ValidatedFormGroup>

        <SubmitButton loading={loading} />
      </form>
    </Box>
  );
};
export default Registration;
