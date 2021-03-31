import React from 'react';

import Square, { SquareValue } from './Square';

export type BoardRow = [number, number, number];

interface BoardProps {
  next: NonNullable<SquareValue>;
  squares: Array<SquareValue>;
  onClick: (i: number) => void;
  winner: BoardRow | null;
}

function Board(props: BoardProps) {
  function renderSquare(i: number) {
    return (
      <Square
        key={i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        color={props.winner?.includes(i) ? 'green' : 'black'}
      />
    );
  }

  return (
    <>
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div key={row} className='board-row'>
            {Array(3)
              .fill(null)
              .map((_, col) => renderSquare(row * 3 + col))}
          </div>
        ))}
    </>
  );
}

export default Board;
