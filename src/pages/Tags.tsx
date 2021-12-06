import React from 'react';
import { Box } from '@primer/components';
import axios from 'axios';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';

const Home = () => {
    type Tag ={
        id: number,
  nameCs: string,
  nameEn: string
    }
    let tags: Array<Tag>;
    const getTags = () => {
      axios.get(routeTo('/api/tags'))
        .then((response) => {
          tags.concat(response.data.tags);
        })
        .catch((error) => {
          handleErrors(error);
        }).finally(() => {

        });
    };
    return (
      <Box>Hej</Box>
    );
};
export default Home;
