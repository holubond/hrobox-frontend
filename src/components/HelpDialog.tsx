import {
  Box, Button, Dialog, Header, Spinner
} from '@primer/components';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import useLoggedInUser from '../hooks/useLoggedInUser';
import routeTo from '../utils/routeTo';

const HelpDialog: FC = () => {
  const [userIn] = useLoggedInUser();
  const [isOpen, setOpen] = useState(false);
  const returnFocusRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const submit = (values: any) => {
    setLoading(true);
    let data;
    let headers;
    if (userIn.jwt === '') {
      data = { email: values.email, message: values.message };
      headers = { 'Content-Type': 'application/json', Authorisation: '' };
    } else {
      data = { message: values.message };
      headers = { 'Content-Type': 'application/json', Authorisation: `Bearer ${userIn.jwt}` };
    }
    axios.post(routeTo('/api/support'), data, { headers })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        alert(error);
        // todo: handle error
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
  }, [loading]);
  return (
    <>
      <Header.Link ref={returnFocusRef} onClick={() => setOpen(true)}>
        Help
      </Header.Link>
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">Contact Support</Dialog.Header>
        <Box p={3}>
          <Form
            onSubmit={(values) => {
              submit(values);
            }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {userIn.jwt === '' ? (
                  <input value={email} onChange={(e) => setEmail(e.target.value)} />
                ) : ('')}
                <input value={message} onChange={(e) => setMessage(e.target.value)} />

                <Box display="flex" flexWrap="nowrap" sx={{ paddingBlockStart: 15 }}>
                  <Box sx={{ flexGrow: 0.15 }} />
                  {loading ? <Spinner color="Black" /> : <Button type="submit">Submit</Button> }
                </Box>
              </form>
            )}
          />
        </Box>
      </Dialog>
    </ >
  );
};
export default HelpDialog;
