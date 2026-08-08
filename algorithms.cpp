#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <unordered_map>
#include <queue>
#include <set>

using namespace std;


vector<int> parseCSV(const string& str) {
    vector<int> result;
    stringstream ss(str);
    string token;
    while (getline(ss, token, ',')) {
        if (!token.empty()) {
            try {
                result.push_back(stoi(token));
            } catch (...) {}
        }
    }
    return result;
}

// --------------------------------------------------------------------
// SORTING ALGORITHMS
// --------------------------------------------------------------------
struct SortingVisualizer {
    vector<int> arr;

    SortingVisualizer(const vector<int>& input) : arr(input) {}

    void printState(const string& type, int i = -1, int j = -1, int val_i = -1, int val_j = -1) {
        cout << "{\"type\":\"" << type << "\",\"i\":" << i << ",\"j\":" << j
             << ",\"val_i\":" << val_i << ",\"val_j\":" << val_j << "}" << endl;
    }

    void bubbleSort() {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                printState("compare", j, j + 1, arr[j], arr[j + 1]);
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    printState("swap", j, j + 1, arr[j], arr[j + 1]);
                }
            }
            printState("sorted", n - i - 1, -1, arr[n - i - 1]);
        }
        printState("sorted", 0, -1, arr[0]);
    }

    void selectionSort() {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            printState("pivot", minIdx, -1, arr[minIdx]);
            for (int j = i + 1; j < n; j++) {
                printState("compare", j, minIdx, arr[j], arr[minIdx]);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    printState("pivot", minIdx, -1, arr[minIdx]);
                }
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
                printState("swap", i, minIdx, arr[i], arr[minIdx]);
            }
            printState("sorted", i, -1, arr[i]);
        }
        printState("sorted", n - 1, -1, arr[n - 1]);
    }

    void insertionSort() {
        int n = arr.size();
        printState("sorted", 0, -1, arr[0]);
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            printState("compare", i, j, key, arr[j]);
            while (j >= 0 && arr[j] > key) {
                printState("compare", j, j + 1, arr[j], key);
                arr[j + 1] = arr[j];
                printState("set", j + 1, -1, arr[j + 1]);
                j--;
            }
            arr[j + 1] = key;
            printState("set", j + 1, -1, key);
            for (int k = 0; k <= i; k++) {
                printState("sorted", k, -1, arr[k]);
            }
        }
    }

    void merge(int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        vector<int> L(n1), R(n2);
        for (int i = 0; i < n1; i++) L[i] = arr[l + i];
        for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            printState("compare", l + i, m + 1 + j, L[i], R[j]);
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                printState("set", k, -1, arr[k]);
                i++;
            } else {
                arr[k] = R[j];
                printState("set", k, -1, arr[k]);
                j++;
            }
            k++;
        }
        while (i < n1) {
            arr[k] = L[i];
            printState("set", k, -1, arr[k]);
            i++;
            k++;
        }
        while (j < n2) {
            arr[k] = R[j];
            printState("set", k, -1, arr[k]);
            j++;
            k++;
        }
    }

    void mergeSort(int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(l, m);
        mergeSort(m + 1, r);
        merge(l, m, r);
    }

    int partition(int low, int high) {
        int pivot = arr[high];
        printState("pivot", high, -1, pivot);
        int i = low - 1;
        for (int j = low; j < high; j++) {
            printState("compare", j, high, arr[j], pivot);
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                printState("swap", i, j, arr[i], arr[j]);
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        printState("swap", i + 1, high, arr[i + 1], arr[high]);
        printState("sorted", i + 1, -1, arr[i + 1]);
        return i + 1;
    }

    void quickSort(int low, int high) {
        if (low < high) {
            int pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        } else if (low == high) {
            printState("sorted", low, -1, arr[low]);
        }
    }

    void heapify(int n, int i) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;

        if (l < n) {
            printState("compare", l, largest, arr[l], arr[largest]);
            if (arr[l] > arr[largest]) largest = l;
        }
        if (r < n) {
            printState("compare", r, largest, arr[r], arr[largest]);
            if (arr[r] > arr[largest]) largest = r;
        }

        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            printState("swap", i, largest, arr[i], arr[largest]);
            heapify(n, largest);
        }
    }

    void heapSort() {
        int n = arr.size();
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(n, i);
        }
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            printState("swap", 0, i, arr[0], arr[i]);
            printState("sorted", i, -1, arr[i]);
            heapify(i, 0);
        }
        printState("sorted", 0, -1, arr[0]);
    }
};

