import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), moveLocation: null}]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [isReversed, setIsReversed] = useState(false);

  function handlePlay(nextState) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextState];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reverseOrder() {
    setIsReversed(!isReversed);
  }

  const moves = history.map((step, move) => {
    const { moveLocation } = step;
    let description;
    if (move > 0) {
      description = `Go to move #${move} (${moveLocation.row}, ${moveLocation.col})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
      {move === currentMove ? (
        move === 0 ? (
          <span>No moves have been made</span>
        ) : (
          <span>You are at move #{move} ({moveLocation.row}, {moveLocation.col})</span>
        )
      ) : (
        <button onClick={() => jumpTo(move)}>{description}</button>
      )}
    </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="reverse-order" onClick={reverseOrder}>Toggle Moves</button>
        <ol>{isReversed ? [...moves].reverse() : moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
  const row = Math.floor(i / 3);
  const col = i % 3;

    onPlay({ squares: nextSquares, moveLocation: { row, col } });
  }
  
  const result = calculateWinner(squares);
  const winningLine = result?.line;
  const winner = result?.winner;

  let status;
  if (result) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [];

  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      rowSquares.push(
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          className = {winningLine && winningLine.includes(i) ? "square-winner" : "square"}
        />
      );
    }
    board.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: lines[i]};
    }
  }
  return null;
}

