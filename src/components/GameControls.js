import React from "react";

export default function GameControls({ 
  score, 
  highScore, 
  paused, 
  gameOver, 
  togglePause, 
  resetGame, 
  speedLevel, 
  setSpeedLevel 
}) {
  return (
    <div className="controls-panel">
      <div className="game-header">
        <h1>🐍 Snake Game</h1>
        <p className="hint">Use arrow keys or swipe to move • Space to pause</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-label">Score</div>
          <div className="stat-value">{score}</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-label">High Score</div>
          <div className="stat-value">{highScore}</div>
        </div>
      </div>

      {paused && !gameOver && (
        <div className="status-badge paused">⏸️ Paused</div>
      )}
      
      {gameOver && (
        <div className="status-badge game-over">💀 Game Over!</div>
      )}

      <div className="speed-control">
        <label>
          <span>Speed</span>
          <span className="speed-value">Level {speedLevel}</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={speedLevel}
          onChange={(e) => setSpeedLevel(Number(e.target.value))}
          className="speed-slider"
        />
      </div>

      <button className="restart-btn" onClick={resetGame}>
        {gameOver ? '🔄 Play Again' : '🔄 Restart Game'}
      </button>
    </div>
  );
}