import React, { FC, useEffect, useState } from 'react';

import {
  Dialog, Box, Button, Spinner, FormGroup, TextInput, Link
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import ValidatedFormGroup from './ValidatedFormGroup';
import routeTo from '../utils/routeTo';
import { useTranslation } from '../hooks/useTranslation';
import handleErrors from '../utils/handleErrors';

const PasswordRenewal: FC = () => {
  const trans = useTranslation();

  const EMAIL_SCHEMA = Joi.string().email({ tlds: { allow: false } }).required().error(() => new Error(trans('ErrEmail')));

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

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
      })
      .catch((error) => {
        switch (error.response.status) {
          case 500:
            handleErrors(error);
            break;
          case 404:
            handleErrors(error);
            break;
          case 400:
            alert('Client-side error (400, bad request)');
            break;
          default:
        }
      }).finally(() => {
        setLoading(false);
        setOpen(false);
      });
  };

  return (
    <>
      <Link as="button" onClick={() => setOpen(true)} href="/">
        {trans('ForgPassword')}
      </Link>
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">{trans('Pswdreneval')}</Dialog.Header>

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

            {loading ? <Spinner color="Black" /> : <Button type="submit">{trans('Submit')}</Button> }
          </form>

        </Box>
      </Dialog>

    </>
  );
};
export default PasswordRenewal;
