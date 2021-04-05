import React from 'react';

import './Game.css';

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface SnakeBodyPart {
  direction: Direction;
  position: number;
}

interface GameProps {
  boardSize?: number;
  updateTime?: number;
}

interface GameState {
  snake: Array<SnakeBodyPart>;
  fruit: number;
  isPaused: boolean;
}

export default class Game extends React.Component<GameProps, GameState> {
  readonly boardSize: number;
  private intervalID?: NodeJS.Timeout;

  constructor(props: GameProps) {
    super(props);
    this.boardSize = props.boardSize ?? 15;
    this.state = this.getInitialState();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.resume = this.resume.bind(this);
    this.restart = this.restart.bind(this);
  }

  getInitialState(): GameState {
    let snakePosition = this.generateRandomPosition();
    let fruitPosition: number;

    do {
      fruitPosition = this.generateRandomPosition();
    } while (snakePosition === fruitPosition);

    return {
      snake: [
        {
          position: snakePosition,
          direction: this.generateRandomDirection(),
        },
      ],
      fruit: fruitPosition,
      isPaused: false,
    };
  }

  componentDidMount() {
    this.createInterval();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps: GameProps, prevState: GameState) {
    if (!prevState.isPaused && this.state.isPaused) {
      this.removeInterval();
    }

    if (prevState.isPaused && !this.state.isPaused) {
      this.createInterval();
    }

    if (prevState.snake[0].position !== this.state.snake[0].position) {
      if (this.state.snake[0].position === this.state.fruit) {
        this.growSnake();
      }
    }
  }

  componentWillUnmount() {
    this.removeInterval();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case ' ':
        return this.setState(state => ({ isPaused: !state.isPaused }));
      case 'ArrowLeft':
        return this.turnSnake(Direction.LEFT);
      case 'ArrowRight':
        return this.turnSnake(Direction.RIGHT);
      case 'ArrowUp':
        return this.turnSnake(Direction.UP);
      case 'ArrowDown':
        return this.turnSnake(Direction.DOWN);
    }
  }

  createInterval() {
    const updateTime = this.props.updateTime ?? 200;
    this.intervalID = setInterval(() => {
      this.moveSnake();
    }, updateTime);
  }

  removeInterval() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }

  turnSnake(newDirection: Direction) {
    this.setState(state => {
      const snake = state.snake.slice();
      snake[0].direction = newDirection;
      return { snake };
    });
  }

  moveSnake() {
    this.setState(state => {
      // Move each bodypart towards its direction.
      const snake = state.snake.map((bodyPart, i, arr) => {
        let newPosition: number;
        switch (bodyPart.direction) {
          case Direction.UP:
            newPosition = bodyPart.position - this.boardSize;
            if (newPosition < 0)
              newPosition = bodyPart.position + this.boardSize * (this.boardSize - 1);
            return { ...bodyPart, position: newPosition };
          case Direction.DOWN:
            newPosition = bodyPart.position + this.boardSize;
            if (newPosition > this.boardSize ** 2)
              newPosition = bodyPart.position - this.boardSize * (this.boardSize - 1);
            return { ...bodyPart, position: newPosition };
          case Direction.LEFT:
            newPosition = bodyPart.position - 1;
            if (bodyPart.position % this.boardSize == 0)
              newPosition = bodyPart.position + this.boardSize - 1;
            return { ...bodyPart, position: newPosition };
          case Direction.RIGHT:
            newPosition = bodyPart.position + 1;
            if ((bodyPart.position + 1) % this.boardSize == 0)
              newPosition = bodyPart.position - this.boardSize + 1;
            return { ...bodyPart, position: newPosition };
        }
      });
      // Change each bodypart's direction to the next bodypart's direction.
      for (let i = snake.length - 1; i > 0; i--) {
        snake[i].direction = snake[i - 1].direction;
      }
      return { snake };
    });
  }

  growSnake() {
    this.setState(state => {
      const snakeTail = state.snake[this.state.snake.length - 1];
      const newSnakeTail = { position: -1, direction: snakeTail.direction };

      switch (snakeTail.direction) {
        case Direction.UP:
          newSnakeTail.position = snakeTail.position + this.boardSize;
          break;
        case Direction.DOWN:
          newSnakeTail.position = snakeTail.position - this.boardSize;
          break;
        case Direction.LEFT:
          newSnakeTail.position = snakeTail.position + 1;
          break;
        case Direction.RIGHT:
          newSnakeTail.position = snakeTail.position - 1;
          break;
      }

      return {
        snake: [...state.snake, newSnakeTail],
        fruit: this.generateFruitPosition(),
      };
    });
  }

  generateRandomDirection(): Direction {
    const numberOfDirections = Object.keys(Direction).length / 2;
    return Math.floor(Math.random() * (numberOfDirections - 1));
  }

  generateRandomPosition(): number {
    return Math.floor(Math.random() * this.boardSize ** 2);
  }

  generateFruitPosition(): number {
    let fruitPosition: number;
    do {
      fruitPosition = this.generateRandomPosition();
    } while (this.state.snake.find(bodyPart => bodyPart.position == fruitPosition));
    return fruitPosition;
  }

  resume() {
    this.setState({ isPaused: false });
  }

  restart() {
    this.setState(this.getInitialState());
  }

  renderCell(i: number): JSX.Element {
    const isSnakeCell = this.state.snake.find(bodyPart => bodyPart.position == i);
    const isFoodCell = i === this.state.fruit;
    return (
      <div
        key={i}
        className={
          'cell' + (isSnakeCell ? ' snake-cell' : isFoodCell ? ' food-cell' : '')
        }></div>
    );
  }

  render() {
    return (
      <>
        <div className='game'>
          <div className='board'>
            {[...Array(this.boardSize)].map((_, i) => (
              <div className='row' key={i}>
                {[...Array(this.boardSize)].map((_, j) =>
                  this.renderCell(i * this.boardSize + j)
                )}
              </div>
            ))}
          </div>
        </div>
        {this.state.isPaused && (
          <Overlay>
            <Menu
              options={[
                { label: 'Resume', onClick: this.resume },
                { label: 'Restart', onClick: this.restart },
              ]}
            />
          </Overlay>
        )}
      </>
    );
  }
}

interface MenuOption {
  label: string;
  onClick: () => void;
}

interface MenuProps {
  options: Array<MenuOption>;
}

const Menu: React.FC<MenuProps> = props => {
  return (
    <div className='menu'>
      {props.options.map((option, i) => (
        <button key={i} className='menu-option' onClick={option.onClick}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

const Overlay: React.FC = props => {
  return (
    <div className='overlay'>
      <div className='overlay-inner'>{props.children}</div>
    </div>
  );
};
