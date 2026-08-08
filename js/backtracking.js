document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. N-QUEENS PROBLEM VISUALIZER
    // ----------------------------------------------------
    let nqBoard = [];
    let nqSize = 8;
    let nqPlaying = false;
    let nqPaused = false;
    let nqCancel = false;
    let nqResolve = null;

    const nqBoardEl = document.getElementById('nqueens-board');
    const nqSizeSlider = document.getElementById('nqueens-size');
    const nqSizeVal = document.getElementById('nqueens-size-val');
    const nqSpeedSlider = document.getElementById('nqueens-speed');
    const nqSpeedVal = document.getElementById('nqueens-speed-val');
    const nqPlayBtn = document.getElementById('nqueens-play');
    const nqPauseBtn = document.getElementById('nqueens-pause');
    const nqResetBtn = document.getElementById('nqueens-reset');
    const nqLogs = document.getElementById('nqueens-logs');

    nqSizeSlider.addEventListener('input', () => {
        nqSize = parseInt(nqSizeSlider.value);
        nqSizeVal.textContent = nqSize;
        if (!nqPlaying) {
            initNQueensBoard();
        }
    });

    nqSpeedSlider.addEventListener('input', () => {
        nqSpeedVal.textContent = `${nqSpeedSlider.value}ms`;
    });

    nqPlayBtn.addEventListener('click', () => {
        if (nqPaused) {
            nqPaused = false;
            nqPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
            nqPlayBtn.disabled = true;
            if (nqResolve) {
                nqResolve();
                nqResolve = null;
            }
            return;
        }
        if (nqPlaying) return;
        runNQueens();
    });

    nqPauseBtn.addEventListener('click', () => {
        if (!nqPlaying || nqPaused) return;
        nqPaused = true;
        nqPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
        nqPlayBtn.disabled = false;
    });

    nqResetBtn.addEventListener('click', () => {
        resetNQueens();
    });

    function logNQueens(msg, type = 'system') {
        const line = document.createElement('div');
        line.classList.add('log-line', type);
        line.textContent = msg;
        nqLogs.appendChild(line);
        nqLogs.scrollTop = nqLogs.scrollHeight;
    }

    function initNQueensBoard() {
        nqBoardEl.innerHTML = '';
        nqBoardEl.style.gridTemplateColumns = `repeat(${nqSize}, 48px)`;
        nqBoardEl.style.gridTemplateRows = `repeat(${nqSize}, 48px)`;
        
        nqBoard = Array.from({ length: nqSize }, () => Array(nqSize).fill(0));

        for (let r = 0; r < nqSize; r++) {
            for (let c = 0; c < nqSize; c++) {
                const cell = document.createElement('div');
                cell.classList.add('chess-cell');
                cell.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
                cell.id = `cell-${r}-${c}`;
                nqBoardEl.appendChild(cell);
            }
        }
    }

    async function checkNqPause() {
        if (nqCancel) {
            throw new Error('cancelled');
        }
        if (nqPaused) {
            await new Promise(res => {
                nqResolve = res;
            });
        }
    }

    function resetNQueens() {
        nqCancel = true;
        if (nqResolve) nqResolve();
        nqPlaying = false;
        nqPaused = false;
        nqPlayBtn.disabled = false;
        nqPauseBtn.disabled = true;
        nqPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        nqSizeSlider.disabled = false;
        
        nqLogs.innerHTML = '';
        logNQueens('System ready. Click "Solve" to start.');
        initNQueensBoard();
    }

    async function runNQueens() {
        nqPlaying = true;
        nqCancel = false;
        nqPaused = false;
        nqPlayBtn.disabled = true;
        nqPauseBtn.disabled = false;
        nqSizeSlider.disabled = true;
        nqLogs.innerHTML = '';
        
        logNQueens(`Requesting N-Queens C++ solver execution for N = ${nqSize}...`, 'system');
        initNQueensBoard();

        const url = `/api/run?mode=nqueens&size=${nqSize}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("C++ solver request failed");
            }
            const frames = await response.json();
            
            // Play back actions
            for (let fIdx = 0; fIdx < frames.length; fIdx++) {
                await checkNqPause();
                const frame = frames[fIdx];
                const delay = parseInt(nqSpeedSlider.value);
                const cell = document.getElementById(`cell-${frame.row}-${frame.col}`);
                
                if (frame.type === 'attempt') {
                    logNQueens(`Testing cell: Row ${frame.row + 1}, Col ${frame.col + 1}...`, 'calc');
                    if (cell) {
                        cell.classList.add('checking');
                        const queen = document.createElement('span');
                        queen.classList.add('queen-img');
                        queen.textContent = '👑';
                        cell.appendChild(queen);
                    }
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                else if (frame.type === 'conflict') {
                    logNQueens(`✖ Conflict: Threatened by queen on row/diag!`, 'error');
                    const cell1 = document.getElementById(`cell-${frame.row}-${frame.col}`);
                    const cell2 = document.getElementById(`cell-${frame.r2}-${frame.c2}`);
                    
                    if (cell1) cell1.className = 'chess-cell conflict';
                    if (cell2) cell2.className = 'chess-cell conflict';
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                    
                    if (cell1) {
                        cell1.className = 'chess-cell checking';
                        cell1.innerHTML = '';
                    }
                    if (cell2) {
                        cell2.className = `chess-cell ${(frame.r2 + frame.c2) % 2 === 0 ? 'light' : 'dark'}`;
                        const isPlaced = nqBoard[frame.r2][frame.c2] === 1;
                        if (isPlaced) {
                            cell2.classList.add('queen-placed');
                            const q = document.createElement('span');
                            q.classList.add('queen-img');
                            q.textContent = '👑';
                            cell2.innerHTML = '';
                            cell2.appendChild(q);
                        }
                    }
                }
                else if (frame.type === 'placed') {
                    nqBoard[frame.row][frame.col] = 1;
                    logNQueens(`✔ Queen placed safely at Row ${frame.row + 1}, Col ${frame.col + 1}`, 'update');
                    if (cell) {
                        cell.className = 'chess-cell queen-placed';
                        cell.innerHTML = '<span class="queen-img">👑</span>';
                    }
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                else if (frame.type === 'backtrack') {
                    nqBoard[frame.row][frame.col] = 0;
                    logNQueens(`✘ Backtracking from Row ${frame.row + 1}, Col ${frame.col + 1}...`, 'error');
                    if (cell) {
                        cell.className = `chess-cell ${(frame.row + frame.col) % 2 === 0 ? 'light' : 'dark'}`;
                        cell.innerHTML = '';
                    }
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                else if (frame.type === 'failed') {
                    if (cell) {
                        cell.className = `chess-cell ${(frame.row + frame.col) % 2 === 0 ? 'light' : 'dark'}`;
                        cell.innerHTML = '';
                    }
                }
                else if (frame.type === 'solved') {
                    if (frame.status) {
                        logNQueens('Success! Board configuration solved successfully!', 'found');
                    } else {
                        logNQueens('Unsolvable: No safe queen configurations exist.', 'error');
                    }
                }
            }
        } catch (err) {
            console.warn("C++ backend offline. Falling back to local JS N-Queens backtracking solver.", err.message);
            // Run JS solver locally in browser
            try {
                const solved = await jsSolveNQueens(0);
                if (solved) {
                    logNQueens("Success! JS Solver found a solution.", "found");
                } else {
                    logNQueens("Failed: Board configuration has no safe solutions.", "error");
                }
            } catch (jsErr) {
                console.log("Local JS solver cancelled: ", jsErr.message);
            }
        } finally {
            nqPlaying = false;
            nqPlayBtn.disabled = false;
            nqPauseBtn.disabled = true;
            nqSizeSlider.disabled = false;
        }
    }

    // ----------------------------------------------------
    // FALLBACK JS N-QUEENS SOLVER
    // ----------------------------------------------------
    async function jsSolveNQueens(col) {
        if (col >= nqSize) return true;
        for (let row = 0; row < nqSize; row++) {
            logNQueens(`Testing position: Row ${row+1}, Col ${col+1}`, 'calc');
            const cell = document.getElementById(`cell-${row}-${col}`);
            cell.classList.add('checking');
            const q = document.createElement('span');
            q.classList.add('queen-img');
            q.textContent = '👑';
            cell.appendChild(q);
            await new Promise(r => setTimeout(r, parseInt(nqSpeedSlider.value)));
            await checkNqPause();
            cell.classList.remove('checking');

            let safe = true;
            // Check row on left
            for (let i = 0; i < col; i++) {
                if (nqBoard[row][i] === 1) {
                    safe = false;
                    highlightConflictNq(row, i, row, col);
                    break;
                }
            }
            // Check upper diag
            if (safe) {
                for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
                    if (nqBoard[i][j] === 1) {
                        safe = false;
                        highlightConflictNq(i, j, row, col);
                        break;
                    }
                }
            }
            // Check lower diag
            if (safe) {
                for (let i = row, j = col; j >= 0 && i < nqSize; i++, j--) {
                    if (nqBoard[i][j] === 1) {
                        safe = false;
                        highlightConflictNq(i, j, row, col);
                        break;
                    }
                }
            }

            if (safe) {
                nqBoard[row][col] = 1;
                cell.className = 'chess-cell queen-placed';
                logNQueens(`Placed Queen safely at Row ${row+1}, Col ${col+1}`, 'update');
                await new Promise(r => setTimeout(r, parseInt(nqSpeedSlider.value)));
                await checkNqPause();

                if (await jsSolveNQueens(col + 1)) return true;

                // Backtrack
                logNQueens(`Backtracking Queen from Row ${row+1}, Col ${col+1}...`, 'error');
                nqBoard[row][col] = 0;
                cell.className = `chess-cell ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                cell.innerHTML = '';
                await new Promise(r => setTimeout(r, parseInt(nqSpeedSlider.value)));
                await checkNqPause();
            } else {
                logNQueens(`✖ Conflict at Row ${row+1}, Col ${col+1}!`, 'error');
                cell.innerHTML = '';
                await new Promise(r => setTimeout(r, parseInt(nqSpeedSlider.value)));
                await checkNqPause();
            }
        }
        return false;
    }

    function highlightConflictNq(r1, c1, r2, c2) {
        const cell1 = document.getElementById(`cell-${r1}-${c1}`);
        const cell2 = document.getElementById(`cell-${r2}-${c2}`);
        if (cell1) cell1.classList.add('conflict');
        if (cell2) cell2.classList.add('conflict');
        setTimeout(() => {
            if (cell1) cell1.classList.remove('conflict');
            if (cell2) cell2.classList.remove('conflict');
        }, 600);
    }


    // ----------------------------------------------------
    // 2. GRAPH COLORING CONCEPT VISUALIZER
    // ----------------------------------------------------
    const coloringCanvas = document.getElementById('coloring-canvas');
    const colorCtx = coloringCanvas.getContext('2d');
    const colorPaletteSelect = document.getElementById('coloring-palette');
    const coloringSpeed = document.getElementById('coloring-speed');
    const coloringSpeedVal = document.getElementById('coloring-speed-val');
    const coloringPlayBtn = document.getElementById('coloring-play');
    const coloringResetBtn = document.getElementById('coloring-reset');
    const coloringLogs = document.getElementById('coloring-logs');

    const COLOR_NODES = [
        { id: 0, x: 350, y: 80,  label: 'Node 0' },
        { id: 1, x: 480, y: 170, label: 'Node 1' },
        { id: 2, x: 430, y: 300, label: 'Node 2' },
        { id: 3, x: 270, y: 300, label: 'Node 3' },
        { id: 4, x: 220, y: 170, label: 'Node 4' },
        { id: 5, x: 350, y: 190, label: 'Node 5' }
    ];

    const COLOR_EDGES = [
        { u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 0 },
        { u: 5, v: 0 }, { u: 5, v: 1 }, { u: 5, v: 2 }, { u: 5, v: 3 }, { u: 5, v: 4 },
        { u: 0, v: 2 }
    ];

    const COLOR_HEX = {
        0: '#1e293b',
        1: '#10b981', // Green
        2: '#06b6d4', // Cyan
        3: '#8b5cf6', // Violet
        4: '#f59e0b', // Yellow
        5: '#ec4899'  // Pink
    };

    const COLOR_NAMES = {
        0: 'None', 1: 'Green', 2: 'Cyan', 3: 'Violet', 4: 'Yellow', 5: 'Pink'
    };

    let vertexColors = {};
    let colorPlaying = false;
    let colorCancel = false;

    // Build local adjacency list
    const ADJ_LIST = {};
    COLOR_NODES.forEach(n => { ADJ_LIST[n.id] = []; });
    COLOR_EDGES.forEach(e => {
        ADJ_LIST[e.u].push(e.v);
        ADJ_LIST[e.v].push(e.u);
    });

    coloringSpeed.addEventListener('input', () => {
        coloringSpeedVal.textContent = `${coloringSpeed.value}ms`;
    });

    coloringPlayBtn.addEventListener('click', () => {
        if (colorPlaying) return;
        runGraphColoring();
    });

    coloringResetBtn.addEventListener('click', () => {
        resetColoring();
    });

    function logColoring(msg, type = 'system') {
        const line = document.createElement('div');
        line.classList.add('log-line', type);
        line.textContent = msg;
        coloringLogs.appendChild(line);
        coloringLogs.scrollTop = coloringLogs.scrollHeight;
    }

    function drawColoringGraph(evalNode = null, conflictNode = null) {
        colorCtx.clearRect(0, 0, coloringCanvas.width, coloringCanvas.height);

        // Draw Edges
        COLOR_EDGES.forEach(edge => {
            const uNode = COLOR_NODES[edge.u];
            const vNode = COLOR_NODES[edge.v];

            colorCtx.beginPath();
            colorCtx.moveTo(uNode.x, uNode.y);
            colorCtx.lineTo(vNode.x, vNode.y);

            if (conflictNode !== null && (
                (edge.u === evalNode && edge.v === conflictNode) || 
                (edge.v === evalNode && edge.u === conflictNode)
            )) {
                colorCtx.strokeStyle = '#ef4444';
                colorCtx.lineWidth = 4;
            } else {
                colorCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                colorCtx.lineWidth = 2;
            }
            colorCtx.stroke();
        });

        // Draw Nodes
        COLOR_NODES.forEach(node => {
            const colorCode = vertexColors[node.id] || 0;
            const isEvaluating = node.id === evalNode;
            const isConflicting = node.id === conflictNode;

            colorCtx.beginPath();
            colorCtx.arc(node.x, node.y, 22, 0, Math.PI * 2);
            colorCtx.fillStyle = COLOR_HEX[colorCode];
            colorCtx.fill();

            if (isConflicting) {
                colorCtx.strokeStyle = '#ef4444';
                colorCtx.lineWidth = 4;
            } else if (isEvaluating) {
                colorCtx.strokeStyle = '#3b82f6';
                colorCtx.lineWidth = 3.5;
            } else {
                colorCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                colorCtx.lineWidth = 1.5;
            }
            colorCtx.stroke();

            colorCtx.fillStyle = '#ffffff';
            colorCtx.font = 'bold 11px "Outfit"';
            colorCtx.textAlign = 'center';
            colorCtx.textBaseline = 'middle';
            colorCtx.fillText(node.id, node.x, node.y);
        });
    }

    function resetColoring() {
        colorCancel = true;
        colorPlaying = false;
        coloringPlayBtn.disabled = false;
        colorPaletteSelect.disabled = false;

        COLOR_NODES.forEach(n => {
            vertexColors[n.id] = 0;
        });

        coloringLogs.innerHTML = '';
        logColoring('Coloring visualizer ready. Click "Color Graph" to start.');
        drawColoringGraph();
    }

    async function runGraphColoring() {
        colorPlaying = true;
        colorCancel = false;
        coloringPlayBtn.disabled = true;
        colorPaletteSelect.disabled = true;
        coloringLogs.innerHTML = '';

        COLOR_NODES.forEach(n => { vertexColors[n.id] = 0; });
        const m = parseInt(colorPaletteSelect.value);

        logColoring(`Requesting Graph Coloring C++ execution with maximum colors (m) = ${m}...`, 'system');
        drawColoringGraph();

        const url = `/api/run?mode=coloring&m=${m}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("C++ graph coloring failed");
            }
            const frames = await response.json();
            
            for (let fIdx = 0; fIdx < frames.length; fIdx++) {
                if (colorCancel) return;
                const frame = frames[fIdx];
                const delay = parseInt(coloringSpeed.value);
                
                if (frame.type === 'attempt') {
                    logColoring(`Trying Color ${COLOR_NAMES[frame.color]} on Node ${frame.node}...`, 'calc');
                    vertexColors[frame.node] = frame.color;
                    drawColoringGraph(frame.node);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                else if (frame.type === 'conflict') {
                    logColoring(`✖ Conflict: Neighbor ${frame.neighbor} is already colored ${COLOR_NAMES[frame.color]}!`, 'error');
                    drawColoringGraph(frame.node, frame.neighbor);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    drawColoringGraph(frame.node);
                }
                else if (frame.type === 'placed') {
                    logColoring(`✔ Color ${COLOR_NAMES[frame.color]} assigned safely to Node ${frame.node}`, 'update');
                    vertexColors[frame.node] = frame.color;
                    drawColoringGraph();
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                else if (frame.type === 'backtrack') {
                    logColoring(`✘ Conflict downstream! Backtracking Node ${frame.node}...`, 'error');
                    vertexColors[frame.node] = 0;
                    drawColoringGraph();
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                else if (frame.type === 'solved') {
                    if (frame.status) {
                        logColoring(`Success! Colored vertices safely using ${m} colors.`, 'found');
                    } else {
                        logColoring(`Failed: Coloring is impossible with ${m} colors (Chromatic number is 4).`, 'error');
                    }
                }
            }
        } catch (err) {
            console.warn("C++ server offline. Falling back to local JS graph coloring solver.", err.message);
            try {
                const solved = await jsSolveColoring(0, m);
                if (solved) {
                    logColoring(`Success! Local JS solver successfully colored the graph.`, 'found');
                } else {
                    logColoring(`Failed: Coloring is impossible using ${m} colors.`, 'error');
                }
            } catch (jsErr) {
                console.log("Local JS coloring cancelled: ", jsErr.message);
            }
        } finally {
            colorPlaying = false;
            coloringPlayBtn.disabled = false;
            colorPaletteSelect.disabled = false;
        }
    }

    // ----------------------------------------------------
    // FALLBACK JS GRAPH COLORING SOLVER
    // ----------------------------------------------------
    async function jsSolveColoring(nodeIdx, m) {
        if (nodeIdx === COLOR_NODES.length) return true;
        for (let c = 1; c <= m; c++) {
            logColoring(`Trying Color ${COLOR_NAMES[c]} for Node ${nodeIdx}...`, 'calc');
            vertexColors[nodeIdx] = c;
            drawColoringGraph(nodeIdx);
            await new Promise(r => setTimeout(r, parseInt(coloringSpeed.value)));
            if (colorCancel) throw new Error('cancelled');

            let safe = true;
            const neighbors = ADJ_LIST[nodeIdx];
            for (let neighbor of neighbors) {
                if (vertexColors[neighbor] === c) {
                    safe = false;
                    logColoring(`✖ Conflict: Node ${neighbor} shares color ${COLOR_NAMES[c]}!`, 'error');
                    drawColoringGraph(nodeIdx, neighbor);
                    await new Promise(r => setTimeout(r, parseInt(coloringSpeed.value)));
                    drawColoringGraph(nodeIdx);
                    break;
                }
            }

            if (safe) {
                logColoring(`✔ Color ${COLOR_NAMES[c]} assigned to Node ${nodeIdx}`, 'update');
                drawColoringGraph();
                await new Promise(r => setTimeout(r, parseInt(coloringSpeed.value)));
                if (colorCancel) throw new Error('cancelled');

                if (await jsSolveColoring(nodeIdx + 1, m)) return true;

                // Backtrack
                logColoring(`Backtracking Node ${nodeIdx}...`, 'error');
                vertexColors[nodeIdx] = 0;
                drawColoringGraph();
                await new Promise(r => setTimeout(r, parseInt(coloringSpeed.value)));
            }
        }
        vertexColors[nodeIdx] = 0;
        return false;
    }

    function resizeColoringCanvas() {
        drawColoringGraph();
    }
    window.resizeColoringCanvas = resizeColoringCanvas;

    const subtabs = document.querySelectorAll('.subtab-btn');
    const subtabViews = document.querySelectorAll('.subtab-view');

    subtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            subtabs.forEach(t => t.classList.remove('active'));
            subtabViews.forEach(v => v.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-subtab');
            document.getElementById(`subtab-${targetId}-view`).classList.add('active');

            if (targetId === 'coloring') {
                resetColoring();
                const activeLang = document.querySelector('.lang-tab.active[data-algo="coloring"]') || { getAttribute: () => 'js' };
                const lang = typeof activeLang.getAttribute === 'function' ? activeLang.getAttribute('data-lang') : 'js';
                if (window.updateCodeSnippets) window.updateCodeSnippets(lang, 'coloring');
            } else {
                resetNQueens();
                const activeLang = document.querySelector('.lang-tab.active[data-algo="nqueens"]') || { getAttribute: () => 'js' };
                const lang = typeof activeLang.getAttribute === 'function' ? activeLang.getAttribute('data-lang') : 'js';
                if (window.updateCodeSnippets) window.updateCodeSnippets(lang, 'nqueens');
            }
        });
    });

    initNQueensBoard();
    resetNQueens();
    resetColoring();
});

