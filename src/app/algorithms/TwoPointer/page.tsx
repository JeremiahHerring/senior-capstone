'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";
import twoPointerImage1 from "../assets/two-pointer1.png";
import twoPointerImage2 from "../assets/two-pointer2.png";

const TwoPointerPage = () => {
  const title = "Two Pointer Technique";
  
  const description = `
The **Two Pointer** technique is a powerful approach used to solve various problems involving arrays, linked lists, and more.
It involves using two pointers that move through the data structure at different speeds or in different directions to achieve optimal performance.
Common applications include finding pairs that sum to a target, reversing linked lists, and more.
  `;

  const initialCode = `
// Example: Find if there exists two numbers that add up to a target
function hasTwoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while(left < right) {
    const sum = arr[left] + arr[right];
    if(sum === target) return true;
    if(sum < target) left++;
    else right--;
  }
  return false;
}

// Test the function
const arr = [1, 2, 3, 4, 6];
const target = 6;
console.log(hasTwoSum(arr, target)); // true
`;

  const language = "javascript";

  // const images = [twoPointerImage1, twoPointerImage2];

  return (
    <DataStructurePage
      title={title}
      description={description}
      initialCode={initialCode}
      language={language}
      //images={images}
    />
  );
};

export default TwoPointerPage;
