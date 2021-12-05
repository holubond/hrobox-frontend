import React, { FC } from 'react';
import './ValidatedFormGroup.css';

import {
  FormGroup
} from '@primer/components';

type Props = { message: string };

const ValidatedFormGroup: FC<Props> = ({ message, children }) => (
  <FormGroup className={(message !== '') ? 'errored validated-fg' : 'validated-fg'}>
    {children}
    <p className={(message !== '') ? 'error' : 'hidden'}>{message}</p>
  </FormGroup>
);
export default ValidatedFormGroup;
