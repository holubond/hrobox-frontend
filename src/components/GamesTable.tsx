import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useTable } from 'react-table';
import { AgeGroup, Game } from '../pages/Games';
import logo from '../assets/people.svg';

type Props = {
  gamesData: Game[]
}
const GamesTable: FC<Props> = ({ gamesData }) => {
  const data: any[] = [];
  const history = useHistory();

  // eslint-disable-next-line arrow-body-style
  const mapAgeGr = (ageGroups: AgeGroup[]) => {
    return ageGroups.map((group) => {
      if (group === 'K') {
        return 'Kindergarden';
      } if (group === 'S') {
        return 'Student';
      } if (group === 'T') {
        return 'Teenager';
      }
      return 'Adult';
    });
  };

  gamesData.forEach((element) => data.push({
    col1: element.name,
    col2: element.duration,
    col3: mapAgeGr(element.ageGroups),
    col4: `${element.nrOfPlayers.min}-${element.nrOfPlayers.max}`,
    col5: 'PH',
    col6: element.createdBy,
    col7: element.createdAt
  }));

  const columns = React.useMemo(
    () => [
      {
        Header: 'Games',
        columns: [
          {
            Header: 'Game name',
            accessor: 'col1'
          },
          {
            Header: 'Duration',
            accessor: 'col2'
          },
          {
            Header: 'Age',
            accessor: 'col3'
          },
          {
            Header: 'Number of players',
            accessor: 'col4'
          },
          {
            Header: 'Tags',
            accessor: 'col5'
          },
          {
            Header: 'Author',
            accessor: 'col6'
          },
          {
            Header: 'Last update',
            accessor: 'col7'
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
    // history.push(`/game/${id}/version/${version}`);
    history.push(`/game/${id}`);
  };
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
                  {cell.column.id === 'col4' ? (
                    <img src={logo} height="16" alt="number of players" />
                  ) : ('')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default GamesTable;
