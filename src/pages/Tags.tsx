import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@primer/components';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import TagsTable from '../components/TagsTable';
import TagDialog from '../components/TagDialog';

export type Tag ={
  id: number,
  nameEn: string,
  nameCs: string
};

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const getTags = () => {
    axios.get(routeTo('/api/tags'))
      .then((response) => {
        setTags(response.data.tags as Tag[]);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {

      });
  };
  useEffect(() => {
    getTags();
  }, []);
  return (
    <Box
      sx={{
        width: '60%', display: 'flex', flexDirection: 'column'
      }}
    >
      <span>
        Some nice heading (total
        &nbsp;
        {tags.length}
        )
      </span>
      <Box sx={{ alignSelf: 'flex-end', padding: '5px 0px' }}>
        <TagDialog />
      </Box>
      <Box>
        <TagsTable tagsData={tags} />
      </Box>
    </Box>
  );
};
export default Tags;