// --------------------------------------------------------------------
// GRAPH ALGORITHMS (INDIAN CITIES)
// --------------------------------------------------------------------
struct Edge {
    string u, v;
    int w;
};

const vector<string> NODES = {"Delhi", "Jaipur", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata"};
const vector<Edge> EDGES = {
    {"Delhi", "Jaipur", 3},
    {"Delhi", "Kolkata", 14},
    {"Delhi", "Hyderabad", 12},
    {"Jaipur", "Mumbai", 11},
    {"Mumbai", "Bengaluru", 9},
    {"Mumbai", "Hyderabad", 7},
    {"Hyderabad", "Bengaluru", 5},
    {"Hyderabad", "Chennai", 6},
    {"Bengaluru", "Chennai", 3},
    {"Kolkata", "Chennai", 16}
};

struct GraphVisualizer {
    unordered_map<string, unordered_map<string, int>> adj;

    GraphVisualizer() {
        for (const auto& edge : EDGES) {
            adj[edge.u][edge.v] = edge.w;
            adj[edge.v][edge.u] = edge.w;
        }
    }

    void dijkstra(const string& start, const string& end) {
        unordered_map<string, int> dist;
        unordered_map<string, string> parent;
        set<string> visited;

        for (const auto& n : NODES) {
            dist[n] = 999999;
            cout << "{\"type\":\"init\",\"node\":\"" << n << "\",\"dist\":999999}" << endl;
        }
        dist[start] = 0;
        cout << "{\"type\":\"init\",\"node\":\"" << start << "\",\"dist\":0}" << endl;

        while (visited.size() < NODES.size()) {
            string curr = "";
            int minDist = 999999;
            for (const auto& n : NODES) {
                if (visited.find(n) == visited.end() && dist[n] < minDist) {
                    minDist = dist[n];
                    curr = n;
                }
            }

            if (curr.empty() || minDist == 999999) break;

            visited.insert(curr);
            cout << "{\"type\":\"visit\",\"node\":\"" << curr << "\",\"dist\":" << minDist << "}" << endl;

            if (curr == end) break;

            for (const auto& neighbor : adj[curr]) {
                string v = neighbor.first;
                int weight = neighbor.second;
                if (visited.find(v) != visited.end()) continue;

                cout << "{\"type\":\"edge_check\",\"u\":\"" << curr << "\",\"v\":\"" << v << "\",\"weight\":" << weight << "}" << endl;
                int newDist = dist[curr] + weight;
                if (newDist < dist[v]) {
                    cout << "{\"type\":\"dist_update\",\"node\":\"" << v << "\",\"old_dist\":" << dist[v] << ",\"new_dist\":" << newDist << ",\"parent\":\"" << curr << "\"}" << endl;
                    dist[v] = newDist;
                    parent[v] = curr;
                }
            }
        }

        if (dist[end] != 999999) {
            vector<string> path;
            string curr = end;
            while (curr != start) {
                path.push_back(curr);
                curr = parent[curr];
            }
            path.push_back(start);
            reverse(path.begin(), path.end());

            cout << "{\"type\":\"path_reconstructed\",\"path\":[";
            for (size_t i = 0; i < path.size(); i++) {
                cout << "\"" << path[i] << "\"";
                if (i < path.size() - 1) cout << ",";
            }
            cout << "],\"total_weight\":" << dist[end] << "}" << endl;
        } else {
            cout << "{\"type\":\"error\",\"msg\":\"No path exists\"}" << endl;
        }
    }

    void bellmanFord(const string& start, const string& end) {
        unordered_map<string, int> dist;
        unordered_map<string, string> parent;

        for (const auto& n : NODES) {
            dist[n] = 999999;
            cout << "{\"type\":\"init\",\"node\":\"" << n << "\",\"dist\":999999}" << endl;
        }
        dist[start] = 0;
        cout << "{\"type\":\"init\",\"node\":\"" << start << "\",\"dist\":0}" << endl;

        int V = NODES.size();
        for (int i = 1; i <= V - 1; i++) {
            cout << "{\"type\":\"pass_start\",\"pass\":" << i << "}" << endl;
            bool relaxedAny = false;
            for (const auto& edge : EDGES) {
                if (dist[edge.u] != 999999 && dist[edge.u] + edge.w < dist[edge.v]) {
                    int old = dist[edge.v];
                    dist[edge.v] = dist[edge.u] + edge.w;
                    parent[edge.v] = edge.u;
                    relaxedAny = true;
                    cout << "{\"type\":\"dist_update\",\"node\":\"" << edge.v << "\",\"old_dist\":" << old << ",\"new_dist\":" << dist[edge.v] << ",\"parent\":\"" << edge.u << "\",\"u\":\"" << edge.u << "\",\"v\":\"" << edge.v << "\"}" << endl;
                }
                if (dist[edge.v] != 999999 && dist[edge.v] + edge.w < dist[edge.u]) {
                    int old = dist[edge.u];
                    dist[edge.u] = dist[edge.v] + edge.w;
                    parent[edge.u] = edge.v;
                    relaxedAny = true;
                    cout << "{\"type\":\"dist_update\",\"node\":\"" << edge.u << "\",\"old_dist\":" << old << ",\"new_dist\":" << dist[edge.u] << ",\"parent\":\"" << edge.v << "\",\"u\":\"" << edge.v << "\",\"v\":\"" << edge.u << "\"}" << endl;
                }
            }
            if (!relaxedAny) {
                cout << "{\"type\":\"stabilized\"}" << endl;
                break;
            }
        }

        if (dist[end] != 999999) {
            vector<string> path;
            string curr = end;
            while (curr != start) {
                path.push_back(curr);
                curr = parent[curr];
            }
            path.push_back(start);
            reverse(path.begin(), path.end());

            cout << "{\"type\":\"path_reconstructed\",\"path\":[";
            for (size_t i = 0; i < path.size(); i++) {
                cout << "\"" << path[i] << "\"";
                if (i < path.size() - 1) cout << ",";
            }
            cout << "],\"total_weight\":" << dist[end] << "}" << endl;
        } else {
            cout << "{\"type\":\"error\",\"msg\":\"No path exists\"}" << endl;
        }
    }

    void floydWarshall(const string& start, const string& end) {
        unordered_map<string, unordered_map<string, int>> dist;
        unordered_map<string, unordered_map<string, string>> next;

        for (const auto& u : NODES) {
            for (const auto& v : NODES) {
                dist[u][v] = (u == v) ? 0 : 999999;
                next[u][v] = "";
            }
        }

        for (const auto& edge : EDGES) {
            dist[edge.u][edge.v] = edge.w;
            dist[edge.v][edge.u] = edge.w;
            next[edge.u][edge.v] = edge.v;
            next[edge.v][edge.u] = edge.u;
        }

        for (const auto& k : NODES) {
            cout << "{\"type\":\"floyd_k\",\"k\":\"" << k << "\"}" << endl;
            for (const auto& i : NODES) {
                for (const auto& j : NODES) {
                    if (dist[i][k] != 999999 && dist[k][j] != 999999) {
                        int newDist = dist[i][k] + dist[k][j];
                        if (newDist < dist[i][j]) {
                            int old = dist[i][j];
                            dist[i][j] = newDist;
                            next[i][j] = next[i][k];
                            if (i == start) {
                                cout << "{\"type\":\"floyd_update\",\"k\":\"" << k << "\",\"i\":\"" << i << "\",\"j\":\"" << j << "\",\"old_dist\":" << old << ",\"new_dist\":" << newDist << "}" << endl;
                            }
                        }
                    }
                }
            }
        }

        if (dist[start][end] != 999999) {
            vector<string> path;
            string curr = start;
            path.push_back(curr);
            while (curr != end) {
                curr = next[curr][end];
                if (curr.empty()) break;
                path.push_back(curr);
            }

            cout << "{\"type\":\"path_reconstructed\",\"path\":[";
            for (size_t i = 0; i < path.size(); i++) {
                cout << "\"" << path[i] << "\"";
                if (i < path.size() - 1) cout << ",";
            }
            cout << "],\"total_weight\":" << dist[start][end] << "}" << endl;
        } else {
            cout << "{\"type\":\"error\",\"msg\":\"No path exists\"}" << endl;
        }
    }
};

// --------------------------------------------------------------------
// N-QUEENS BACKTRACKING
// --------------------------------------------------------------------
struct NQueensVisualizer {
    int N;
    vector<vector<int>> board;

    NQueensVisualizer(int size) : N(size), board(size, vector<int>(size, 0)) {}

    void printState(const string& type, int row, int col, const string& status = "", int r2 = -1, int c2 = -1) {
        cout << "{\"type\":\"" << type << "\",\"row\":" << row << ",\"col\":" << col
             << ",\"status\":\"" << status << "\",\"r2\":" << r2 << ",\"c2\":" << c2 << "}" << endl;
    }

    bool isSafe(int row, int col) {
        for (int i = 0; i < col; i++) {
            if (board[row][i] == 1) {
                printState("conflict", row, col, "conflict", row, i);
                return false;
            }
        }

        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 1) {
                printState("conflict", row, col, "conflict", i, j);
                return false;
            }
        }

        for (int i = row, j = col; j >= 0 && i < N; i++, j--) {
            if (board[i][j] == 1) {
                printState("conflict", row, col, "conflict", i, j);
                return false;
            }
        }

        return true;
    }

    bool solve(int col) {
        if (col >= N) return true;

        for (int i = 0; i < N; i++) {
            printState("attempt", i, col, "checking");

            if (isSafe(i, col)) {
                board[i][col] = 1;
                printState("placed", i, col, "safe");

                if (solve(col + 1)) return true;

                board[i][col] = 0;
                printState("backtrack", i, col, "backtrack");
            } else {
                printState("failed", i, col, "failed");
            }
        }
        return false;
    }

    void run() {
        bool solved = solve(0);
        cout << "{\"type\":\"solved\",\"status\":" << (solved ? "true" : "false") << "}" << endl;
    }
};

