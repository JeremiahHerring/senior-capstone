'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const HashmapsPage = () => {
  const title = "Hashmaps";
  const description = `
Hashmaps (or Hash Tables) are a data structure that store key-value pairs.
They provide efficient lookup, insertion, and deletion operations.
Applications include caching, counting frequencies, and database indexing.
  `;
  const initialCode = `
// Example: Counting Frequencies of Elements
function countFrequencies(arr) {
  const hashmap = {};

  for (const num of arr) {
    hashmap[num] = (hashmap[num] || 0) + 1;
  }

  return hashmap;
}

// Test the function
console.log(countFrequencies([1, 2, 2, 3, 3, 3])); 
// Output: { '1': 1, '2': 2, '3': 3 }
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

export default HashmapsPage;
