document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Graph Config & Indian Cities
    // ----------------------------------------------------
    const NODES = {
        'Delhi':     { x: 250, y: 90,  label: 'Delhi' },
        'Jaipur':    { x: 170, y: 150, label: 'Jaipur' },
        'Mumbai':    { x: 140, y: 290, label: 'Mumbai' },
        'Bengaluru': { x: 240, y: 360, label: 'Bengaluru' },
        'Chennai':   { x: 360, y: 350, label: 'Chennai' },
        'Hyderabad': { x: 300, y: 250, label: 'Hyderabad' },
        'Kolkata':   { x: 540, y: 170, label: 'Kolkata' }
    };

    const EDGES = [
        { u: 'Delhi', v: 'Jaipur', w: 3 },
        { u: 'Delhi', v: 'Kolkata', w: 14 },
        { u: 'Delhi', v: 'Hyderabad', w: 12 },
        { u: 'Jaipur', v: 'Mumbai', w: 11 },
        { u: 'Mumbai', v: 'Bengaluru', w: 9 },
        { u: 'Mumbai', v: 'Hyderabad', w: 7 },
        { u: 'Hyderabad', v: 'Bengaluru', w: 5 },
        { u: 'Hyderabad', v: 'Chennai', w: 6 },
        { u: 'Bengaluru', v: 'Chennai', w: 3 },
        { u: 'Kolkata', v: 'Chennai', w: 16 }
    ];

    const ALGO_INFO = {
        dijkstra: {
            name: "Dijkstra's Algorithm",
            time: "O((V + E) log V)",
            space: "O(V)",
            desc: "Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights. It uses a greedy approach, selecting the node with the minimum distance at each step."
        },
        bellman: {
            name: "Bellman-Ford Algorithm",
            time: "O(V * E)",
            space: "O(V)",
            desc: "Bellman-Ford computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. Unlike Dijkstra, it supports negative edge weights and can detect negative cycles."
        },
        floyd: {
            name: "Floyd-Warshall Algorithm",
            time: "O(V³)",
            space: "O(V²)",
            desc: "Floyd-Warshall is a dynamic programming algorithm that finds the shortest paths between all pairs of vertices in a weighted graph, even with negative edge weights, as long as there are no negative cycles."
        }
    };

    let isRunning = false;
    let cancelPlayback = false;
    let nodeDistances = {};
    let nodeVisited = {};
    let activeEdge = null;
    let finalPath = [];
    let parentNodes = {};

    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const graphAlgo = document.getElementById('graph-algorithm');
    const startSelect = document.getElementById('graph-start');
    const endSelect = document.getElementById('graph-end');
    const speedSlider = document.getElementById('graph-speed');
    const speedVal = document.getElementById('graph-speed-val');
    const runBtn = document.getElementById('graph-run');
    const resetBtn = document.getElementById('graph-reset');
    const logsContainer = document.getElementById('graph-logs');
    
    const graphNameEl = document.getElementById('graph-name');
    const graphDescEl = document.getElementById('graph-desc');
    const graphTimeEl = document.getElementById('graph-time-comp');
    const graphSpaceEl = document.getElementById('graph-space-comp');

    // Initialize selectors with Indian Cities
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    Object.keys(NODES).forEach(node => {
        const option1 = document.createElement('option');
        option1.value = node;
        option1.textContent = node;
        startSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = node;
        option2.textContent = node;
        endSelect.appendChild(option2);
    });
    startSelect.value = 'Delhi';
    endSelect.value = 'Chennai';

    graphAlgo.addEventListener('change', () => {
        updateAlgoInfo();
        const activeLang = document.querySelector('.lang-tab.active[data-algo="graph"]') || { getAttribute: () => 'py' };
        const lang = typeof activeLang.getAttribute === 'function' ? activeLang.getAttribute('data-lang') : 'py';
        if (window.updateCodeSnippets) window.updateCodeSnippets(lang, 'graph');
        resetState();
    });

    speedSlider.addEventListener('input', () => {
        speedVal.textContent = `${speedSlider.value}ms`;
    });

    runBtn.addEventListener('click', () => {
        if (isRunning) return;
        runPathfinding();
    });

    resetBtn.addEventListener('click', () => {
        resetState();
    });

    function drawMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
        ctx.lineWidth = 1;
        const gridSpacing = 40;
        for (let x = 0; x < canvas.width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw connections (Edges)
        EDGES.forEach(edge => {
            const uNode = NODES[edge.u];
            const vNode = NODES[edge.v];

            ctx.beginPath();
            ctx.moveTo(uNode.x, uNode.y);
            ctx.lineTo(vNode.x, vNode.y);

            let isFinalPathEdge = false;
            if (finalPath.length > 0) {
                for (let i = 0; i < finalPath.length - 1; i++) {
                    if ((finalPath[i] === edge.u && finalPath[i+1] === edge.v) ||
                        (finalPath[i] === edge.v && finalPath[i+1] === edge.u)) {
                        isFinalPathEdge = true;
                        break;
                    }
                }
            }

            if (isFinalPathEdge) {
                ctx.strokeStyle = '#8b5cf6';
                ctx.lineWidth = 4;
            } else if (activeEdge && ((activeEdge.u === edge.u && activeEdge.v === edge.v) || (activeEdge.u === edge.v && activeEdge.v === edge.u))) {
                ctx.strokeStyle = '#f43f5e';
                ctx.lineWidth = 3.5;
            } else if (nodeVisited[edge.u] && nodeVisited[edge.v]) {
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = 1.5;
            }

            ctx.stroke();

            // Draw Edge Weight
            const midX = (uNode.x + vNode.x) / 2;
            const midY = (uNode.y + vNode.y) / 2;
            ctx.save();
            ctx.fillStyle = '#090e1a';
            ctx.beginPath();
            ctx.arc(midX, midY, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isFinalPathEdge ? '#a78bfa' : '#9ca3af';
            ctx.font = '10px "Fira Code"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(edge.w, midX, midY);
            ctx.restore();
        });

        // Draw Nodes (Indian Cities)
        Object.keys(NODES).forEach(nodeName => {
            const node = NODES[nodeName];
            const dist = nodeDistances[nodeName];
            const isStart = nodeName === startSelect.value;
            const isEnd = nodeName === endSelect.value;
            const isVisited = nodeVisited[nodeName];

            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);

            if (isStart) {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 3;
            } else if (isEnd) {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 3;
            } else if (isVisited) {
                ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
                ctx.strokeStyle = '#06b6d4';
                ctx.lineWidth = 2;
            } else {
                ctx.fillStyle = '#111827';
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1.5;
            }

            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Outfit"';
            ctx.textAlign = 'center';
            ctx.fillText(nodeName, node.x, node.y - 28);

            let distStr = dist === Infinity || dist >= 999999 ? '∞' : dist;
            ctx.fillStyle = isStart ? '#10b981' : (distStr === '∞' ? '#9ca3af' : '#22d3ee');
            ctx.font = '11px "Fira Code"';
            ctx.fillText(distStr, node.x, node.y + 4);
        });
    }

    function log(message, type = 'system') {
        const line = document.createElement('div');
        line.classList.add('log-line', type);
        line.textContent = message;
        logsContainer.appendChild(line);
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    function resetState() {
        cancelPlayback = true;
        isRunning = false;
        runBtn.disabled = false;
        graphAlgo.disabled = false;
        startSelect.disabled = false;
        endSelect.disabled = false;
        
        nodeVisited = {};
        activeEdge = null;
        finalPath = [];
        parentNodes = {};
        
        Object.keys(NODES).forEach(node => {
            nodeDistances[node] = Infinity;
        });

        logsContainer.innerHTML = '';
        log('Visualizer ready. Select Indian cities and click "Run".');
        drawMap();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function updateAlgoInfo() {
        const algo = graphAlgo.value;
        const info = ALGO_INFO[algo];

        graphNameEl.textContent = info.name;
        graphDescEl.textContent = info.desc;
        graphTimeEl.textContent = info.time;
        graphSpaceEl.textContent = info.space;
    }

    async function runPathfinding() {
        isRunning = true;
        cancelPlayback = false;
        runBtn.disabled = true;
        graphAlgo.disabled = true;
        startSelect.disabled = true;
        endSelect.disabled = true;
        
        logsContainer.innerHTML = '';
        nodeVisited = {};
        activeEdge = null;
        finalPath = [];
        parentNodes = {};
        
        const start = startSelect.value;
        const end = endSelect.value;
        const algo = graphAlgo.value;

        Object.keys(NODES).forEach(n => {
            nodeDistances[n] = Infinity;
        });
        nodeDistances[start] = 0;

        log(`Requesting path from backend server: ${start} to ${end}...`, 'system');

        const url = `/api/run?mode=pathfind&algo=${algo}&start=${start}&end=${end}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Backend execution failed");
            }
            const frames = await response.json();
            
            for (let fIdx = 0; fIdx < frames.length; fIdx++) {
                if (cancelPlayback) return;
                const frame = frames[fIdx];
                const delay = parseInt(speedSlider.value);
                
                if (frame.type === 'init') {
                    nodeDistances[frame.node] = frame.dist === 999999 ? Infinity : frame.dist;
                    drawMap();
                }
                else if (frame.type === 'visit') {
                    nodeVisited[frame.node] = true;
                    log(`Visiting City ${frame.node} (Current distance: ${frame.dist === 999999 ? '∞' : frame.dist})`, 'found');
                    drawMap();
                    await sleep(delay);
                }
                else if (frame.type === 'edge_check') {
                    activeEdge = { u: frame.u, v: frame.v };
                    log(`Checking route: ${frame.u} ➔ ${frame.v} (weight: ${frame.weight})`, 'calc');
                    drawMap();
                    await sleep(delay);
                }
                else if (frame.type === 'dist_update') {
                    nodeDistances[frame.node] = frame.new_dist;
                    if (frame.u && frame.v) {
                        activeEdge = { u: frame.u, v: frame.v };
                    }
                    log(`Updating distance to ${frame.node}: ${frame.old_dist === 999999 ? '∞' : frame.old_dist} ➔ ${frame.new_dist} (via ${frame.parent})`, 'update');
                    drawMap();
                    await sleep(delay);
                }
                else if (frame.type === 'floyd_k') {
                    log(`Floyd-Warshall testing intermediate node: ${frame.k}`, 'system');
                    nodeVisited = { [frame.k]: true };
                    drawMap();
                    await sleep(delay);
                }
                else if (frame.type === 'floyd_update') {
                    nodeDistances[frame.j] = frame.new_dist;
                    activeEdge = { u: frame.i, v: frame.j };
                    log(`Shortcut: ${frame.i} ➔ ${frame.j} via ${frame.k} is ${frame.new_dist}`, 'update');
                    drawMap();
                    await sleep(delay);
                }
                else if (frame.type === 'path_reconstructed') {
                    finalPath = frame.path;
                    activeEdge = null;
                    log(`Shortest Route: ${finalPath.join(' ➔ ')} (Total Distance: ${frame.total_weight})`, 'found');
                    drawMap();
                }
                else if (frame.type === 'error') {
                    log(`Error: ${frame.msg}`, 'error');
                }
            }
        } catch (err) {
            console.warn("Backend server not available. Running local JS pathfinding fallback.", err.message);
            try {
                if (algo === 'dijkstra') {
                    await jsDijkstra(start, end);
                } else if (algo === 'bellman') {
                    await jsBellman(start, end);
                } else if (algo === 'floyd') {
                    await jsFloyd(start, end);
                }
            } catch (jsErr) {
                console.log("Local JS pathfinding interrupted: ", jsErr.message);
            }
        } finally {
            isRunning = false;
            runBtn.disabled = false;
            graphAlgo.disabled = false;
            startSelect.disabled = false;
            endSelect.disabled = false;
        }
    }

    // Local JS Fallback pathfinder with Indian Cities
    const adj = {};
    Object.keys(NODES).forEach(n => adj[n] = {});
    EDGES.forEach(e => {
        adj[e.u][e.v] = e.w;
        adj[e.v][e.u] = e.w;
    });

    async function jsDijkstra(start, end) {
        let unvisited = new Set(Object.keys(NODES));
        nodeDistances[start] = 0;
        
        while (unvisited.size > 0) {
            if (cancelPlayback) return;
            let curr = null;
            let minDist = Infinity;
            unvisited.forEach(n => {
                if (nodeDistances[n] < minDist) {
                    minDist = nodeDistances[n];
                    curr = n;
                }
            });

            if (curr === null || minDist === Infinity) break;

            unvisited.delete(curr);
            nodeVisited[curr] = true;
            log(`Visiting ${curr} (Distance: ${minDist})`, 'found');
            drawMap();
            await sleep(parseInt(speedSlider.value));

            if (curr === end) {
                log(`Reached destination ${end}!`, 'found');
                await reconstructPathLocal(start, end);
                return;
            }

            for (let neighbor in adj[curr]) {
                if (unvisited.has(neighbor)) {
                    activeEdge = { u: curr, v: neighbor };
                    log(`Checking route ${curr} ➔ ${neighbor}`, 'calc');
                    drawMap();
                    await sleep(parseInt(speedSlider.value));

                    let alt = nodeDistances[curr] + adj[curr][neighbor];
                    if (alt < nodeDistances[neighbor]) {
                        log(`Updating ${neighbor}: ${nodeDistances[neighbor]} ➔ ${alt}`, 'update');
                        nodeDistances[neighbor] = alt;
                        parentNodes[neighbor] = curr;
                        drawMap();
                        await sleep(parseInt(speedSlider.value));
                    }
                }
            }
            activeEdge = null;
        }
        await reconstructPathLocal(start, end);
    }

    async function jsBellman(start, end) {
        const numNodes = Object.keys(NODES).length;
        nodeDistances[start] = 0;

        for (let i = 1; i < numNodes; i++) {
            if (cancelPlayback) return;
            log(`--- Pass Iteration ${i} / ${numNodes - 1} ---`, 'system');
            let relaxedAny = false;

            for (let edge of EDGES) {
                if (cancelPlayback) return;

                const relaxEdge = async (u, v, w) => {
                    if (nodeDistances[u] !== Infinity && nodeDistances[u] + w < nodeDistances[v]) {
                        activeEdge = { u, v };
                        log(`Relaxing route ${u} ➔ ${v}`, 'calc');
                        drawMap();
                        await sleep(parseInt(speedSlider.value));

                        nodeDistances[v] = nodeDistances[u] + w;
                        parentNodes[v] = u;
                        relaxedAny = true;
                        
                        log(`Distance of ${v} relaxed to ${nodeDistances[v]}`, 'update');
                        drawMap();
                        await sleep(parseInt(speedSlider.value));
                    }
                };
                await relaxEdge(edge.u, edge.v, edge.w);
                await relaxEdge(edge.v, edge.u, edge.w);
            }
            activeEdge = null;
            if (!relaxedAny) break;
        }
        await reconstructPathLocal(start, end);
    }

    async function jsFloyd(start, end) {
        const nodeList = Object.keys(NODES);
        const V = nodeList.length;
        const dist = {};
        const next = {};

        nodeList.forEach(u => {
            dist[u] = {};
            next[u] = {};
            nodeList.forEach(v => {
                dist[u][v] = u === v ? 0 : Infinity;
                next[u][v] = null;
            });
        });

        EDGES.forEach(e => {
            dist[e.u][e.v] = e.w;
            dist[e.v][e.u] = e.w;
            next[e.u][e.v] = e.v;
            next[e.v][e.u] = e.u;
        });

        for (let k = 0; k < V; k++) {
            let kNode = nodeList[k];
            nodeVisited[kNode] = true;
            log(`Testing intermediate city: ${kNode}...`, 'system');
            drawMap();
            await sleep(parseInt(speedSlider.value));

            for (let i = 0; i < V; i++) {
                let iNode = nodeList[i];
                for (let j = 0; j < V; j++) {
                    if (cancelPlayback) return;
                    let jNode = nodeList[j];

                    if (dist[iNode][kNode] + dist[kNode][jNode] < dist[iNode][jNode]) {
                        dist[iNode][jNode] = dist[iNode][kNode] + dist[kNode][jNode];
                        next[iNode][jNode] = next[iNode][kNode];

                        if (iNode === start) {
                            nodeDistances[jNode] = dist[iNode][jNode];
                            activeEdge = { u: iNode, v: jNode };
                            log(`Shortcut via ${kNode} to ${jNode}: dist ${dist[iNode][jNode]}`, 'update');
                            drawMap();
                            await sleep(parseInt(speedSlider.value));
                        }
                    }
                }
            }
        }
        nodeVisited = {};
        activeEdge = null;

        if (dist[start][end] !== Infinity) {
            let path = [start];
            let curr = start;
            while (curr !== end) {
                curr = next[curr][end];
                path.push(curr);
            }
            finalPath = path;
            log(`Shortest Route: ${finalPath.join(' ➔ ')} (Total Distance: ${dist[start][end]})`, 'found');
            drawMap();
        }
    }

    async function reconstructPathLocal(start, end) {
        if (nodeDistances[end] === Infinity) return;
        let path = [end];
        let curr = end;
        while (curr !== start) {
            curr = parentNodes[curr];
            path.push(curr);
        }
        finalPath = path.reverse();
        log(`Shortest Route: ${finalPath.join(' ➔ ')} (Total Distance: ${nodeDistances[end]})`, 'found');
        drawMap();
    }

    function resizeGraphCanvas() {
        drawMap();
    }
    window.resizeGraphCanvas = resizeGraphCanvas;

    updateAlgoInfo();
    resetState();
    if (window.updateCodeSnippets) window.updateCodeSnippets('py', 'graph');
});
