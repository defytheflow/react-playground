import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';

import TicTacToe from './TicTacToe/Game';
import Calculator from './Calculator/Calculator';
import Snake from './Snake/Game';
import './index.css';

const NavBar: React.FC = () => {
  return (
    <nav className='nav'>
      <Link to='/tic-tac-toe'>Tic Tac Toe</Link>
      <span>/</span>
      <Link to='/calculator'>Calculator</Link>
      <span>/</span>
      <Link to='/snake'>Snake</Link>
      <span>/</span>
    </nav>
  );
};

const AppRouter: React.FC = () => {
  const { pathname } = useLocation();

  // Update title every time the pathname changes.
  useEffect(() => {
    const title = location.pathname
      .slice(1) // remove the slash.
      .replace(/-/g, ' ') // remove dashes.
      .replace(/\b\w/g, word => word.toUpperCase()); // capitalize each word.
    document.title = title;
  }, [pathname]);

  return (
    <Switch>
      <Route path='/tic-tac-toe' component={TicTacToe} />
      <Route path='/calculator' component={Calculator} />
      <Route path='/snake' component={Snake} />
      <Redirect to='/tic-tac-toe' />
    </Switch>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
