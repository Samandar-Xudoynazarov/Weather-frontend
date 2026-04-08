'use client';

import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  type Direction,
  GRID_SIZE,
  advanceSnake,
  createInitialSnakeState,
} from '@/lib/snake';
import { useIsMobile } from '@/hooks/use-mobile';

const TICK_MS = 140;

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
};

function DirectionButton({
  direction,
  label,
  onPress,
  className,
}: {
  direction: Direction;
  label: ReactNode;
  onPress: (direction: Direction) => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      onClick={() => onPress(direction)}
      aria-label={`Move ${direction}`}
    >
      {label}
    </Button>
  );
}

export function SnakeGame() {
  const [game, setGame] = useState(() => createInitialSnakeState());
  const queuedDirectionRef = useRef<Direction | undefined>(undefined);
  const isMobile = useIsMobile();
  const snakeSegments = new Map(game.snake.map((segment, index) => [`${segment.x}:${segment.y}`, index]));

  const queueDirection = useEffectEvent((direction: Direction) => {
    queuedDirectionRef.current = direction;

    setGame((current) => {
      if (current.status === 'idle') {
        return { ...current, status: 'running' };
      }

      return current;
    });
  });

  const restartGame = useEffectEvent(() => {
    queuedDirectionRef.current = undefined;
    setGame(createInitialSnakeState());
  });

  const togglePaused = useEffectEvent(() => {
    setGame((current) => {
      if (current.status === 'running') {
        return { ...current, status: 'paused' };
      }

      if (current.status === 'paused' || current.status === 'idle') {
        return { ...current, status: 'running' };
      }

      return current;
    });
  });

  const tick = useEffectEvent(() => {
    setGame((current) => {
      const nextState = advanceSnake(current, queuedDirectionRef.current);
      queuedDirectionRef.current = undefined;
      return nextState;
    });
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key.toLowerCase()];

      if (direction) {
        event.preventDefault();
        queueDirection(direction);
        return;
      }

      if (event.key === ' ') {
        event.preventDefault();

        if (game.status === 'game-over') {
          restartGame();
          return;
        }

        togglePaused();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.status, queueDirection, restartGame, togglePaused]);

  useEffect(() => {
    if (game.status !== 'running') {
      return;
    }

    const intervalId = window.setInterval(() => {
      tick();
    }, TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [game.status, tick]);

  return (
    <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Snake</CardTitle>
            <CardDescription>
              Use arrow keys or WASD to move. Press space to pause or resume.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={togglePaused}
              disabled={game.status === 'game-over'}
            >
              {game.status === 'running' ? <Pause /> : <Play />}
              {game.status === 'running'
                ? 'Pause'
                : game.status === 'paused'
                ? 'Resume'
                : 'Start'}
            </Button>
            <Button type="button" onClick={restartGame}>
              <RotateCcw />
              Restart
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="rounded-md border border-border/60 bg-background/80 px-3 py-2">
            Score: <span className="font-semibold">{game.score}</span>
          </div>
          <div className="rounded-md border border-border/60 bg-background/80 px-3 py-2 capitalize">
            Status: <span className="font-semibold">{game.status.replace('-', ' ')}</span>
          </div>
          <div className="rounded-md border border-border/60 bg-background/80 px-3 py-2">
            Grid: <span className="font-semibold">{GRID_SIZE} x {GRID_SIZE}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="mx-auto w-full max-w-[26rem]">
            <div
              className="grid aspect-square w-full rounded-2xl border border-border/60 bg-muted/30 p-2 shadow-inner"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
              aria-label="Snake game board"
              role="img"
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                const key = `${x}:${y}`;
                const snakeIndex = snakeSegments.get(key);
                const isHead = snakeIndex === 0;
                const isBody = snakeIndex !== undefined;
                const isFood = game.food?.x === x && game.food?.y === y;

                return (
                  <div
                    key={key}
                    className={cn(
                      'm-[1px] rounded-[4px] border border-border/20 bg-background/70',
                      isBody && 'border-emerald-600/50 bg-emerald-500/75',
                      isHead && 'border-emerald-700 bg-emerald-600',
                      isFood && 'border-rose-600/70 bg-rose-500',
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-4">
            <div className="rounded-xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Manual checks</p>
              <p>Confirm movement, growth on food pickup, wall and self collision game-over, pause, and restart.</p>
            </div>

            {game.status === 'game-over' && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
                Game over. Restart to play again.
              </div>
            )}

            {isMobile && (
              <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                <p className="mb-4 text-sm font-medium">Touch controls</p>
                <div className="grid w-fit grid-cols-3 gap-2">
                  <div />
                  <DirectionButton direction="up" label={<ArrowUp />} onPress={queueDirection} />
                  <div />
                  <DirectionButton direction="left" label={<ArrowLeft />} onPress={queueDirection} />
                  <DirectionButton direction="down" label={<ArrowDown />} onPress={queueDirection} />
                  <DirectionButton direction="right" label={<ArrowRight />} onPress={queueDirection} />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
