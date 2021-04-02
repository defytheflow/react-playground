import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';

import TicTacToe from './TicTacToe/Game';
import Calculator from './Calculator/Calculator';
import './index.css';

function NavBar() {
  return (
    <nav className='nav'>
      <Link to='/tic-tac-toe'>Tic Tac Toe</Link>
      <span>/</span>
      <Link to='/calculator'>Calculator</Link>
      <span>/</span>
    </nav>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route
        path='/tic-tac-toe'
        component={() => {
          document.title = 'Tic Tac Toe';
          return <TicTacToe />;
        }}
      />
      <Route
        path='/calculator'
        component={() => {
          document.title = 'Calculator';
          return <Calculator />;
        }}
      />
      <Redirect to='/tic-tac-toe' />
    </Switch>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
