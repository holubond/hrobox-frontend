import React from 'react';
import { ThemeProvider } from '@primer/components';
import { BrowserRouter } from 'react-router-dom';

import logo from './assets/logo.png';
import './App.css';

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit&nbsp;
            <code>src/App.tsx</code>
            &nbsp;and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
