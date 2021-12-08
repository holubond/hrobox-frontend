import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Dialog, Box, ButtonPrimary, StyledOcticon, ButtonDanger, Spinner, Text
} from '@primer/components';
import axios from 'axios';
import { TrashIcon } from '@primer/octicons-react';
import routeTo from '../utils/routeTo';
import { useTranslation } from '../hooks/useTranslation';
import useLoggedInUser from '../hooks/useLoggedInUser';
import handleErrors from '../utils/handleErrors';

type Props = {
    tagsId: number
  }

const RemoveTag: FC<Props> = ({ tagsId }) => {
  const trans = useTranslation();
  const [user] = useLoggedInUser();
  const navigate = useHistory();

  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: any) => {
    setLoading(true);

    axios.delete(routeTo(`/api/tag/${e}`), { headers: { Authorization: `Bearer ${user.jwt}` } })
      .then(() => {
      })
      .catch((error) => {
        switch (error.response.status) {
          case 403:
            navigate.push('/role');
            break;
          case 404:
            alert(error.response.data.message);
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
        setOpen(false);
        window.location.reload();
      });
  };

  useEffect(() => {
  }, [loading]);
  return (
    <>
      <ButtonDanger onClick={() => setOpen(true)}>
        <StyledOcticon icon={TrashIcon} size={15} />
      </ButtonDanger>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
        width="38%"
        height="20%"
      >
        <Dialog.Header id="header-id">{trans('RemoveTag')}</Dialog.Header>

        <Text sx={{ fontSize: '15px', paddingX: '4%', fontWeight: 'bold' }}>
          {trans('Do you really want to delete this tag ? Tag will be removed from all games!')}
        </Text>

        <Box p={4} sx={{ display: '-webkit-inline-flex' }}>

          <ButtonPrimary sx={{ marginX: '90%' }} onClick={() => setOpen(false)}>
            {trans('Cancel')}
          </ButtonPrimary>

          {loading ? (<Spinner color="Black" />)
            : (
              <ButtonDanger onClick={() => submit(tagsId)}>
                {trans('Delete')}
              </ButtonDanger>
            )}

        </Box>
      </Dialog>

    </>
  );
};
export default RemoveTag;
