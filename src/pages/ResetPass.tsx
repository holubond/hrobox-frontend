import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormGroup, Spinner, TextInput
} from '@primer/components';
import { useHistory, useParams } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import ValidatedFormGroup from '../components/ValidatedFormGroup';

const ResetPass = () => {
  const trans = useTranslation();
  const { resetKey } = useParams<{ resetKey: string }>();
  const PASSWORD_SCHEMA = Joi.string().min(6).required().error(() => new Error(trans('ErrPassword')));

  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
  }, [loading]);

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
    history.push('/');
  };
  return (
    <Box p={3}>

      <form onSubmit={submit}>
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
  );
};
export default ResetPass;
