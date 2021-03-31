import React from 'react';

export type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  color?: string;
  value: SquareValue;
  onClick: () => void;
}

function Square(props: SquareProps) {
  return (
    <button
      className='square'
      onClick={props.onClick}
      style={{ color: props.color ?? 'black' }}>
      {props.value}
    </button>
  );
}

export default Square;
