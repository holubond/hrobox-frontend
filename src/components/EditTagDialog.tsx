import React, { FC, useEffect, useState } from 'react';

import {
  Dialog, Box, FormGroup, TextInput, StyledOcticon, ButtonOutline, ButtonPrimary, Button
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import { PencilIcon } from '@primer/octicons-react';
import ValidatedFormGroup from './ValidatedFormGroup';
import routeTo from '../utils/routeTo';
import { useTranslation } from '../hooks/useTranslation';
import SubmitButton from './SubmitButton';
import useLoggedInUser from '../hooks/useLoggedInUser';
import handleErrors from '../utils/handleErrors';

type Props = {
    tagsId: number,
    tagsCsName: String,
    tagsEnName: String,
    reloadTags: () => void
  }

const EditTag: FC<Props> = ({
  tagsId, tagsCsName, tagsEnName, reloadTags
}) => {
  const trans = useTranslation();
  const [user] = useLoggedInUser();
  const NAME_CS_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrEmptyNameCs')));
  const NAME_EN_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrEmptyNameEn')));

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const [nameCs, setNameCs] = useState(tagsCsName);
  const [nameCsError, setNameCsError] = useState('');
  const [nameEn, setNameEn] = useState(tagsEnName);
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

    axios.put(routeTo(`/api/tag/${tagsId}`), {
      nameEn,
      nameCs
    }, { headers: { Authorization: `Bearer ${user.jwt}` } })
      .then(() => {
        setOpen(false);
        reloadTags();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 404:
            alert(error.response.data.message);
            break;
          case 409:
            if (error.response.data.message === 'nameEn') {
              alert(trans('TagExistsEn'));
            } else {
              alert(trans('TagExistsCs'));
            }
            break;
          default:
            handleErrors(error);
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
  }, [loading]);
  return (
    <>
      <ButtonOutline border-radius="0px" padding="0" width="25px" height="25px" onClick={() => setOpen(true)}>
        <StyledOcticon align-self="center" icon={PencilIcon} size={15} />
      </ButtonOutline>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">{trans('EditTag')}</Dialog.Header>

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

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignSelf: 'flex-end', flexDirection: 'row' }}>
                <Button marginRight={2} onClick={() => setOpen(false)}>
                  {trans('Cancel')}
                </Button>
                <SubmitButton loading={loading} />
              </Box>

            </Box>

            {/* <Box sx={{ display: 'flex' }}>
        <ButtonPrimary sx={{ marginX: '21%', alignSelf: 'end' }} onClick={() => setOpen(false)}>
                {trans('Cancel')}
              </ButtonPrimary>
              <SubmitButton loading={loading} />
            </Box> */}
          </form>

        </Box>
      </Dialog>

    </>
  );
};
export default EditTag;
