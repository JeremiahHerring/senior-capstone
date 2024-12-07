'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const RecursionPage = () => {
  const title = "Recursion";
  const description = `
Recursion is a method where a function calls itself to solve a problem.
It is useful for problems like tree traversals, factorial calculation, and backtracking algorithms.
  `;
  const initialCode = `
// Example: Factorial Calculation
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// Test the function
console.log(factorial(5)); // 120
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

export default RecursionPage;
