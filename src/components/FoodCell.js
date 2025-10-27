import React from "react";

export default function FoodCell({ emoji, fadeOut }) {
  return (
    <div className={`food-cell ${fadeOut ? 'fade-out' : ''}`}>
      <div className="food-emoji">{emoji}</div>
    </div>
  );
}
