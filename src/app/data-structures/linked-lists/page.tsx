'use client';
import React from "react";
import DataStructurePage from "../../components/DSAPage";

const LinkedListsPage = () => {
  const title = "Linked Lists";
  const description = `
Linked Lists are linear data structures where each element (node) contains data and a reference (or pointer) to the next node.
They are dynamic in nature and allow efficient insertion and deletion.
Applications include implementing stacks, queues, and adjacency lists for graphs.
  `;
  const initialCode = `
// Example: Singly Linked List Implementation
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  display() {
    let current = this.head;
    while (current) {
      process.stdout.write(current.value + " -> ");
      current = current.next;
    }
    console.log("null");
  }
}

// Test the LinkedList
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.display(); // Output: 1 -> 2 -> 3 -> null
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

export default LinkedListsPage;
