'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const BFSPage = () => {
  const title = "Breadth-First Search (BFS)";
  const description = `
Breadth-First Search is an algorithm for traversing or searching tree or graph data structures.
It explores all neighbors at the current depth before moving on to nodes at the next depth level.
  `;
  const initialCode = `
// Example: BFS on a Graph
function bfs(graph, start) {
  const queue = [start];
  const visited = new Set();

  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    console.log(node); // Process node
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
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

bfs(graph, 'A');
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

export default BFSPage;
