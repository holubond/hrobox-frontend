import { Box } from '@primer/components';
import { ChevronRightIcon } from '@primer/octicons-react';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Tag } from '../pages/Tags';
import TagDialog from './TagDialog';

type Props = {
  tagsData: Tag[]
}

const TagsTable: FC<Props> = ({ tagsData }) => {
  const trans = useTranslation();
  const history = useHistory();

  const rowClick = (id: number) => {
    history.push(`/tag/${id}`);
  };
  return (
    <Box className="grid-table" style={{ gridTemplateColumns: '1fr 1fr 50px' }}>
      <Box className="grid-table-heading">
        <Box className="grid-item">{trans('TagsColumnCzechName')}</Box>
        <Box className="grid-item">{trans('TagsColumnEnglishName')}</Box>
        <Box className="grid-item" />
      </Box>

      {tagsData.map( (tag) => (
        <Box className="grid-table-row" onClick={() => rowClick(tag.id)}>
          <Box className="grid-item">{tag.nameCs}</Box>
          <Box className="grid-item">{tag.nameEn}</Box>
          <Box className="grid-item"><ChevronRightIcon className="grid-item grid-icon" size={16} /></Box>
        </Box>
      ))}

    </Box>
  );
};
export default TagsTable;
