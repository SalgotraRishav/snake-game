import React from "react";
import SnakeCell from "./SnakeCell";
import FoodCell from "./FoodCell";

export default function GameBoard({ snake, food, gameOver, GRID_SIZE }) {
  return (
    <div className={`board ${gameOver ? 'game-over' : ''}`}>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);

        const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
        const isSnake = snakeIndex !== -1;
        const isHead = snakeIndex === 0;
        const isFood = food.x === x && food.y === y;
        const isDead = gameOver && isHead;

        if (isSnake) {
          return <SnakeCell key={i} isHead={isHead} isDead={isDead} />;
        }

        if (isFood) {
          return <FoodCell key={i} emoji={food.emoji} fadeOut={food.fadeOut} />;
        }

        return <div key={i} className="empty-cell" />;
      })}
    </div>
  );
}
