import React, { useEffect, useState } from 'react';
import {
  Box, Button, Heading, Label, Pagehead, Spinner, Text
} from '@primer/components';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { PencilIcon } from '@primer/octicons-react';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import { useLanguage, useTranslation } from '../hooks/useTranslation';
import { mapAgeGrColor } from '../components/GamesTable';
import { Duration } from '../model/Duration';
import { AgeGroup } from '../model/AgeGroup';
import { formatNrOfPlayers, formatTimestamp } from '../utils/format';

export type Game = {
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
  const [, setLoading] = useState(false);
  const [game, setGame] = useState<Game>();
  const [selectedLang] = useLanguage();
  const trans = useTranslation();
  const history = useHistory();

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

  if (!game) {
    return (<Spinner size="large" color="Black" />);
  }

  return (
    <Box sx={{
      width: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center'
    }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Pagehead sx={{ width: '100%' }}>
          <Box sx={{
            display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end'
          }}
          >
            <Heading>
              {game.name}
            </Heading>
            <Box>
              <Button onClick={() => { history.push(`/game/edit/${id}/version/${version}`); }}>
                <PencilIcon size={16} />
                <Text marginLeft="5px">{trans('Edit')}</Text>
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'inline-flex', gap: '5px' }}>
            <Text fontWeight="600">{game.createdBy}</Text>
            <Text>{trans('EditedThisGame')}</Text>
            <Text>{formatTimestamp(game.createdAt)}</Text>
          </Box>
        </Pagehead>
      </Box>

      <Box sx={{
        display: 'flex', flexDirection: 'row', width: '100%', gap: '10px'
      }}
      >
        <Box minWidth="250px" width="100%">
          <Text>{game.rules}</Text>
        </Box>
        <Box sx={{
          display: 'flex', flexDirection: 'column', width: '30%', minWidth: '250px'
        }}
        >
          <Text fontWeight="600" color="#57606a">{trans('Number of players')}</Text>
          <Text>{formatNrOfPlayers(game.nrOfPlayers)}</Text>

          <Box width="100%" borderBottom="solid 1px #d8dee4" margin="20px 0px"> </Box>

          <Text fontWeight="600" color="#57606a">{trans('Duration of the game')}</Text>
          <Text>{`${game.duration} ${trans('minutes')}`}</Text>

          <Box width="100%" borderBottom="solid 1px #d8dee4" margin="20px 0px"> </Box>

          <Text fontWeight="600" color="#57606a">{trans('Age groups')}</Text>
          <Box>
            {game.ageGroups.map((group) => (
              <Label bg={mapAgeGrColor(group)}>
                {trans(group)}
              </Label>
            ))}
          </Box>

          <Box width="100%" borderBottom="solid 1px #d8dee4" margin="20px 0px"> </Box>

          <Text fontWeight="600" color="#57606a">{trans('Tags')}</Text>
          <Box>
            {game.tags.map((tag) => (
              <Label>
                {tag}
              </Label>
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  );
};
export default GameDetail;
