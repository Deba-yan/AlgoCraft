document.addEventListener('DOMContentLoaded', () => {
    // State management
    let array = [];
    let originalArray = [];
    let isPlaying = false;
    let isPaused = false;
    let cancelSorting = false;
    let pauseResolve = null;
    
    // DOM Elements
    const board = document.getElementById('sorting-board');
    const arrayDiagram = document.getElementById('array-diagram');
    const sortAlgorithm = document.getElementById('sort-algorithm');
    const speedSlider = document.getElementById('sort-speed');
    const speedValue = document.getElementById('sort-speed-val');
    const sizeSlider = document.getElementById('sort-size');
    const sizeValue = document.getElementById('sort-size-val');
    const randomizeBtn = document.getElementById('sort-randomize');
    const playBtn = document.getElementById('sort-play');
    const pauseBtn = document.getElementById('sort-pause');
    const sizeGroup = document.getElementById('sort-size-group');
    
    const customInput = document.getElementById('sort-custom-input');
    const applyInputBtn = document.getElementById('sort-apply-input');
    const inputError = document.getElementById('input-error');

    // Complexity Table Elements
    const worstTime = document.getElementById('sort-worst-time');
    const avgTime = document.getElementById('sort-avg-time');
    const bestTime = document.getElementById('sort-best-time');
    const spaceComp = document.getElementById('sort-space');
    const stableSort = document.getElementById('sort-stable');
    const sortDesc = document.getElementById('sort-description');

    const ALGO_DETAILS = {
        bubble: {
            worst: 'O(n²)', avg: 'O(n²)', best: 'O(n)', space: 'O(1)', stable: 'Yes',
            desc: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.'
        },
        selection: {
            worst: 'O(n²)', avg: 'O(n²)', best: 'O(n²)', space: 'O(1)', stable: 'No',
            desc: 'Selection Sort divides the input list into two parts: a sorted sublist at the left and a remaining unsorted sublist at the right. It repeatedly finds the smallest element in the unsorted sublist and swaps it with the leftmost unsorted element.'
        },
        insertion: {
            worst: 'O(n²)', avg: 'O(n²)', best: 'O(n)', space: 'O(1)', stable: 'Yes',
            desc: 'Insertion Sort builds the final sorted array one item at a time. It takes each element from the unsorted part and inserts it into its correct position within the sorted part.'
        },
        merge: {
            worst: 'O(n log n)', avg: 'O(n log n)', best: 'O(n log n)', space: 'O(n)', stable: 'Yes',
            desc: 'Merge Sort is a Divide and Conquer algorithm. It splits the input array into two halves, calls itself recursively on the two halves, and then merges the two sorted halves back together.'
        },
        quick: {
            worst: 'O(n²)', avg: 'O(n log n)', best: 'O(n log n)', space: 'O(log n)', stable: 'No',
            desc: 'Quick Sort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the surrounding array around the pivot, placing smaller elements to the left and larger to the right.'
        },
        heap: {
            worst: 'O(n log n)', avg: 'O(n log n)', best: 'O(n log n)', space: 'O(1)', stable: 'No',
            desc: 'Heap Sort visualizes the array as a Binary Heap. It first builds a Max-Heap structure from the data, then repeatedly extracts the maximum element and moves it to the end of the array, rebuilding the heap.'
        }
    };

    // Initialize
    updateInfoPanel();
    generateRandomArray();
    if (window.updateCodeSnippets) window.updateCodeSnippets('py', 'sort');

    // Event Listeners
    sortAlgorithm.addEventListener('change', () => {
        // Reset controls immediately when switching algorithm
        resetControls();
        updateInfoPanel();
        renderDiagram();
        const activeLangTab = document.querySelector('.lang-tab.active[data-algo="sort"]');
        const lang = activeLangTab ? activeLangTab.getAttribute('data-lang') : 'py';
        if (window.updateCodeSnippets) window.updateCodeSnippets(lang, 'sort');
    });
    
    speedSlider.addEventListener('input', () => {
        speedValue.textContent = `${speedSlider.value}ms`;
    });

    sizeSlider.addEventListener('input', () => {
        sizeValue.textContent = sizeSlider.value;
        if (!isPlaying) {
            generateRandomArray();
        }
    });

    randomizeBtn.addEventListener('click', () => {
        resetControls();
        generateRandomArray();
    });

    playBtn.addEventListener('click', async () => {
        if (isPaused) {
            resumeSorting();
            return;
        }
        
        if (isPlaying) return;
        
        startSorting();
    });

    pauseBtn.addEventListener('click', () => {
        pauseSorting();
    });

    applyInputBtn.addEventListener('click', () => {
        const val = customInput.value.trim();
        if (!val) {
            inputError.textContent = "Input is empty";
            return;
        }

        const parsed = val.split(',')
            .map(x => x.trim())
            .filter(x => x !== "")
            .map(Number);

        if (parsed.some(isNaN)) {
            inputError.textContent = "All values must be valid numbers";
            return;
        }

        if (parsed.length < 3 || parsed.length > 20) {
            inputError.textContent = "Array length must be between 3 and 20 items for custom input";
            return;
        }

        if (parsed.some(x => x < 5 || x > 100)) {
            inputError.textContent = "Values must be between 5 and 100";
            return;
        }

        inputError.textContent = "";
        resetControls();
        
        sizeGroup.style.opacity = '0.5';
        sizeSlider.disabled = true;

        array = [...parsed];
        originalArray = [...parsed];
        renderBoard();
        renderDiagram();
    });

    // Helper functions
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function checkPause() {
        if (cancelSorting) {
            throw new Error('cancelled');
        }
        if (isPaused) {
            await new Promise(resolve => {
                pauseResolve = resolve;
            });
        }
    }

    function generateRandomArray() {
        const size = parseInt(sizeSlider.value);
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 85) + 15);
        }
        originalArray = [...array];
        sizeGroup.style.opacity = '1';
        sizeSlider.disabled = false;
        renderBoard();
        renderDiagram();
    }

    function renderBoard() {
        board.innerHTML = '';
        const maxVal = Math.max(...array);
        
        array.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.classList.add('sort-bar');
            bar.id = `bar-${idx}`;
            bar.style.height = `${(val / maxVal) * 90}%`;
            
            if (array.length <= 25) {
                const label = document.createElement('span');
                label.classList.add('sort-bar-value');
                label.textContent = val;
                bar.appendChild(label);
            }
            
            board.appendChild(bar);
        });
    }

    function renderDiagram() {
        arrayDiagram.innerHTML = '';
        const isHeap = sortAlgorithm.value === 'heap';

        array.forEach((val, idx) => {
            const node = document.createElement('div');
            node.classList.add('diagram-node');
            node.id = `diagram-${idx}`;

            const valEl = document.createElement('span');
            valEl.classList.add('diagram-node-val');
            valEl.textContent = val;

            const idxEl = document.createElement('span');
            idxEl.classList.add('diagram-node-idx');
            
            if (isHeap) {
                const parentIdx = Math.floor((idx - 1) / 2);
                idxEl.textContent = idx === 0 ? 'root' : `p:${parentIdx}`;
            } else {
                idxEl.textContent = `[${idx}]`;
            }

            node.appendChild(valEl);
            node.appendChild(idxEl);
            arrayDiagram.appendChild(node);
        });
    }

    function updateInfoPanel() {
        const algo = sortAlgorithm.value;
        const details = ALGO_DETAILS[algo];

        worstTime.textContent = details.worst;
        avgTime.textContent = details.avg;
        bestTime.textContent = details.best;
        spaceComp.textContent = details.space;
        stableSort.textContent = details.stable;
        sortDesc.textContent = details.desc;
    }

    function highlight(idx, className, active = true) {
        const bar = document.getElementById(`bar-${idx}`);
        const node = document.getElementById(`diagram-${idx}`);
        
        if (bar) {
            if (active) bar.classList.add(className);
            else bar.classList.remove(className);
        }

        if (node) {
            if (className === 'comparing') {
                if (active) node.classList.add('active-check');
                else node.classList.remove('active-check');
            } else if (className === 'swapping') {
                if (active) node.classList.add('active-swap');
                else node.classList.remove('active-swap');
            } else if (className === 'sorted') {
                if (active) node.classList.add('active-sorted');
                else node.classList.remove('active-sorted');
            }
        }
    }

    function clearHighlights() {
        for (let i = 0; i < array.length; i++) {
            const bar = document.getElementById(`bar-${i}`);
            const node = document.getElementById(`diagram-${i}`);
            if (bar) bar.className = 'sort-bar';
            if (node) node.className = 'diagram-node';
        }
    }

    function setSortingState(active) {
        isPlaying = active;
        sortAlgorithm.disabled = false; // Always leave select enabled so user can switch anytime!
        randomizeBtn.disabled = active;
        applyInputBtn.disabled = active;
        
        if (active) {
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Running';
            playBtn.disabled = true;
            pauseBtn.disabled = false;
        } else {
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            isPaused = false;
        }
    }

    function pauseSorting() {
        if (!isPlaying || isPaused) return;
        isPaused = true;
        pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
        playBtn.disabled = false;
    }

    function resumeSorting() {
        if (!isPaused) return;
        isPaused = false;
        pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        playBtn.disabled = true;
        if (pauseResolve) {
            pauseResolve();
            pauseResolve = null;
        }
    }

    function resetControls() {
        if (isPlaying) {
            cancelSorting = true;
            if (pauseResolve) pauseResolve();
        }
        setSortingState(false);
        isPaused = false;
        cancelSorting = false;
        array = [...originalArray];
        renderBoard();
        renderDiagram();
    }

    // Backend Execution & Playback + JS Fallback
    async function startSorting() {
        setSortingState(true);
        cancelSorting = false;
        isPaused = false;
        clearHighlights();

        const algo = sortAlgorithm.value;
        const url = `/api/run?mode=sort&algo=${algo}&input=${array.join(',')}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Backend execution failed");
            }
            const frames = await response.json();
            await playFrames(frames);
        } catch (err) {
            console.warn("Backend server not available. Falling back to client-side JS implementation.", err.message);
            try {
                if (algo === 'bubble') await jsBubble();
                else if (algo === 'selection') await jsSelection();
                else if (algo === 'insertion') await jsInsertion();
                else if (algo === 'merge') await jsMergeWrapper();
                else if (algo === 'quick') await jsQuickWrapper();
                else if (algo === 'heap') await jsHeap();
                
                for (let i = 0; i < array.length; i++) {
                    highlight(i, 'sorted', true);
                }
            } catch (jsErr) {
                console.log("JS sorting cancelled/stopped: ", jsErr.message);
            }
        } finally {
            setSortingState(false);
        }
    }

    async function playFrames(frames) {
        for (let fIdx = 0; fIdx < frames.length; fIdx++) {
            await checkPause();
            const frame = frames[fIdx];
            const delay = parseInt(speedSlider.value);
            
            for (let i = 0; i < array.length; i++) {
                const bar = document.getElementById(`bar-${i}`);
                if (bar && !bar.classList.contains('sorted')) {
                    bar.classList.remove('comparing', 'swapping', 'pivot');
                }
                const node = document.getElementById(`diagram-${i}`);
                if (node && !node.classList.contains('active-sorted')) {
                    node.classList.remove('active-check', 'active-swap');
                }
            }
            
            if (frame.type === 'compare') {
                highlight(frame.i, 'comparing', true);
                highlight(frame.j, 'comparing', true);
                await sleep(delay);
            }
            else if (frame.type === 'swap') {
                let temp = array[frame.i];
                array[frame.i] = array[frame.j];
                array[frame.j] = temp;
                
                renderBoard();
                renderDiagram();
                
                highlight(frame.i, 'swapping', true);
                highlight(frame.j, 'swapping', true);
                await sleep(delay);
            }
            else if (frame.type === 'pivot') {
                highlight(frame.i, 'pivot', true);
                await sleep(delay);
            }
            else if (frame.type === 'set') {
                array[frame.i] = frame.val_i;
                renderBoard();
                renderDiagram();
                highlight(frame.i, 'swapping', true);
                await sleep(delay);
            }
            else if (frame.type === 'sorted') {
                highlight(frame.i, 'sorted', true);
            }
        }
    }

    // JS Fallback implementations
    async function swap(i, j) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        renderBoard();
        renderDiagram();
        highlight(i, 'swapping', true);
        highlight(j, 'swapping', true);
        await sleep(parseInt(speedSlider.value));
        await checkPause();
        highlight(i, 'swapping', false);
        highlight(j, 'swapping', false);
    }

    async function jsBubble() {
        let n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                highlight(j, 'comparing', true);
                highlight(j + 1, 'comparing', true);
                await sleep(parseInt(speedSlider.value));
                await checkPause();
                if (array[j] > array[j + 1]) {
                    await swap(j, j + 1);
                }
                highlight(j, 'comparing', false);
                highlight(j + 1, 'comparing', false);
            }
            highlight(n - i - 1, 'sorted', true);
        }
    }

    async function jsSelection() {
        let n = array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            highlight(minIdx, 'pivot', true);
            for (let j = i + 1; j < n; j++) {
                highlight(j, 'comparing', true);
                await sleep(parseInt(speedSlider.value));
                await checkPause();
                if (array[j] < array[minIdx]) {
                    highlight(minIdx, 'pivot', false);
                    minIdx = j;
                    highlight(minIdx, 'pivot', true);
                } else {
                    highlight(j, 'comparing', false);
                }
            }
            if (minIdx !== i) {
                await swap(i, minIdx);
            }
            highlight(minIdx, 'pivot', false);
            highlight(i, 'sorted', true);
        }
    }

    async function jsInsertion() {
        let n = array.length;
        highlight(0, 'sorted', true);
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;
            highlight(i, 'comparing', true);
            await sleep(parseInt(speedSlider.value));
            await checkPause();
            while (j >= 0 && array[j] > key) {
                highlight(j, 'comparing', true);
                array[j + 1] = array[j];
                renderBoard();
                renderDiagram();
                highlight(j + 1, 'swapping', true);
                await sleep(parseInt(speedSlider.value));
                await checkPause();
                highlight(j + 1, 'swapping', false);
                highlight(j, 'comparing', false);
                j--;
            }
            array[j + 1] = key;
            renderBoard();
            renderDiagram();
            highlight(i, 'comparing', false);
            for (let k = 0; k <= i; k++) {
                highlight(k, 'sorted', true);
            }
        }
    }

    async function jsMergeWrapper() {
        await jsMergeSort(0, array.length - 1);
    }

    async function jsMergeSort(l, r) {
        if (l >= r) return;
        let m = l + Math.floor((r - l) / 2);
        await jsMergeSort(l, m);
        await jsMergeSort(m + 1, r);
        await jsMerge(l, m, r);
    }

    async function jsMerge(l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = [];
        let R = [];
        for (let i = 0; i < n1; i++) L.push(array[l + i]);
        for (let j = 0; j < n2; j++) R.push(array[m + 1 + j]);

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            highlight(l + i, 'comparing', true);
            highlight(m + 1 + j, 'comparing', true);
            await sleep(parseInt(speedSlider.value));
            await checkPause();
            if (L[i] <= R[j]) {
                array[k] = L[i];
                i++;
            } else {
                array[k] = R[j];
                j++;
            }
            highlight(k, 'swapping', true);
            renderBoard();
            renderDiagram();
            await sleep(parseInt(speedSlider.value));
            highlight(k, 'swapping', false);
            highlight(l + Math.min(i, n1-1), 'comparing', false);
            highlight(m + 1 + Math.min(j, n2-1), 'comparing', false);
            k++;
        }
        while (i < n1) {
            array[k] = L[i];
            highlight(k, 'swapping', true);
            renderBoard();
            renderDiagram();
            await sleep(parseInt(speedSlider.value));
            await checkPause();
            highlight(k, 'swapping', false);
            i++;
            k++;
        }
        while (j < n2) {
            array[k] = R[j];
            highlight(k, 'swapping', true);
            renderBoard();
            renderDiagram();
            await sleep(parseInt(speedSlider.value));
            await checkPause();
            highlight(k, 'swapping', false);
            j++;
            k++;
        }
    }

    async function jsQuickWrapper() {
        await jsQuickSort(0, array.length - 1);
    }

    async function jsQuickSort(low, high) {
        if (low < high) {
            let pi = await jsPartition(low, high);
            await jsQuickSort(low, pi - 1);
            await jsQuickSort(pi + 1, high);
        }
    }

    async function jsPartition(low, high) {
        let pivot = array[high];
        highlight(high, 'pivot', true);
        let i = low - 1;
        for (let j = low; j < high; j++) {
            highlight(j, 'comparing', true);
            await sleep(parseInt(speedSlider.value));
            await checkPause();
            if (array[j] < pivot) {
                i++;
                await swap(i, j);
            }
            highlight(j, 'comparing', false);
        }
        await swap(i + 1, high);
        highlight(high, 'pivot', false);
        highlight(i + 1, 'sorted', true);
        return i + 1;
    }

    async function jsHeap() {
        let n = array.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await jsHeapify(n, i);
        }
        for (let i = n - 1; i > 0; i--) {
            await swap(0, i);
            highlight(i, 'sorted', true);
            await jsHeapify(i, 0);
        }
    }

    async function jsHeapify(n, i) {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < n) {
            highlight(l, 'comparing', true);
            highlight(largest, 'comparing', true);
            await sleep(parseInt(speedSlider.value));
            await checkPause();
            if (array[l] > array[largest]) largest = l;
            highlight(l, 'comparing', false);
            highlight(largest, 'comparing', false);
        }
        if (r < n) {
            highlight(r, 'comparing', true);
            highlight(largest, 'comparing', true);
            await sleep(parseInt(speedSlider.value));
            await checkPause();
            if (array[r] > array[largest]) largest = r;
            highlight(r, 'comparing', false);
            highlight(largest, 'comparing', false);
        }
        if (largest !== i) {
            await swap(i, largest);
            await jsHeapify(n, largest);
        }
    }
});
