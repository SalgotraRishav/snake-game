import React, { useState, useEffect, useRef } from "react";
import useGameLogic from "./hooks/useGameLogic";
import GameBoard from "./components/GameBoard";
import GameControls from "./components/GameControls";
import { GRID_SIZE, INITIAL_SPEED } from "./utils/constants";

export default function SnakeGame() {
  const gameLogic = useGameLogic(GRID_SIZE, INITIAL_SPEED);
  const boardRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e) => {
      if (!touchStart) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
          const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
          window.dispatchEvent(event);
        } else if (dx < -30) {
          const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
          window.dispatchEvent(event);
        }
      } else {
        if (dy > 30) {
          const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
          window.dispatchEvent(event);
        } else if (dy < -30) {
          const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
          window.dispatchEvent(event);
        }
      }
      setTouchStart(null);
    };

    const board = boardRef.current;
    if (board) {
      board.addEventListener('touchstart', handleTouchStart);
      board.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      if (board) {
        board.removeEventListener('touchstart', handleTouchStart);
        board.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [touchStart]);

  return (
    <div className="game-container" style={{ position: "relative" }}>
      {/* Popup message positioned above board, overlay style; does not displace layout */}
      {gameLogic.showMessage && (
        <div className="popup-msg">{gameLogic.message}</div>
      )}
      <GameControls {...gameLogic} />
      <div ref={boardRef}>
        <GameBoard
          snake={gameLogic.snake}
          food={gameLogic.food}
          gameOver={gameLogic.gameOver}
          GRID_SIZE={GRID_SIZE}
        />
      </div>
    </div>
  );
}
