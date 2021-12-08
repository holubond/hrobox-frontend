import { Box } from '@primer/components';
import React, { FC } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Tag } from '../pages/Tags';
import RemoveTag from './RemoveTag';

type Props = {
  tagsData: Tag[]
}

const TagsTable: FC<Props> = ({ tagsData }) => {
  const trans = useTranslation();

  return (
    <Box className="grid-table" style={{ gridTemplateColumns: '3fr 3fr 1fr' }}>
      <Box className="grid-table-heading">
        <Box className="grid-item">{trans('TagsColumnCzechName')}</Box>
        <Box className="grid-item">{trans('TagsColumnEnglishName')}</Box>
        <Box className="grid-item" />
      </Box>

      {tagsData.map( (tag) => (
        <Box className="grid-table-row">
          <Box className="grid-item">{tag.nameCs}</Box>
          <Box className="grid-item">{tag.nameEn}</Box>
          <Box className="grid-item">
            <RemoveTag tagsId={tag.id} />
          </Box>
        </Box>
      ))}

    </Box>
  );
};
export default TagsTable;