// --------------------------------------------------------------------
// GRAPH COLORING
// --------------------------------------------------------------------
struct GraphColoringVisualizer {
    int m;
    int V = 6;
    vector<int> colors;
    vector<vector<int>> adj;

    GraphColoringVisualizer(int numColors) : m(numColors), colors(6, 0), adj(6) {
        vector<pair<int, int>> edges = {
            {0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0},
            {5, 0}, {5, 1}, {5, 2}, {5, 3}, {5, 4},
            {0, 2}
        };
        for (const auto& e : edges) {
            adj[e.first].push_back(e.second);
            adj[e.second].push_back(e.first);
        }
    }

    void printState(const string& type, int node, int color, int neighbor = -1) {
        cout << "{\"type\":\"" << type << "\",\"node\":" << node << ",\"color\":" << color
             << ",\"neighbor\":" << neighbor << "}" << endl;
    }

    bool isSafe(int node, int c) {
        for (int neighbor : adj[node]) {
            if (colors[neighbor] == c) {
                printState("conflict", node, c, neighbor);
                return false;
            }
        }
        return true;
    }

    bool solve(int nodeIdx) {
        if (nodeIdx == V) return true;

        for (int c = 1; c <= m; c++) {
            printState("attempt", nodeIdx, c);

            if (isSafe(nodeIdx, c)) {
                colors[nodeIdx] = c;
                printState("placed", nodeIdx, c);

                if (solve(nodeIdx + 1)) return true;

                colors[nodeIdx] = 0;
                printState("backtrack", nodeIdx, 0);
            }
        }
        return false;
    }

