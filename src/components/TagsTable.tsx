import React, { FC } from 'react';
import { useTable } from 'react-table';
import { Tag } from '../pages/Tags';

type Props = {
  tagsData: Tag[]
}
const TagsTable: FC<Props> = ({ tagsData }) => {
  const data: any[] = [];
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
  return (
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
            <tr {...row.getRowProps()}>
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
  );
};
export default TagsTable;
