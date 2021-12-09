import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Label } from '@primer/components';
import { ChevronRightIcon } from '@primer/octicons-react';
import { Game } from '../pages/Games';
import logo from '../assets/people.svg';
import { useTranslation } from '../hooks/useTranslation';
import { AgeGroup } from '../model/AgeGroup';

type Props = {
  gamesData: Game[]
}

export const mapAgeGrColor = (ageGroup: AgeGroup) => {
  if (ageGroup === 'K') {
    return 'Pink';
  } if (ageGroup === 'S') {
    return 'Blue';
  } if (ageGroup === 'T') {
    return 'Red';
  }
  return 'Green';
};
const GamesTable: FC<Props> = ({ gamesData }) => {
  const trans = useTranslation();
  const history = useHistory();
  const mapAgeGr = (ageGroup: AgeGroup) => {
    if (ageGroup === 'K') {
      return trans('Kindergarden');
    } if (ageGroup === 'S') {
      return trans('School');
    } if (ageGroup === 'T') {
      return trans('Teenager');
    }
    return trans('Adult');
  };
  const reformatDate = (at: string) => {
    const date = new Date(at);
    return date.toDateString();
  };

  const rowClick = (id: number, version: number) => {
    history.push(`/games/${id}/version/${version}`);
  };
  return (
    <Box className="grid-table" style={{ gridTemplateColumns: '1.5fr 1fr 1.2fr 1fr 4fr 1fr 1fr 40px' }}>
      <Box className="grid-table-heading">
        <Box className="grid-item">{trans('Name of game')}</Box>
        <Box className="grid-item">{trans('Duration')}</Box>
        <Box className="grid-item">{trans('Age groups')}</Box>
        <Box className="grid-item">{trans('Number of players')}</Box>
        <Box className="grid-item">{trans('Tags')}</Box>
        <Box className="grid-item">{trans('Author')}</Box>
        <Box className="grid-item">{trans('Last Change')}</Box>
        <Box className="grid-item" />
      </Box>

      {gamesData.map( (game) => (
        <Box className="grid-table-row" onClick={() => rowClick(game.id, game.version)}>
          <Box className="grid-item">{game.name}</Box>
          <Box className="grid-item">{game.duration}</Box>
          <Box className="grid-item">
            {game.ageGroups.map((group) => (
              <Label bg={mapAgeGrColor(group)}>{mapAgeGr(group as AgeGroup)}</Label>
            ))}
          </Box>
          <Box className="grid-item">
            {game.nrOfPlayers.min}
            -
            {game.nrOfPlayers.max}
            <img src={logo} height="16" alt="number of players" />
          </Box>
          <Box className="grid-item">
            {game.tags.sort((a, b) => a.localeCompare(b)).map((tag) => (
              <Label>{tag}</Label>
            ))}
          </Box>
          <Box className="grid-item">{game.createdBy}</Box>
          <Box className="grid-item">{reformatDate(game.createdAt)}</Box>
          <Box className="grid-item"><ChevronRightIcon className="grid-item grid-icon" size={16} /></Box>
        </Box>
      ))}

    </Box>
  );
};
export default GamesTable;
