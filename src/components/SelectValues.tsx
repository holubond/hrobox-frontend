import { Button, FormGroup, SelectMenu } from '@primer/components';
import React, { FC } from 'react';
import checked from '../assets/checked.svg';
import unchecked from '../assets/unchecked.svg';

type Props = {
  header: string,
  allowedValues: any[],
  values: any[],
  setValues: React.Dispatch<React.SetStateAction<any[]>>
  // eslint-disable-next-line no-unused-vars
  mapValues?: (x: any) => any
};

const SelectValues: FC<Props> = ({
  header, allowedValues, values, setValues, mapValues = () => {}
}) => {
  const toggleValue = (d: any) => {
    const newDurations = values;
    const index = newDurations.indexOf(d);
    if (index === -1) {
      newDurations.push(d);
    } else {
      newDurations.splice(index, 1);
    }
    setValues([...newDurations]);
  };

  return (
    <FormGroup sx={{ margin: '0' }}>
      <SelectMenu>
        <Button as="summary">{header}</Button>
        <SelectMenu.Modal>
          <SelectMenu.Header>{header}</SelectMenu.Header>
          <SelectMenu.List>
            {allowedValues.map((dur) => (
              <SelectMenu.Item onClick={(e) => { e.preventDefault(); toggleValue(dur); }}>
                { values.includes(dur) ? (
                  <img src={checked} height="16" alt={dur} />
                ) : (
                  <img src={unchecked} height="16" alt={dur} />
                )}
                {mapValues(dur)}
              </SelectMenu.Item>
            ))}
          </SelectMenu.List>
        </SelectMenu.Modal>
      </SelectMenu>
    </FormGroup>
  );
};

SelectValues.defaultProps = {
  mapValues: (x) => x
};

export default SelectValues;
