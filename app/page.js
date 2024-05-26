'use client'
import React, { useState, useEffect } from "react";

export default function Home() {
  let rows = 10;
  let cols = 20;


  const getRandomPosition = () => ({
    row: Math.floor(Math.random() * rows),
    col: Math.floor(Math.random() * cols),
  });

  const [snake, setSnake] = useState([
    { row: 7, col: 5 },
    { row: 7, col: 4 },
    { row: 7, col: 3 },
    { row: 7, col: 2 },
  ]);
  const [direction, setDirection] = useState({ row: 0, col: 1 });
  const [food, setFood] = useState(getRandomPosition());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);




  useEffect(() => {
    const handleDirection = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection({ row: -1, col: 0 });
          break;
        case 'ArrowDown':
          setDirection({ row: 1, col: 0 });
          break;
        case 'ArrowLeft':
          setDirection({ row: 0, col: -1 });
          break;
        case 'ArrowRight':
          setDirection({ row: 0, col: 1 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleDirection);
    return () => window.removeEventListener('keydown', handleDirection);
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = {
          row: (prev[0].row + direction.row + rows) % rows,
          col: (prev[0].col + direction.col + cols) % cols,
        };

        if (prev.some(segment => segment.row === newHead.row && segment.col === newHead.col)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        if (newHead.row === food.row && newHead.col === food.col) {
          setScore(score + 10);
          generateFood();
          return [newHead, ...prev];
        }

        return [newHead, ...prev.slice(0, -1)];
      });
    }, 200);

    return () => clearInterval(interval);
  }, [running, direction, food, gameOver]);

  const generateFood = () => {
    let newFoodPosition;
    do {
      newFoodPosition = getRandomPosition();
    } while (snake.some(segment => segment.row === newFoodPosition.row && segment.col === newFoodPosition.col));
    setFood(newFoodPosition);
  };

  const createBoard = () => {
    let board = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        const isSnake = snake.some(data => data.row === i && data.col === j);
        const isFood = food.row === i && food.col === j;
        row.push(
          <div
            key={`${i}-${j}`}
            className={`cell ${isSnake ? 'snake' : isFood ? 'food' : ''}`}
          ></div>
        );
      }
      board.push(
        <div key={i} className="row">
          {row}
        </div>
      );
    }
    return board;
  };

  const handleStartStop = () => {
    if (gameOver) {
      setGameOver(false);
      setSnake([
        { row: 7, col: 5 },
        { row: 7, col: 4 },
        { row: 7, col: 3 },
        { row: 7, col: 2 },
      ]);
      setScore(0);
      setDirection({ row: 0, col: 1 });
      setFood(getRandomPosition());
    }
    setRunning(!running);
  };

  return (
    <div>
      <div className="gameScreen">{createBoard()}</div>
      <div className="justify-center flex mx-5 ">
        <span className={`${running ? 'bg-red-600 px-7 py-3 font-bold' : 'font-bold bg-green-700 px-7 py-3'}`} onClick={handleStartStop}>
          {running ? 'Stop' : 'Start'}
        </span>
      </div>
      {gameOver && (
        <div className="text-center font-bold text-5xl mt-6  text-yellow-700">
          Game Over..! Your score is : {score}
        </div>
      )}
    </div>
  );
};
