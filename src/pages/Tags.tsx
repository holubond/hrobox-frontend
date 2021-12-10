import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Spinner } from '@primer/components';
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
  const [loading, setLoading] = useState(false);
  const getTags = () => {
    setLoading(true);
    axios.get(routeTo('/api/tags'))
      .then((response) => {
        setTags(response.data.tags as Tag[]);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getTags();
  }, []);
  return (
    <Box
      sx={{
        width: '60%', minWidth: 'fit-content', display: 'flex', flexDirection: 'column'
      }}
    >
      <span>
        (total
        &nbsp;
        {tags.length}
        )
      </span>
      <Box sx={{ alignSelf: 'flex-end', padding: '5px 0px' }}>
        <TagDialog />
      </Box>
      <Box>
        {loading
          ? (
            <Spinner size="large" marginX="50%" marginY="30%" color="Black" />
          )
          : <TagsTable tagsData={tags} reloadTags={getTags} />}
      </Box>
    </Box>
  );
};
export default Tags;
