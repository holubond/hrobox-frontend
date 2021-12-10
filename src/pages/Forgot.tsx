import React, { useEffect, useState } from 'react';
import {
  Box, FormGroup, Heading, Pagehead, TextInput
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import routeTo from '../utils/routeTo';
import ValidatedFormGroup from '../components/ValidatedFormGroup';
import SubmitButton from '../components/SubmitButton';
import handleErrors from '../utils/handleErrors';
import RouterLink from '../components/RouterLink';

const Forgot = () => {
  const trans = useTranslation();
  const EMAIL_SCHEMA = Joi.string().email({ tlds: { allow: false } }).required().error(() => new Error(trans('ErrEmail')));

  const [loading, setLoading] = useState(false);
  const navigate = useHistory();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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

    if (errors.length !== 0) {
      setLoading(false);
      return;
    }

    axios.post(routeTo('/api/auth/forgotPassword'), {
      email
    })
      .then((response) => {
        alert(response.data.message);
        navigate.push('/');
      })
      .catch((error) => {
        switch (error.response.status) {
          case 404:
            alert(trans('User with given email does not exist'));
            break;
          default:
            handleErrors(error);
        }
      }).finally(() => {
        setLoading(false);
      });
  };
  return (
    <Box p={3} maxWidth="440px" width="95%">
      <Pagehead><Heading>{trans('Pswdreneval')}</Heading></Pagehead>
      <form onSubmit={submit} className="dialog-form">
        <ValidatedFormGroup message={emailError}>
          <FormGroup.Label>
            {trans('EmailForRenewal')}
          </FormGroup.Label>
          <TextInput
            name="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <RouterLink to="/registration">
            {trans('DoYouNeedToRegister')}
          </RouterLink>
        </ValidatedFormGroup>
        <SubmitButton loading={loading} />
      </form>
    </Box>
  );
};
export default Forgot;
