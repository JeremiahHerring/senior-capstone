'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const BacktrackingPage = () => {
  const title = "Backtracking Algorithms";
  const description = `
Backtracking is a systematic method for solving constraint satisfaction problems.
It builds incrementally towards a solution and abandons partial solutions that fail to satisfy the constraints.
Examples include solving mazes, N-Queens, and generating permutations.
  `;
  const initialCode = `
// Example: Solving N-Queens Problem
function solveNQueens(n) {
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  const solutions = [];

  function isValid(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)] === 'Q') return false;
      if (col + (row - i) < n && board[i][col + (row - i)] === 'Q') return false;
    }
    return true;
  }

  function backtrack(row) {
    if (row === n) {
      solutions.push(board.map((row) => row.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (!isValid(row, col)) continue;
      board[row][col] = 'Q';
      backtrack(row + 1);
      board[row][col] = '.';
    }
  }

  backtrack(0);
  return solutions;
}

console.log(solveNQueens(4));
`;
  const language = "javascript";

  return (
    <DataStructurePage
      title={title}
      description={description}
      initialCode={initialCode}
      language={language}
    />
  );
};

export default BacktrackingPage;
