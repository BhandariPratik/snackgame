'use client'
import React, { useState, useEffect } from "react";

export default function Home() {
 
 let rows = 10;
  let cols = 20;

 
  const [snake, setSnake] = useState([
    { row: 7, col: 5 },
    { row: 7, col: 4 },
    { row: 7, col: 3 },
    { row: 7, col: 2 },
  ]);

  console.log('snake position==>', snake)

  const [direction, setDirection] = useState({ row: 0, col: 1 });
  const [food, setFood] = useState({ row: '', col: '' });
  console.log('food==>>>==>', food)
  const [score, setScore] = useState(0);
  console.log('score===>', score)
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
 
  const getRandomPosition = () => (
    {
   row: Math.floor(Math.random() * rows),
   col: Math.floor(Math.random() * cols),
 });


  const generateFood = () => {
    let newFoodPosition;
    do {
      newFoodPosition = getRandomPosition();
    } while (snake.some(para => para.row === newFoodPosition.row && para.col === newFoodPosition.col));
    setFood(newFoodPosition);
  }

  
  useEffect(() => {

    generateFood();

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
        const snakeposition = {
          row: (prev[0].row + direction.row + rows) % rows,
          col: (prev[0].col + direction.col + cols) % cols,
        };

        if (prev.some(para => para.row === snakeposition.row && para.col === snakeposition.col)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        if (snakeposition.row === food.row && snakeposition.col === food.col) {
          setScore(score + 10);
          generateFood();
          return [snakeposition, ...prev];
        }

        return [snakeposition, ...prev.slice(0, -1)];
      });
    }, 200);

    return () => clearInterval(interval);
  }, [running, direction, food, gameOver]);


  const createBoard = () => {
    let board = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        let isSnake = snake.some(data => data.row === i && data.col === j);
        let isFood = food.row === i && food.col === j;
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
      generateFood();
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
