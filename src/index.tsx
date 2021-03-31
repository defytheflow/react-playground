import React from 'react';
import ReactDOM from 'react-dom';

import Game from './TicTacToe/Game';
import Calculator from './Calculator/Calculator';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>,
  document.getElementById('root')
);
