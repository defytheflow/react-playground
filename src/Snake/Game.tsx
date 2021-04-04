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
  isPaused: boolean;
}

export default class Game extends React.Component<GameProps, GameState> {
  readonly boardSize: number;
  private intervalID?: NodeJS.Timeout;

  constructor(props: GameProps) {
    super(props);
    this.boardSize = props.boardSize ?? 15;
    this.state = {
      snake: [{ position: 142, direction: Direction.UP }],
      isPaused: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
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
  }

  componentWillUnmount() {
    this.removeInterval();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  createInterval() {
    const updateTime = this.props.updateTime ?? 200;
    this.intervalID = setInterval(() => {
      this.moveSnake();
    }, updateTime);
  }

  removeInterval() {
    if (this.intervalID) clearInterval(this.intervalID);
  }

  handleKeyDown(e: KeyboardEvent) {
    let newDirection: Direction | null = null;

    // Pause the game on Space.
    if (e.key === ' ') {
      return this.setState(state => ({
        isPaused: !state.isPaused,
      }));
    }

    // Move the snake on Arrows.
    if (e.key === 'ArrowLeft') {
      newDirection = Direction.LEFT;
    } else if (e.key === 'ArrowRight') {
      newDirection = Direction.RIGHT;
    } else if (e.key === 'ArrowUp') {
      newDirection = Direction.UP;
    } else if (e.key === 'ArrowDown') {
      newDirection = Direction.DOWN;
    }

    if (newDirection != null) {
      this.updateSnakeDirection(newDirection);
    }
  }

  updateSnakeDirection(newDirection: Direction) {
    const snake = this.state.snake.slice();
    snake[0] = { ...snake[0], direction: newDirection };
    this.setState({ snake });
  }

  moveSnake() {
    const snake = this.state.snake.map(bodyPart => {
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
    this.setState({ snake });
  }

  renderCell(i: number) {
    const isSnakeCell = this.state.snake.find(bodyPart => bodyPart.position == i);
    return (
      <div key={i} className={'cell' + (isSnakeCell ? ' snake-cell' : '')}>
        {/* {i} */}
      </div>
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
          <div className='overlay'>
            <div className='overlay-inner'>
              <button
                className='game-pause-btn'
                onClick={() => this.setState({ isPaused: false })}>
                Paused
              </button>
              <p>Click or Press 'Space' to continue.</p>
            </div>
          </div>
        )}
      </>
    );
  }
}
