'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const SlidingWindowPage = () => {
  const title = "Sliding Window Technique";
  const description = `
The Sliding Window technique is used to optimize problems involving arrays or strings.
It maintains a window of elements and slides it across the data to solve problems efficiently.
Examples include finding the maximum sum of subarrays and longest substrings.
  `;
  const initialCode = `
// Example: Maximum Sum of Subarray of Size K
function maxSubarraySum(arr, k) {
  let maxSum = 0;
  let currentSum = 0;

  for (let i = 0; i < k; i++) {
    currentSum += arr[i];
  }
  maxSum = currentSum;

  for (let i = k; i < arr.length; i++) {
    currentSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// Test the function
console.log(maxSubarraySum([2, 1, 5, 1, 3, 2], 3)); // 9
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

export default SlidingWindowPage;
