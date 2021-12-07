import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Dialog, Box, FormGroup, TextInput, Link
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import ValidatedFormGroup from './ValidatedFormGroup';
import routeTo from '../utils/routeTo';
import { useTranslation } from '../hooks/useTranslation';
import SubmitButton from './SubmitButton';
import useLoggedInUser from '../hooks/useLoggedInUser';
import handleErrors from '../utils/handleErrors';

const TagDialog: FC = () => {
  const trans = useTranslation();
  const [user] = useLoggedInUser();
  const navigate = useHistory();
  const NAME_CS_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrPassword')));
  const NAME_EN_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrPassword')));

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const [nameCs, setNameCs] = useState('');
  const [nameCsError, setNameCsError] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameEnError, setNameEnError] = useState('');

  const submit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    const nameCsValidationError = NAME_CS_SCHEMA.validate(nameCs);

    const errors: string[] = [];

    if (nameCsValidationError.error) {
      setNameCsError(nameCsValidationError.error.message);
      errors.push(nameCsValidationError.error.message);
    } else {
      setNameCsError('');
    }

    const nameEnValidationError = NAME_EN_SCHEMA.validate(nameEn);

    if (nameEnValidationError.error) {
      setNameEnError(nameEnValidationError.error.message);
      errors.push(nameEnValidationError.error.message);
    } else {
      setNameEnError('');
    }

    if (errors.length !== 0) {
      setLoading(false);
      return;
    }

    axios.post(routeTo('/api/tag'), {
      nameCs,
      nameEn
    }, { headers: { Authorization: `Bearer ${user.jwt}` } })
      .then(() => {
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 403:
            navigate.push('/role');
            break;
          case 409:
            if (error.response.data.message === 'nameEn') {
              alert(trans('TagExistsEn'));
            } else {
              alert(trans('TagExistsCs'));
            }
            break;
          case 400:
            handleErrors(error);
            break;
          case 500:
            handleErrors(error);
            break;
          default:
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
  }, [loading]);
  return (
    <>
      <Link as="button" onClick={() => setOpen(true)} href="/">
        {trans('AddTag')}
      </Link>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">{trans('AddTag')}</Dialog.Header>

        <Box p={4}>

          <form onSubmit={submit} className="dialog-form">
            <ValidatedFormGroup message={nameCsError}>
              <FormGroup.Label>
                {trans('NameCs')}
              </FormGroup.Label>
              <TextInput
                name="nameCs"
                value={nameCs}
                onChange={(e: any) => setNameCs(e.target.value)}
              />
            </ValidatedFormGroup>

            <ValidatedFormGroup message={nameEnError}>
              <FormGroup.Label>
                {trans('NameEn')}
              </FormGroup.Label>
              <TextInput
                name="nameEn"
                value={nameEn}
                onChange={(e: any) => setNameEn(e.target.value)}
              />
            </ValidatedFormGroup>

            <SubmitButton loading={loading} />
          </form>

        </Box>
      </Dialog>

    </>
  );
};
export default TagDialog;
