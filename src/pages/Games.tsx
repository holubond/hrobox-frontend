import React, { useEffect, useState } from 'react';
import { Box } from '@primer/components';
import axios from 'axios';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import GamesTable from '../components/GamesTable';

export type AgeGroup = 'K' | 'S' | 'T' | 'A';
type Duration = '<15' | '15-30' | '30-60' | '60+';
export type Game = {
  id: number,
  version: number,
  name: string,
  createdBy: string,
  createdAt: string,
  nrOfPlayers: {
    min: number,
    max: number
  },
  duration: Duration,
  ageGroups: AgeGroup[],
  tags: string[]
};

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const getAllGames = () => {
    axios.post(routeTo('/api/games'), { lang: 'cs' })
      .then((response) => {
        setGames(response.data as Game[]);
      })
      .catch((error) => {
        console.log('PICA');
        handleErrors(error);
      }).finally(() => {

      });
  };
  useEffect(() => {
    getAllGames();
  }, []);
  return (
    <Box sx={{ width: '90%', display: 'flex', flexDirection: 'column' }}>
      <GamesTable gamesData={games} />
    </Box>
  );
};
export default Games;
