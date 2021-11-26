import { ThemeProvider } from '@primer/components';
import { BrowserRouter } from 'react-router-dom';

import React from 'react';

import './App.css';
import Layout from './components/Layout';

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Layout>
        main container
      </Layout>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
