'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const GraphsPage = () => {
  const title = "Graphs";
  const description = `
Graphs are a versatile data structure that represent relationships between objects.
They consist of vertices (nodes) connected by edges and can be directed or undirected.
Applications include social networks, shortest path algorithms, and network routing.
  `;
  const initialCode = `
// Example: Adjacency List Representation of a Graph
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1); // For undirected graph
  }

  display() {
    for (const vertex in this.adjacencyList) {
      console.log(vertex, "->", this.adjacencyList[vertex].join(", "));
    }
  }
}

// Test the Graph
const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "C");
graph.display();
// Output:
// A -> B, C
// B -> A, C
// C -> A, B
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

export default GraphsPage;
