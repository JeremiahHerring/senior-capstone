'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const SortingPage = () => {
  const title = "Sorting Algorithms";
  const description = `
Sorting algorithms are fundamental in computer science and are used to arrange data in a specific order.
Examples include Bubble Sort, Quick Sort, Merge Sort, and more.
Sorting optimizes searching and data organization and is a key part of many applications.
  `;
  const initialCode = `
// Example: Bubble Sort
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Test the function
const arr = [5, 2, 9, 1, 5, 6];
console.log(bubbleSort(arr)); // [1, 2, 5, 5, 6, 9]
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

export default SortingPage;
