const CODE_TEMPLATES = {
    // ----------------------------------------------------------------
    // SORTING ALGORITHMS (Python, C, C++)
    // ----------------------------------------------------------------
    bubble: {
        py: `# Bubble Sort in Python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        c: `/* Bubble Sort in C */
#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
        cpp: `// Bubble Sort in C++
#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}`
    },
    selection: {
        py: `# Selection Sort in Python
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
        c: `/* Selection Sort in C */
#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
        cpp: `// Selection Sort in C++
#include <iostream>
#include <vector>

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) min_idx = j;
        }
        std::swap(arr[i], arr[min_idx]);
    }
}`
    },
    insertion: {
        py: `# Insertion Sort in Python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
        c: `/* Insertion Sort in C */
#include <stdio.size.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
        cpp: `// Insertion Sort in C++
#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
    },
    merge: {
        py: `# Merge Sort in Python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
        c: `/* Merge Sort in C */
#include <stdio.h>

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
        cpp: `// Merge Sort in C++
#include <iostream>
#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> L(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> R(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < L.size() && j < R.size()) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
    },
    quick: {
        py: `# Quick Sort in Python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x <= pivot]
    right = [x for x in arr[:-1] if x > pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)`,
        c: `/* Quick Sort in C */
#include <stdio.h>

void swap(int* a, int* b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        cpp: `// Quick Sort in C++
#include <iostream>
#include <vector>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
    },
    heap: {
        py: `# Heap Sort in Python
def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
    return arr`,
        c: `/* Heap Sort in C */
#include <stdio.h>

void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
        cpp: `// Heap Sort in C++
#include <iostream>
#include <vector>

void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`
    },

    // ----------------------------------------------------------------
    // GRAPH PATHFINDING ALGORITHMS (Python, C, C++)
    // ----------------------------------------------------------------
    dijkstra: {
        py: `# Dijkstra's Algorithm in Python
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        curr_dist, curr_node = heapq.heappop(pq)

        if curr_dist > distances[curr_node]:
            continue

        for neighbor, weight in graph[curr_node].items():
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances`,
        c: `/* Dijkstra's Algorithm in C */
#include <stdio.h>
#include <stdbool.h>

#define V 7
#define INF 999999

int minDistance(int dist[], bool visited[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++)
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool visited[V];
    for (int i = 0; i < V; i++) {
        dist[i] = INF;
        visited[i] = false;
    }
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        if (u == -1) break;
        visited[u] = true;
        for (int v = 0; v < V; v++)
            if (!visited[v] && graph[u][v] && dist[u] != INF 
                && dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }
}`,
        cpp: `// Dijkstra's Algorithm in C++
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>

using namespace std;

const int INF = 1e9;

unordered_map<char, int> dijkstra(
    unordered_map<char, vector<pair<char, int>>>& graph, 
    char start
) {
    unordered_map<char, int> dists;
    for (auto& pair : graph) dists[pair.first] = INF;
    dists[start] = 0;

    priority_queue<pair<int, char>, vector<pair<int, char>>, greater<pair<int, char>>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dists[u]) continue;

        for (auto& edge : graph[u]) {
            char v = edge.first;
            int w = edge.second;
            if (dists[u] + w < dists[v]) {
                dists[v] = dists[u] + w;
                pq.push({dists[v], v});
            }
        }
    }
    return dists;
}`
    },
    bellman: {
        py: `# Bellman-Ford Algorithm in Python
def bellman_ford(edges, num_vertices, start):
    distances = {i: float('inf') for i in range(num_vertices)}
    distances[start] = 0

    for _ in range(num_vertices - 1):
        for u, v, w in edges:
            if distances[u] != float('inf') and distances[u] + w < distances[v]:
                distances[v] = distances[u] + w

    for u, v, w in edges:
        if distances[u] != float('inf') and distances[u] + w < distances[v]:
            raise ValueError("Negative weight cycle detected!")

    return distances`,
        c: `/* Bellman-Ford Algorithm in C */
#include <stdio.h>
#define INF 999999

struct Edge {
    int u, v, w;
};