    void run() {
        bool solved = solve(0);
        cout << "{\"type\":\"solved\",\"status\":" << (solved ? "true" : "false") << "}" << endl;
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) return 1;

    string mode = argv[1];

    if (mode == "sort") {
        if (argc < 4) return 1;
        string algo = argv[2];
        vector<int> arr = parseCSV(argv[3]);
        SortingVisualizer sv(arr);

        if (algo == "bubble") sv.bubbleSort();
        else if (algo == "selection") sv.selectionSort();
        else if (algo == "insertion") sv.insertionSort();
        else if (algo == "merge") sv.mergeSort(0, arr.size() - 1);
        else if (algo == "quick") sv.quickSort(0, arr.size() - 1);
        else if (algo == "heap") sv.heapSort();
    } 
    else if (mode == "pathfind") {
        if (argc < 5) return 1;
        string algo = argv[2];
        string start = argv[3];
        string end = argv[4];
        GraphVisualizer gv;

        if (algo == "dijkstra") gv.dijkstra(start, end);
        else if (algo == "bellman") gv.bellmanFord(start, end);
        else if (algo == "floyd") gv.floydWarshall(start, end);
    } 
    else if (mode == "nqueens") {
        if (argc < 3) return 1;
        int n = stoi(argv[2]);
        NQueensVisualizer nqv(n);
        nqv.run();
    } 
    else if (mode == "coloring") {
        if (argc < 3) return 1;
        int m = stoi(argv[2]);
        GraphColoringVisualizer gcv(m);
        gcv.run();
    }

    return 0;
}
