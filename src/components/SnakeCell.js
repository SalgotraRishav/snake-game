import React from "react";

export default function SnakeCell({ isHead, isDead }) {
  return (
    <div className={`snake-cell ${isHead ? 'head' : ''} ${isDead ? 'dead' : ''}`}>
      {isHead && !isDead && (
        <div className="eyes">
          <div className="eye"></div>
          <div className="eye"></div>
        </div>
      )}
    </div>
  );
}