import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';
import { Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const GAME_SPEED = 120;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const directionRef = useRef(INITIAL_DIRECTION);
  const lastProcessedDirectionRef = useRef(INITIAL_DIRECTION);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused(p => !p);
      return;
    }

    const currentDir = lastProcessedDirectionRef.current;
    let newDir = directionRef.current;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
        break;
    }
    directionRef.current = newDir;
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        lastProcessedDirectionRef.current = currentDir;

        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            setHighScore(hs => Math.max(hs, newScore));
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Board */}
      <div className="flex gap-12 text-cyan-400 font-digital text-6xl tracking-widest glitch-text border-4 border-fuchsia-500 p-4 bg-black w-full justify-center">
        <div className="flex items-center gap-3">
          <span>OBJ:</span>
          <span className="text-fuchsia-500">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white">MAX:</span>
          <span className="text-white">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black border-4 border-cyan-400 overflow-hidden"
        style={{
          width: GRID_SIZE * 20,
          height: GRID_SIZE * 20,
        }}
      >
        {/* Grid Lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 animate-pulse"
          style={{
            width: 20,
            height: 20,
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-white z-10' : 'bg-cyan-400'}`}
              style={{
                width: 20,
                height: 20,
                left: segment.x * 20,
                top: segment.y * 20,
              }}
            />
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20 border-8 border-fuchsia-500">
            <h2 className="text-6xl font-black text-fuchsia-500 mb-8 glitch-text text-center leading-none">
              FATAL_ERR<br/>0x000000
            </h2>
            <button
              onClick={resetGame}
              className="flex items-center gap-4 px-8 py-4 bg-black border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors text-3xl font-digital"
            >
              <RefreshCw size={28} />
              EXEC_REBOOT
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 border-4 border-cyan-400">
            <h2 className="text-7xl font-bold text-cyan-400 glitch-text-slow">
              HALTED
            </h2>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="text-fuchsia-500 font-digital text-2xl tracking-widest text-center border-t-4 border-b-4 border-cyan-400 py-3 w-full bg-black">
        <p>&gt; INPUT: W_A_S_D || ARROWS</p>
        <p>&gt; INTERRUPT: SPACEBAR</p>
      </div>
    </div>
  );
}
