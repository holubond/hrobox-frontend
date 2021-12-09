import { Box } from '@primer/components';
import React, { FC } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Tag } from '../pages/Tags';
import EditTag from './EditTagDialog';
import RemoveTag from './RemoveTag';

type Props = {
  tagsData: Tag[],
  reloadTags: () => void
}

const TagsTable: FC<Props> = ({ tagsData, reloadTags }) => {
  const trans = useTranslation();

  return (
    <Box className="grid-table" style={{ gridTemplateColumns: '1fr 1fr 35px 35px' }}>
      <Box className="grid-table-heading">
        <Box className="grid-item grid-item-data">{trans('TagsColumnCzechName')}</Box>
        <Box className="grid-item grid-item-data">{trans('TagsColumnEnglishName')}</Box>
        <Box className="grid-item grid-item-button" />
        <Box className="grid-item grid-item-button" />
      </Box>

      {tagsData.map( (tag) => (
        <Box className="grid-table-row">
          <Box className="grid-item grid-item-data">{tag.nameCs}</Box>
          <Box className="grid-item grid-item-data">{tag.nameEn}</Box>
          <Box className="grid-item grid-item-button">
            <EditTag tagsId={tag.id} tagsCsName={tag.nameCs} tagsEnName={tag.nameEn} />
          </Box>
          <Box className="grid-item grid-item-button" sx={{ padding: '5px' }}>
            <RemoveTag tagsId={tag.id} reloadTags={reloadTags} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
export default TagsTable;
