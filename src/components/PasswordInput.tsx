import { Box } from '@primer/components';
import { EyeClosedIcon, EyeIcon } from '@primer/octicons-react';
import React, { FC, useState } from 'react';
import './PasswordInput.css';

type Props = {
  value: string,
  // eslint-disable-next-line no-unused-vars
  onChange: (e: any) => void
}

const PasswordInput: FC<Props> = ({ value, onChange }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <span className="PasswordInput-wrap">
      <input className="PasswordInput-input" type={hidden ? 'password' : 'text'} value={value} onChange={(e) => { onChange(e); }} />
      <Box onClick={() => { setHidden(!hidden); }}>
        { hidden
          ? (
            <EyeIcon className="PasswordInput-toggle" size={21} />
          ) : (
            <EyeClosedIcon className="PasswordInput-toggle" size={21} />
          )}
      </Box>
    </span>
  );
};

export default PasswordInput;
