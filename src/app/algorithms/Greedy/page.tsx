'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const GreedyPage = () => {
  const title = "Greedy Algorithms";
  const description = `
Greedy algorithms build up a solution step by step, always choosing the step that offers the most immediate benefit.
Examples include activity selection, coin change, and Kruskal's algorithm for minimum spanning trees.
  `;
  const initialCode = `
// Example: Coin Change Problem
function minCoins(coins, amount) {
  coins.sort((a, b) => b - a);
  let count = 0;

  for (const coin of coins) {
    while (amount >= coin) {
      amount -= coin;
      count++;
    }
  }

  return amount === 0 ? count : -1; // Return -1 if no solution
}

// Test the function
console.log(minCoins([1, 5, 10, 25], 63)); // 6
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

export default GreedyPage;
