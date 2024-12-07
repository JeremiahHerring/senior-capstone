'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const DynamicProgrammingPage = () => {
  const title = "Dynamic Programming";
  const description = `
Dynamic Programming is a technique for solving problems by breaking them down into smaller overlapping subproblems.
It stores the results of subproblems to avoid redundant computation.
Examples include the Fibonacci sequence, knapsack problem, and more.
  `;
  const initialCode = `
// Example: Fibonacci Sequence using Dynamic Programming
function fibonacci(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Test the function
console.log(fibonacci(10)); // 55
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

export default DynamicProgrammingPage;
