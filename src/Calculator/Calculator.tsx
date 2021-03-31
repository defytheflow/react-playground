import React from 'react';

import './Calculator.css';

const LAYOUT = [
  ['C', '+/-', '%', '÷'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', ',', '='],
];

export default function Calculator() {
  function renderButton(row: number, col: number) {
    const value = LAYOUT[row][col];
    const isBlack = row == 0 && (col == 0 || col == 1 || col == 2);
    const isOrange = col == 3;
    const color = isBlack ? 'black' : isOrange ? 'orange' : 'grey';
    const colSpan = value == '0' ? 2 : 1;
    return (
      <button key={value} className={`button button-cols-${colSpan} button-${color}`}>
        {value}
      </button>
    );
  }

  return (
    <div className='calculator'>
      <div className='calculator-input'>
        <span className='calculator-value'>0</span>
      </div>
      <div className='calculator-panel'>
        {LAYOUT.map((row, rowIdx) => (
          <div key={rowIdx} className='calculator-row'>
            {row.map((value, colIdx) => renderButton(rowIdx, colIdx))}
          </div>
        ))}
      </div>
    </div>
  );
}
