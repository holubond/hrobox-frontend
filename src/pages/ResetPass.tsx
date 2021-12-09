import React, { useState } from 'react';
import {
  Box, FormGroup, Heading, Pagehead
} from '@primer/components';
import { useHistory, useParams } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import ValidatedFormGroup from '../components/ValidatedFormGroup';
import PasswordInput from '../components/PasswordInput';
import SubmitButton from '../components/SubmitButton';

const ResetPass = () => {
  const trans = useTranslation();
  const { resetKey } = useParams<{ resetKey: string }>();
  const PASSWORD_SCHEMA = Joi.string().min(6).required().error(() => new Error(trans('ErrPassword')));

  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const submit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const errors: string[] = [];

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

    axios.post(routeTo('/api/auth/newPassword'), {
      resetKey,
      newPassword: password
    })
      .then((response) => {
        alert(response.data.message);
        history.push('/');
      })
      .catch((error) => {
        switch (error.response.status) {
          case 404:
            alert(error.response.data.message);
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
      <Pagehead><Heading>{trans('SetANewPassword')}</Heading></Pagehead>
      <form onSubmit={submit} className="dialog-form">
        <ValidatedFormGroup message={passwordError}>
          <FormGroup.Label>
            {trans('NewPassword')}
          </FormGroup.Label>
          <PasswordInput
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </ValidatedFormGroup>

        <SubmitButton loading={loading} />
      </form>
    </Box>
  );
};
export default ResetPass;
