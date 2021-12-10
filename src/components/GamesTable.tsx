import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Label } from '@primer/components';
import { ChevronRightIcon, PeopleIcon, StopwatchIcon } from '@primer/octicons-react';
import { Game } from '../pages/Games';
import { useTranslation } from '../hooks/useTranslation';
import { AgeGroup } from '../model/AgeGroup';
import { formatNrOfPlayers, formatTimestampShort } from '../utils/format';

type Props = {
  gamesData: Game[]
}

export const mapAgeGrColor = (ageGroup: AgeGroup) => {
  if (ageGroup === 'K') {
    return '#8bc34a';
  } if (ageGroup === 'S') {
    return '#2196f3';
  } if (ageGroup === 'T') {
    return '#f44336';
  }
  return '#000000';
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

  const rowClick = (id: number, version: number) => {
    history.push(`/game/${id}/version/${version}`);
  };
  return (
    <Box className="grid-table grid-table-clickable" style={{ gridTemplateColumns: '1.5fr 1fr 1.2fr 1fr 4fr 1fr 1fr 40px' }}>
      <Box key="header" className="grid-table-heading">
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
        <Box key={game.id} className="grid-table-row grid-table-row-cursor" onClick={() => rowClick(game.id, game.version)}>
          <Box className="grid-item grid-item-data">{game.name}</Box>
          <Box className="grid-item grid-item-data">
            <StopwatchIcon size={16} />
            {` ${game.duration} m`}
          </Box>
          <Box className="grid-item grid-item-data">
            {game.ageGroups.map((group) => (
              <Label bg={mapAgeGrColor(group)}>{mapAgeGr(group as AgeGroup)}</Label>
            ))}
          </Box>
          <Box className="grid-item grid-item-data">
            <PeopleIcon size={16} />
            {formatNrOfPlayers(game.nrOfPlayers)}
          </Box>
          <Box className="grid-item grid-item-data">
            {game.tags.sort((a, b) => a.localeCompare(b)).map((tag) => (
              <Label>{tag}</Label>
            ))}
          </Box>
          <Box className="grid-item grid-item-data">{game.createdBy}</Box>
          <Box className="grid-item grid-item-data">{formatTimestampShort(game.createdAt)}</Box>
          <Box className="grid-item grid-item-data">
            <ChevronRightIcon className="grid-item grid-icon" size={16} />
          </Box>
        </Box>
      ))}

    </Box>
  );
};
export default GamesTable;
