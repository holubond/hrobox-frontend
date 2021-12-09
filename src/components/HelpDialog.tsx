import React, { FC, useEffect, useState } from 'react';

import {
  Dialog, Box, Header, FormGroup, TextInput
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import ValidatedFormGroup from './ValidatedFormGroup';
import useLoggedInUser from '../hooks/useLoggedInUser';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import { useTranslation } from '../hooks/useTranslation';
import SubmitButton from './SubmitButton';

const HelpDialog: FC = () => {
  const trans = useTranslation();

  const EMAIL_SCHEMA = Joi.string().email({ tlds: { allow: false } }).required().error(() => new Error(trans('ErrEmail')));
  const MESSAGE_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrMessage')));

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [userIn] = useLoggedInUser();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
  }, [loading]);

  const submit = (values: any) => {
    values.preventDefault();
    setLoading(true);

    const emailValidationError = EMAIL_SCHEMA.validate(email);
    const errors: string[] = [];

    if (emailValidationError.error && userIn.jwt === '') {
      setEmailError(emailValidationError.error.message);
      errors.push(emailValidationError.error.message);
    } else {
      setEmailError('');
    }

    const messageValidationError = MESSAGE_SCHEMA.validate(message);
    if (messageValidationError.error) {
      setMessageError(messageValidationError.error.message);
      errors.push(messageValidationError.error.message);
    } else {
      setMessageError('');
    }

    if (errors.length !== 0) {
      setLoading(false);
      return;
    }

    let data;
    let headers;
    if (userIn.jwt === '') {
      data = { email, message };
      headers = { Authorization: '' };
    } else {
      data = { message };
      headers = { Authorization: `Bearer ${userIn.jwt}` };
    }
    axios.post(routeTo('/api/support'), data, { headers })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setOpen(false);
        setLoading(false);
      });
  };

  return (
    <>
      <Header.Link ref={returnFocusRef} onClick={() => setOpen(true)}>
        {trans('Help')}
      </Header.Link>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">{trans('ContactSupport')}</Dialog.Header>

        <Box p={3}>
          <form onSubmit={submit} className="dialog-form">
            {userIn.jwt === '' ? (
              <ValidatedFormGroup message={emailError}>
                <FormGroup.Label>
                  Email
                </FormGroup.Label>
                <TextInput
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </ValidatedFormGroup>
            ) : ('')}
            <ValidatedFormGroup message={messageError}>
              <FormGroup.Label>
                {trans('Message')}
              </FormGroup.Label>
              <TextInput
                as="textarea"
                sx={{ display: 'block', boxSizing: 'border-box' }}
                name="message"
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
              />
            </ValidatedFormGroup>

            <SubmitButton loading={loading} />
          </form>

        </Box>
      </Dialog>

    </>
  );
};
export default HelpDialog;
