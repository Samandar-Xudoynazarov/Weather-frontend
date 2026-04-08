export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'idle' | 'running' | 'paused' | 'game-over';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeState {
  snake: Position[];
  direction: Direction;
  food: Position | null;
  score: number;
  status: GameStatus;
  gridSize: number;
}

export const GRID_SIZE = 16;
export const INITIAL_DIRECTION: Direction = 'right';
export const INITIAL_SNAKE: Position[] = [
  { x: 4, y: 8 },
  { x: 3, y: 8 },
  { x: 2, y: 8 },
];

const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function positionsEqual(a: Position, b: Position) {
  return a.x === b.x && a.y === b.y;
}

export function isOppositeDirection(current: Direction, next: Direction) {
  return (
    (current === 'up' && next === 'down') ||
    (current === 'down' && next === 'up') ||
    (current === 'left' && next === 'right') ||
    (current === 'right' && next === 'left')
  );
}

export function normalizeDirection(current: Direction, requested?: Direction) {
  if (!requested || isOppositeDirection(current, requested)) {
    return current;
  }

  return requested;
}

export function getNextHeadPosition(head: Position, direction: Direction): Position {
  const vector = DIRECTION_VECTORS[direction];

  return {
    x: head.x + vector.x,
    y: head.y + vector.y,
  };
}

export function isOutOfBounds(position: Position, gridSize: number) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

export function getAvailableFoodPositions(snake: Position[], gridSize: number) {
  const occupied = new Set(snake.map((segment) => `${segment.x}:${segment.y}`));
  const available: Position[] = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x}:${y}`;
      if (!occupied.has(key)) {
        available.push({ x, y });
      }
    }
  }

  return available;
}

export function createFoodPosition(
  snake: Position[],
  gridSize = GRID_SIZE,
  random: () => number = Math.random,
) {
  const available = getAvailableFoodPositions(snake, gridSize);

  if (available.length === 0) {
    return null;
  }

  const index = Math.floor(random() * available.length);
  return available[index];
}

export function createInitialSnakeState(random: () => number = Math.random): SnakeState {
  const snake = INITIAL_SNAKE.map((segment) => ({ ...segment }));

  return {
    snake,
    direction: INITIAL_DIRECTION,
    food: createFoodPosition(snake, GRID_SIZE, random),
    score: 0,
    status: 'idle',
    gridSize: GRID_SIZE,
  };
}

export function advanceSnake(
  state: SnakeState,
  requestedDirection?: Direction,
  random: () => number = Math.random,
): SnakeState {
  if (state.status !== 'running') {
    return state;
  }

  const nextDirection = normalizeDirection(state.direction, requestedDirection);
  const nextHead = getNextHeadPosition(state.snake[0], nextDirection);

  if (isOutOfBounds(nextHead, state.gridSize)) {
    return {
      ...state,
      direction: nextDirection,
      status: 'game-over',
    };
  }

  const willEatFood = state.food ? positionsEqual(nextHead, state.food) : false;
  const collisionBody = willEatFood ? state.snake : state.snake.slice(0, -1);
  const hitsBody = collisionBody.some((segment) => positionsEqual(segment, nextHead));

  if (hitsBody) {
    return {
      ...state,
      direction: nextDirection,
      status: 'game-over',
    };
  }

  if (willEatFood) {
    const grownSnake = [nextHead, ...state.snake];
    const nextFood = createFoodPosition(grownSnake, state.gridSize, random);

    return {
      ...state,
      snake: grownSnake,
      direction: nextDirection,
      food: nextFood,
      score: state.score + 1,
      status: nextFood ? 'running' : 'game-over',
    };
  }

  return {
    ...state,
    snake: [nextHead, ...state.snake.slice(0, -1)],
    direction: nextDirection,
  };
}
