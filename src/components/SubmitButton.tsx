import { Box, ButtonPrimary, Spinner } from '@primer/components';
import React, { FC } from 'react';
import { useTranslation } from '../hooks/useTranslation';

type Props = { loading: boolean };

const SubmitButton: FC<Props> = ({ loading }) => {
  const trans = useTranslation();

  return (
    <Box sx={{ alignSelf: 'flex-end' }}>
      {loading ? <Spinner color="Black" /> : <ButtonPrimary type="submit">{trans('Submit')}</ButtonPrimary> }
    </Box>
  );
};

export default SubmitButton;
