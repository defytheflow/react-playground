import React, { useState } from 'react';

import Board, { BoardRow } from './Board';
import { SquareValue } from './Square';
import './Game.css';

type Location = {
  col: number;
  row: number;
};

type GameStep = {
  squares: Array<SquareValue>;
  location: Location | null;
};

type GameHistory = Array<GameStep>;

export default function Game() {
  const [next, setNext] = useState<NonNullable<SquareValue>>('X');
  const [stepNumber, setStepNumber] = useState(0);
  const [history, setHistory] = useState<GameHistory>([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [isAscended, setIsAscended] = useState(true);

  const current = history[stepNumber];
  const [winner, winnerRow] = calculateWinner(current.squares);
  const freeSquares = current.squares.filter(square => square === null).length;

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (freeSquares) {
    status = 'Next player: ' + next;
  } else {
    status = 'Draw';
  }

  function jumpTo(step: number) {
    setStepNumber(step);
    setNext(step % 2 === 0 ? 'X' : 'O');
  }

  function handleClick(i: number) {
    const currentHistory = history.slice(0, stepNumber + 1);
    const currentSquares = currentHistory[currentHistory.length - 1].squares.slice();

    if (calculateWinner(currentSquares)[0] || currentSquares[i]) {
      return;
    }
    currentSquares[i] = next;

    setNext(prevNext => (prevNext === 'X' ? 'O' : 'X'));
    setStepNumber(currentHistory.length);
    setHistory(
      currentHistory.concat([{ squares: currentSquares, location: calculateLocation(i) }])
    );
  }

  const moves = history.map((step, move) => {
    return (
      <li key={move}>
        <button
          className={'move' + (move === stepNumber ? ' move-active' : '')}
          onClick={() => jumpTo(move)}>
          {move ? 'Go to move #' + move : 'Go to game start'}
        </button>
        {step.location && (
          <span>
            ({step.location.col}, {step.location.row})
          </span>
        )}
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board
          next={next}
          squares={current.squares}
          onClick={handleClick}
          winner={winnerRow}
        />
      </div>
      <div className='game-info'>
        <div>
          {status}
          <button
            className='move-toggle'
            onClick={() => setIsAscended(prevValue => !prevValue)}>
            Order: {isAscended ? 'Ascending' : 'Descending'}
          </button>
        </div>
        <ol className={'history' + (isAscended ? '' : ' history-reverse')}>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares: Array<SquareValue>): [SquareValue, BoardRow | null] {
  const lines: Array<BoardRow> = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], line];
    }
  }

  return [null, null];
}

function calculateLocation(i: number) {
  let col;
  const row = i < 3 ? 1 : i < 6 ? 2 : 3;

  if (i === 0 || i === 3 || i === 6) {
    col = 1;
  } else if (i === 1 || i === 4 || i === 7) {
    col = 2;
  } else {
    col = 3;
  }

  return { col, row };
}
