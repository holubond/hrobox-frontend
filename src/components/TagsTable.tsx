import { Box, Header } from '@primer/components';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useTable } from 'react-table';
import useLoggedInUser from '../hooks/useLoggedInUser';
import { Tag } from '../pages/Tags';
import TagDialog from './TagDialog';

type Props = {
  tagsData: Tag[]
}
const TagsTable: FC<Props> = ({ tagsData }) => {
  const data: any[] = [];
  const history = useHistory();
  const [user] = useLoggedInUser();
  tagsData.forEach((element) => data.push({ col1: element.nameCs, col2: element.nameEn }));

  const columns = React.useMemo(
    () => [
      {
        Header: 'Tags',
        columns: [
          {
            Header: 'Czech name',
            accessor: 'col1'
          },
          {
            Header: 'English name',
            accessor: 'col2'
          }
        ]
      }
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });

  const rowClick = (id: string) => {
    history.push(`/tag/${id}`);
  };
  return (
    <Box>
      {user.role === 'Admin'
        ? (
          <Header.Item sx={{ padding: '20px', fontSize: '20px' }}>
            <TagDialog />
          </Header.Item>
        ) : ('')}
      <table
        {...getTableProps()}
        style={{
          border: 'solid 1px black', display: 'block', height: '700px', overflowY: '-moz-hidden-unscrollable'
        }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px black',
                    background: '#24292f',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => rowClick(row.id)}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '20px',
                      border: 'solid 2px gray',
                      background: 'white'
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};
export default TagsTable;
