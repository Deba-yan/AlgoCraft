# 🚀 AlgoCraft - Interactive Algorithm Visualizer

<p align="center">
  <img src="https://img.shields.io/badge/HTML--orange?style=for-the-badge&logo=html5">
  <img src="https://img.shields.io/badge/CSS--blue?style=for-the-badge&logo=css">
  <img src="https://img.shields.io/badge/JavaScript--yellow?style=for-the-badge&logo=javascript">
  <img src="https://img.shields.io/badge/C++-Algorithms-blue?style=for-the-badge&logo=cplusplus">
  <img src="https://img.shields.io/badge/Python-Server-green?style=for-the-badge&logo=python">
</p>

<p align="center">
An interactive platform to learn, visualize, and understand popular Data Structures & Algorithms through beautiful animations, real-time execution, and code templates.
</p>

---

## 🌐 Live Demo

👉 [AlgoCraft](https://deba-yan.github.io/AlgoCraft/)

---

# ✨ Features

- 🎨 Modern Dark UI
- 📱 Fully Responsive Design
- ⚡ Smooth Algorithm Animations
- 📊 Step-by-Step Visualization
- 💻 Ready-to-use C, C++ and Python Code
- 📋 One Click Copy Code
- 🗺️ Interactive Pathfinding Map
- ♟️ Backtracking Visualizations
- ⌨️ Typewriter Animation
- 🚀 Fast and Lightweight

---

# 📚 Algorithms Covered

## 🔹(i) Sorting Algorithms

The sorting visualizer shows how elements move during sorting with animated bars.

### 1.Bubble Sort
Repeatedly compares adjacent elements and swaps them if they are in the wrong order.

**Time Complexity**

| Best | Average | Worst |
|------|---------|-------|
| O(n) | O(n²) | O(n²) |

---

### 2.Selection Sort

Finds the smallest element and places it at its correct position one by one.

**Time Complexity**

| Best | Average | Worst |
|------|---------|-------|
| O(n²) | O(n²) | O(n²) |

---

### 3.Insertion Sort

Builds the sorted array one element at a time by inserting elements into their proper position.

**Time Complexity**

| Best | Average | Worst |
|------|---------|-------|
| O(n) | O(n²) | O(n²) |

---

### 4.Merge Sort

Uses Divide and Conquer by recursively splitting the array and merging sorted halves.

**Time Complexity**

| Best | Average | Worst |
|------|---------|-------|
| O(n log n) | O(n log n) | O(n log n) |

---

### 5.Quick Sort

Chooses a pivot element and partitions the array into smaller and larger values.

**Time Complexity**

| Best | Average | Worst |
|------|---------|-------|
| O(n log n) | O(n log n) | O(n²) |

---


### 6.Heap Sort

Builds a Binary Heap from the input array and repeatedly extracts the maximum (or minimum) element to produce a sorted array.

**How it Works**

1. Build a Max Heap from the array.
2. Swap the root (largest element) with the last element.
3. Reduce the heap size by one.
4. Heapify the root to maintain the heap property.
5. Repeat until the array is sorted.

**Time Complexity**

| Best | Average | Worst |
|------|---------|-------|
| O(n log n) | O(n log n) | O(n log n) |

## 🔹(ii) Graph Algorithms

### 1.Dijkstra's Algorithm

Finds the shortest path from a source vertex to every other vertex in a weighted graph.

Applications

- GPS Navigation
- Network Routing
- Delivery Optimization

Time Complexity

```
O((V + E) log V)
```

---

### 2.Breadth First Search (BFS)

Explores vertices level by level using a queue.

Applications

- Shortest Path (Unweighted Graph)
- Social Networks
- Web Crawling

Time Complexity

```
O(V + E)
```

---

### 3.Depth First Search (DFS)

Traverses graph deeply before backtracking.

Applications

- Cycle Detection
- Topological Sorting
- Connected Components

Time Complexity

```
O(V + E)
```

---

## 🔹 (iii) Backtracking Algorithms

### 1.N-Queens Problem

Places N queens on a chessboard so that no two queens attack each other.

Visualization includes

- Safe Position Checking
- Queen Placement
- Backtracking
- Final Solution

Time Complexity

```
O(N!)
```

---

### 2.Graph Coloring

Assigns colors to graph vertices so that no adjacent vertices have the same color.

Visualization includes

- Color Assignment
- Conflict Detection
- Backtracking
- Minimum Valid Coloring

Applications

- Scheduling
- Register Allocation
- Map Coloring

---

# 💻 Code Templates

Every algorithm provides implementation in

- C
- C++
- Python

Features

- Syntax Highlighting
- Copy Button
- Easy Learning
- Beginner Friendly

---

# 🗂️ Project Structure

```
algo-visualizer/
│
├── index.html
│   Main webpage layout and UI structure
│
├── style.css
│   Dark theme styling, animations, responsive layout, and component design
│
├── server.py
│   Lightweight Python HTTP server used for running the project locally
│
├── algorithms.cpp
│   C++ implementations of the algorithms used as backend references
│
└── js/
    │
    ├── main.js
    │   Controls navigation, tab switching, typewriter effect,
    │   copy-to-clipboard functionality, and UI interactions
    │
    ├── sorting.js
    │   Handles sorting algorithm animations including Bubble,
    │   Selection, Insertion, Merge, and Quick Sort
    │
    ├── graphs.js
    │   Implements graph visualizations, shortest path algorithms,
    │   and interactive Indian city map pathfinding
    │
    ├── backtracking.js
    │   Contains visualizers for N-Queens and Graph Coloring
    │   using recursive backtracking
    │
    └── code_templates.js
        Stores C, C++, and Python implementations displayed
        inside the code viewer
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/algo-visualizer.git
```

## Enter Folder

```bash
cd algo-visualizer
```

## Run Python Server

```bash
python server.py
```

or

```bash
python3 server.py
```

Open your browser and visit

```
http://localhost:8000
```

---

# 🎯 Educational Objectives

This project helps students understand

- Sorting Algorithms
- Graph Algorithms
- Backtracking Techniques
- Time Complexity
- Algorithm Visualization
- Code Implementation
- Data Structure Fundamentals

---

# 🛠️ Built With

- HTML5
- CSS
- JavaScript
- C++
- Python



---

# ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub to support future development.

---

# 👨‍💻 Author

[Debayan Kundu](https://github.com/deba-yan)



---

<p align="center">
Made with ❤️ to make Algorithms easier to understand through visualization.
</p>
