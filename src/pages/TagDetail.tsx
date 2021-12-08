import React from 'react';
import { Box } from '@primer/components';
import { useParams } from 'react-router-dom';

const TagDetail = () => {
  const { id } = useParams<{ id: string}>();
  return (
    <Box>
      ID:
      {' '}
      {id}
    </Box>
  );
};
export default TagDetail;
