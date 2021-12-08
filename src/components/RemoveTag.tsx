import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Dialog, Box, StyledOcticon, ButtonDanger, Spinner, Button
} from '@primer/components';
import axios from 'axios';
import { TrashIcon } from '@primer/octicons-react';
import routeTo from '../utils/routeTo';
import { useTranslation } from '../hooks/useTranslation';
import useLoggedInUser from '../hooks/useLoggedInUser';
import handleErrors from '../utils/handleErrors';

type Props = {
    tagsId: number,
    reloadTags: () => void
}

const RemoveTag: FC<Props> = ({ tagsId, reloadTags }) => {
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
        reloadTags();
      });
  };

  useEffect(() => {
  }, [loading]);
  return (
    <>
      <ButtonDanger border-radius="0px" padding="0" width="25px" height="25px" onClick={() => setOpen(true)}>
        <StyledOcticon align-self="center" icon={TrashIcon} size={15} />
      </ButtonDanger>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">{trans('RemoveTag')}</Dialog.Header>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ alignSelf: 'center', padding: '20px 4px' }}>
            {trans('Do you really want to delete this tag ? Tag will be removed from all games!')}
          </Box>

          <Box p={4} sx={{ alignSelf: 'flex-end' }}>
            <Button marginRight={2} onClick={() => setOpen(false)}>
              {trans('Cancel')}
            </Button>

            {loading ? (<Spinner color="Black" />)
              : (
                <ButtonDanger onClick={() => submit(tagsId)}>
                  {trans('Delete')}
                </ButtonDanger>
              )}
          </Box>
        </Box>
      </Dialog>

    </>
  );
};
export default RemoveTag;
