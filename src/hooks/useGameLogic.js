import { useState, useEffect, useRef } from "react";

const FRUITS = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍍"];

const FUNNY_MESSAGES = [
  "Nom nom nom! 🤤",
  "Yummy in my tummy! 😋",
  "Snake got gains! 💪",
  "Delicious! 🎉",
  "Om nom nom! 🐍",
  "Tasty snack! ✨",
  "More please! 🙏",
  "Slithering success! 🌟",
  "Snake level up! ⬆️",
  "Fruit ninja mode! 🥷",
  "Ssssensational! 🔥",
  "Hungry no more! 😎",
  "Vitamin boost! 💊",
  "Health +1! ❤️",
  "Growing strong! 🌱"
];

const MILESTONE_MESSAGES = {
  5: "5 points! You're warming up! 🔥",
  10: "Double digits! Nice! 🎯",
  15: "15 points! You're on fire! 🚀",
  20: "20 points! Snake master! 👑",
  25: "Quarter century! Legendary! ⭐",
  30: "30 points! Unstoppable! 💥",
  50: "FIFTY! You're a snake god! 🐉"
};

export default function useGameLogic(GRID_SIZE, INITIAL_SPEED = 5) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5, emoji: "🍎", fadeOut: false });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speedLevel, setSpeedLevel] = useState(INITIAL_SPEED);
  const [speed, setSpeed] = useState(500 - (INITIAL_SPEED - 1) * 50);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      const stored = localStorage.getItem("snakeHighScore");
      return stored ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  const dirRef = useRef(direction);
  const speedRef = useRef(speed);
  const snakeRef = useRef(snake);

  const togglePause = () => setPaused((prev) => !prev);

  useEffect(() => { dirRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { setSpeed(500 - (speedLevel - 1) * 50); }, [speedLevel]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const relocateFood = () => {
    let newX, newY, valid;
    do {
      newX = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      newY = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      valid = !snakeRef.current.some(segment => segment.x === newX && segment.y === newY);
    } while (!valid);

    setFood({
      x: newX,
      y: newY,
      emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
      fadeOut: false
    });
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => { setShowMessage(false); }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      let updated = false;
      switch (e.key) {
        case "ArrowUp": if (dirRef.current.y !== 1) { setDirection({ x: 0, y: -1 }); updated = true; } break;
        case "ArrowDown": if (dirRef.current.y !== -1) { setDirection({ x: 0, y: 1 }); updated = true; } break;
        case "ArrowLeft": if (dirRef.current.x !== 1) { setDirection({ x: -1, y: 0 }); updated = true; } break;
        case "ArrowRight": if (dirRef.current.x !== -1) { setDirection({ x: 1, y: 0 }); updated = true; } break;
        case " ":
          e.preventDefault();
          if (gameOver) resetGame();
          else togglePause();
          break;
        default: break;
      }
      if (updated && !gameOver && !paused) moveSnakeImmediate();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, paused]);

  useEffect(() => {
    if (gameOver || paused) return;
    const interval = setInterval(moveSnake, speedRef.current);
    return () => clearInterval(interval);
  });

  const moveSnake = () => moveSnakeInternal(dirRef.current, snakeRef.current);
  const moveSnakeImmediate = () => moveSnakeInternal(dirRef.current, snakeRef.current);

  const moveSnakeInternal = (dir, currentSnake) => {
    const newSnake = [...currentSnake];
    const head = { x: newSnake[0].x + dir.x, y: newSnake[0].y + dir.y };

    // ✅ Fixed wall collision: allow last block, end game only if outside
    if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) {
      endGame();
      return;
    }

    const selfHit = newSnake.find(s => s.x === head.x && s.y === head.y);
    if (selfHit) { endGame(); return; }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      const newScore = score + 1;
      setScore(newScore);

      if (MILESTONE_MESSAGES[newScore]) displayMessage(MILESTONE_MESSAGES[newScore]);
      else displayMessage(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);

      relocateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      displayMessage("🎉 NEW HIGH SCORE! 🎉");
      try { localStorage.setItem("snakeHighScore", score.toString()); } catch {}
    } else {
      displayMessage("💀 Oops! Better luck next time! 💀");
    }
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5, emoji: "🍎", fadeOut: false });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setSpeedLevel(INITIAL_SPEED);
    setShowMessage(false);
    relocateFood();
  };

  return {
    snake,
    food,
    score,
    highScore,
    gameOver,
    paused,
    togglePause,
    resetGame,
    speedLevel,
    setSpeedLevel,
    message,
    showMessage
  };
}
