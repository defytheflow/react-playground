import React, { useState } from 'react';

import './Calculator.css';

type Operator = '+' | '-' | 'X' | '÷';

const LAYOUT = [
  ['C', '+/-', '%', '÷'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', ',', '='],
];

function calculateExpression(val1: string, val2: string, operator: Operator) {
  const val1Float = parseFloat(val1);
  const val2Float = parseFloat(val2);
  switch (operator) {
    case '+':
      return val1Float + val2Float;
    case '-':
      return val1Float - val2Float;
    case 'X':
      return val1Float * val2Float;
    case '÷':
      return val1Float / val2Float;
  }
}

export default function Calculator() {
  const [input1, setInput1] = useState('0');
  const [input2, setInput2] = useState<string | null>(null);
  const [operator1, setOperator1] = useState<Operator | null>(null);
  const [operator2, setOperator2] = useState<Operator | null>(null);
  const [clearInput, setClearInput] = useState(false);

  function handleClick(value: string) {
    if (value.match(/[\d]/)) {
      if (clearInput) {
        setInput1(value);
        setClearInput(false);
      } else {
        setInput1(prevInput => (prevInput == '0' ? value : prevInput + value));
      }
      return;
    }

    if (value == ',') {
      if (!input1.includes(',')) {
        setInput1(prevInput => prevInput + value);
      }
      return;
    }

    // Reset values.
    if (value == 'C') {
      setInput1('0');
      setInput2(null);
      setOperator1(null);
      return;
    }

    if (value == '+/-') {
      setInput1(prevInput =>
        prevInput.startsWith('-') ? prevInput.substr(1) : '-' + prevInput
      );
      return;
    }

    if (value == '%') {
      setInput1(prevInput => (parseFloat(prevInput) / 100).toString());
      return;
    }

    if (value == '=') {
      if (operator1 && input2) {
        const result = calculateExpression(input1, input2, operator1);
        setInput1(result.toString());
        setInput2(null);
        setOperator1(null);
        setClearInput(true);
      }
      return;
    }

    // Save the operator.
    setOperator1(value as Operator);
    // Save the first input.
    setInput2(input1);
    // Signal that second value should be entered.
    setClearInput(true);
  }

  return (
    <div className='calculator'>
      <div className='calculator-input'>
        <span className='calculator-value'>{input1}</span>
      </div>
      <div className='calculator-panel'>
        {LAYOUT.map((row, rowIdx) => (
          <div key={rowIdx} className='calculator-row'>
            {row.map((value, colIdx) => (
              <Button
                key={value}
                row={rowIdx}
                col={colIdx}
                onClick={() => handleClick(value)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ButtonProps {
  row: number;
  col: number;
  onClick: () => void;
}

function Button(props: ButtonProps) {
  const value = LAYOUT[props.row][props.col];
  const isBlack = props.row == 0 && (props.col == 0 || props.col == 1 || props.col == 2);
  const isOrange = props.col == 3;
  const color = isBlack ? 'black' : isOrange ? 'orange' : 'grey';
  const colSpan = value == '0' ? 2 : 1;
  return (
    <button
      key={value}
      onClick={props.onClick}
      className={`button button-cols-${colSpan} button-${color}`}>
      {value}
    </button>
  );
}
