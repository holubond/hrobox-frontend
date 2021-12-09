import React, { useEffect, useState } from 'react';
import { Box, Label, Text } from '@primer/components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import { useLanguage, useTranslation } from '../hooks/useTranslation';
import { AgeGroup, Duration } from './Games';
import { mapAgeGrColor } from '../components/GamesTable';

type Game = {
  id: number,
  version: number,
  name: string,
  createdBy: string,
  rules: string,
  createdAt: string,
  nrOfPlayers: {
    min: number,
    max: number
  },
  duration: Duration,
  ageGroups: AgeGroup[],
  tags: string[]
}
const GameDetail = () => {
  const { id, version } = useParams<{ id: string, version: string}>();
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<Game>();
  const [selectedLang] = useLanguage();
  const trans = useTranslation();

  const getDetail = () => {
    setLoading(true);
    const gameRoute = `/${id}/version/${version}`;
    axios.get(routeTo('/api/game') + gameRoute, {
      params: {
        lang: selectedLang
      }
    })
      .then((response) => {
        setGame(response.data as Game);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDetail();
  }, []);
  useEffect(() => {
    getDetail();
  }, [selectedLang]);
  return (
    <Box>
      {game ? (
        <>
          <Box sx={{
            width: '90%', display: 'block', flexDirection: 'column', boxShadow: 'shadow.large'
          }}
          >
            <Text>{game.name}</Text>
            <Text>{`${game.createdBy} - ${(new Date(game.createdAt).toDateString())}`}</Text>
          </Box>
          <Box>
            <Box sx={{
              width: '30%', display: 'block', flexDirection: 'column', boxShadow: 'shadow.large'
            }}
            >
              <Text>{game.rules}</Text>
            </Box>
            <Box sx={{
              width: '60%', display: 'block', flexDirection: 'column', boxShadow: 'shadow.large'
            }}
            >
              <Box>
                <Text>{trans('Number of players')}</Text>
                <Text>{`${game.nrOfPlayers.min}-${game.nrOfPlayers.max}`}</Text>
              </Box>
              <Box>
                <Text>{trans('Duration of the game')}</Text>
                <Text>{`${game.duration} ${trans('minutes')}`}</Text>
              </Box>
              <Box>
                <Text>{trans('Age groups')}</Text>
                {game.ageGroups.map((group) => (
                  <Label bg={mapAgeGrColor(group)}>
                    {trans(group)}
                  </Label>
                ))}
              </Box>
              <Box>
                <Text>{trans('Tags')}</Text>
                {game.tags.map((tag) => (
                  <Label>
                    {tag}
                  </Label>
                ))}
              </Box>
            </Box>
          </Box>
        </>

      ) : (
        ''
      )}
    </Box>
  );
};
export default GameDetail;
