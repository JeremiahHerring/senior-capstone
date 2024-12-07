'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const DFSPage = () => {
  const title = "Depth-First Search (DFS)";
  const description = `
Depth-First Search is an algorithm for traversing or searching tree or graph data structures.
It starts at the root (or any arbitrary node) and explores as far as possible along each branch before backtracking.
  `;
  const initialCode = `
// Example: DFS on a Graph
function dfs(graph, start, visited = new Set()) {
  if (visited.has(start)) return;
  visited.add(start);
  console.log(start); // Process node
  for (const neighbor of graph[start]) {
    dfs(graph, neighbor, visited);
  }
}

// Test the function
const graph = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F'],
  D: [],
  E: ['F'],
  F: []
};

dfs(graph, 'A');
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

export default DFSPage;
