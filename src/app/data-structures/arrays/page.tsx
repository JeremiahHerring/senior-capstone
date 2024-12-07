'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const ArraysPage = () => {
  const title = "Arrays";
  const description = `
Arrays are a fundamental data structure used to store elements in contiguous memory locations.
They allow random access and are used in a variety of applications.
Examples include finding the maximum element, searching, and sorting.
  `;
  const initialCode = `
// Example: Find Maximum Element in an Array
function findMax(arr) {
  return Math.max(...arr);
}

// Test the function
console.log(findMax([1, 5, 3, 9, 2])); // 9
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

export default ArraysPage;