void bellmanFord(struct Edge edges[], int V, int E, int start) {
    int dist[V];
    for (int i = 0; i < V; i++) dist[i] = INF;
    dist[start] = 0;

    for (int i = 1; i <= V - 1; i++) {
        for (int j = 0; j < E; j++) {
            int u = edges[j].u;
            int v = edges[j].v;
            int w = edges[j].w;
            if (dist[u] != INF && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
        }
    }
}`,
        cpp: `// Bellman-Ford Algorithm in C++
#include <iostream>
#include <vector>

using namespace std;

struct Edge { int u, v, w; };
const int INF = 1e9;

vector<int> bellmanFord(vector<Edge>& edges, int V, int start) {
    vector<int> dist(V, INF);
    dist[start] = 0;

    for (int i = 1; i <= V - 1; ++i) {
        for (auto& edge : edges) {
            int u = edge.u, v = edge.v, w = edge.w;
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    return dist;
}`
    },
    floyd: {
        py: `# Floyd-Warshall Algorithm in Python
def floyd_warshall(matrix):
    V = len(matrix)
    dist = [row[:] for row in matrix]

    for k in range(V):
        for i in range(V):
            for j in range(V):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist`,
        c: `/* Floyd-Warshall Algorithm in C */
#include <stdio.h>
#define V 7
#define INF 999999

void floydWarshall(int graph[V][V]) {
    int dist[V][V];
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            dist[i][j] = graph[i][j];

    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
}`,
        cpp: `// Floyd-Warshall Algorithm in C++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int INF = 1e9;

void floydWarshall(vector<vector<int>>& dist) {
    int V = dist.size();
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
}`
    },

    // ----------------------------------------------------------------
    // BACKTRACKING ALGORITHMS (Python, C, C++)
    // ----------------------------------------------------------------
    nqueens: {
        py: `# N-Queens Solver in Python
def solve_nqueens(board, col, N):
    if col >= N:
        return True

    for i in range(N):
        if is_safe(board, i, col, N):
            board[i][col] = 1
            if solve_nqueens(board, col + 1, N):
                return True
            board[i][col] = 0 # Backtrack
    return False

def is_safe(board, row, col, N):
    for i in range(col):
        if board[row][i] == 1:
            return False
    for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False
    for i, j in zip(range(row, N), range(col, -1, -1)):
        if board[i][j] == 1:
            return False
    return True`,
        c: `/* N-Queens Solver in C */
#include <stdio.h>
#include <stdbool.h>

#define MAX_N 10

bool isSafe(int board[MAX_N][MAX_N], int row, int col, int N) {
    int i, j;
    for (i = 0; i < col; i++)
        if (board[row][i]) return false;
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j]) return false;
    for (i = row, j = col; j >= 0 && i < N; i++, j--)
        if (board[i][j]) return false;
    return true;
}

bool solveNQueens(int board[MAX_N][MAX_N], int col, int N) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(board, i, col, N)) {
            board[i][col] = 1;
            if (solveNQueens(board, col + 1, N)) return true;
            board[i][col] = 0; // Backtrack
        }
    }
    return false;
}`,
        cpp: `// N-Queens Solver in C++
#include <iostream>
#include <vector>

using namespace std;

bool isSafe(const vector<vector<int>>& board, int row, int col, int N) {
    for (int i = 0; i < col; i++)
        if (board[row][i]) return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j]) return false;
    for (int i = row, j = col; j >= 0 && i < N; i++, j--)
        if (board[i][j]) return false;
    return true;
}

bool solveNQueens(vector<vector<int>>& board, int col, int N) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(board, i, col, N)) {
            board[i][col] = 1;
            if (solveNQueens(board, col + 1, N)) return true;
            board[i][col] = 0; // Backtrack
        }
    }
    return false;
}`
    },
    coloring: {
        py: `# Graph Coloring Backtracking in Python
def graph_coloring(graph, m, colors, node_idx, V):
    if node_idx == V:
        return True

    for c in range(1, m + 1):
        if is_safe(node_idx, graph, colors, c):
            colors[node_idx] = c
            if graph_coloring(graph, m, colors, node_idx + 1, V):
                return True
            colors[node_idx] = 0 # Backtrack
    return False

def is_safe(node, graph, colors, c):
    for neighbor in graph[node]:
        if colors[neighbor] == c:
            return False
    return True`,
        c: `/* Graph Coloring Backtracking in C */
#include <stdio.h>
#include <stdbool.h>

#define V 6

bool isSafe(int v, bool graph[V][V], int color[], int c) {
    for (int i = 0; i < V; i++)
        if (graph[v][i] && c == color[i])
            return false;
    return true;
}

bool graphColoringUtil(bool graph[V][V], int m, int color[], int v) {
    if (v == V) return true;

    for (int c = 1; c <= m; c++) {
        if (isSafe(v, graph, color, c)) {
            color[v] = c;
            if (graphColoringUtil(graph, m, color, v + 1))
                return true;
            color[v] = 0; // Backtrack
        }
    }
    return false;
}`,
        cpp: `// Graph Coloring Backtracking in C++
#include <iostream>
#include <vector>

using namespace std;

bool isSafe(int u, const vector<vector<int>>& adj, const vector<int>& colors, int c) {
    for (int v : adj[u]) {
        if (colors[v] == c) return false;
    }
    return true;
}

bool graphColoring(const vector<vector<int>>& adj, int m, vector<int>& colors, int u) {
    int V = adj.size();
    if (u == V) return true;

    for (int c = 1; c <= m; c++) {
        if (isSafe(u, adj, colors, c)) {
            colors[u] = c;
            if (graphColoring(adj, m, colors, u + 1)) return true;
            colors[u] = 0; // Backtrack
        }
    }
    return false;
}`
    }
};
