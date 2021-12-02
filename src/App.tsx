import { ThemeProvider } from '@primer/components';
import { BrowserRouter } from 'react-router-dom';

import React from 'react';

import './App.css';
import Layout from './components/Layout';
import { LanguageProvider } from './hooks/useTranslation';

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          main container
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
