import { ThemeProvider } from '@primer/components';
import { BrowserRouter } from 'react-router-dom';

import React from 'react';

import './App.css';
import Layout from './components/Layout';
import { LanguageProvider } from './hooks/useTranslation';
import { UserProvider } from './hooks/useLoggedInUser';
import Routes from './components/routes';

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <UserProvider>
        <BrowserRouter>
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </UserProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
