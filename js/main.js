document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Mobile Sidebar Drawer Toggle
    // ----------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // ----------------------------------------------------
    // SPA Tab Switching Logic
    // ----------------------------------------------------
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const featureCards = document.querySelectorAll('.feature-card');

    function switchTab(tabId) {
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Close mobile drawer on navigation
        if (sidebar) sidebar.classList.remove('open');

        if (tabId === 'graphs') {
            if (window.resizeGraphCanvas) window.resizeGraphCanvas();
        } else if (tabId === 'backtracking') {
            if (window.resizeColoringCanvas) window.resizeColoringCanvas();
        } else if (tabId === 'sorting') {
            const activeLang = document.querySelector('.lang-tab.active[data-algo="sort"]') || { getAttribute: () => 'py' };
            const lang = typeof activeLang.getAttribute === 'function' ? activeLang.getAttribute('data-lang') : 'py';
            updateCodeSnippets(lang, 'sort');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const tabId = card.getAttribute('data-target');
            switchTab(tabId);
        });
    });

    // ----------------------------------------------------
    // Looping Typewriter Effect
    // ----------------------------------------------------
    const typewriterEl = document.getElementById('typewriter');
    const textToType = "A Website Made by Debayan kundu";
    let textIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function handleTypewriter() {
        const currentText = textToType.substring(0, textIdx);
        if (typewriterEl) typewriterEl.textContent = currentText;

        if (!isDeleting && textIdx < textToType.length) {
            textIdx++;
            typeSpeed = 100 + Math.random() * 50;
        } else if (isDeleting && textIdx > 0) {
            textIdx--;
            typeSpeed = 50;
        } else if (!isDeleting && textIdx === textToType.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && textIdx === 0) {
            isDeleting = false;
            typeSpeed = 500;
        }

        setTimeout(handleTypewriter, typeSpeed);
    }

    if (typewriterEl) {
        handleTypewriter();
    }

    // ----------------------------------------------------
    // Code Snippet Tabs Switching
    // ----------------------------------------------------
    const languageTabs = document.querySelectorAll('.lang-tab');

    function updateCodeSnippets(lang, algoType) {
        if (algoType === 'nqueens') {
            const activeAlgo = 'nqueens';
            const snippetEl = document.getElementById('code-snippet-nqueens');
            if (snippetEl && CODE_TEMPLATES[activeAlgo]) {
                snippetEl.textContent = CODE_TEMPLATES[activeAlgo][lang] || CODE_TEMPLATES[activeAlgo]['py'];
            }
        } else if (algoType === 'coloring') {
            const activeAlgo = 'coloring';
            const snippetEl = document.getElementById('code-snippet-coloring');
            if (snippetEl && CODE_TEMPLATES[activeAlgo]) {
                snippetEl.textContent = CODE_TEMPLATES[activeAlgo][lang] || CODE_TEMPLATES[activeAlgo]['py'];
            }
        } else if (algoType === 'sort') {
            const sortAlgoEl = document.getElementById('sort-algorithm');
            const activeAlgo = sortAlgoEl ? sortAlgoEl.value : 'bubble';
            const snippetEl = document.getElementById('code-snippet-sorting');
            if (snippetEl && CODE_TEMPLATES[activeAlgo]) {
                snippetEl.textContent = CODE_TEMPLATES[activeAlgo][lang] || CODE_TEMPLATES[activeAlgo]['py'];
            }
        } else {
            const graphAlgoEl = document.getElementById('graph-algorithm');
            const activeAlgo = graphAlgoEl ? graphAlgoEl.value : 'dijkstra';
            const snippetEl = document.getElementById('code-snippet');
            if (snippetEl && CODE_TEMPLATES[activeAlgo]) {
                snippetEl.textContent = CODE_TEMPLATES[activeAlgo][lang] || CODE_TEMPLATES[activeAlgo]['py'];
            }
        }
    }

    languageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const container = tab.closest('.code-viewer-container');
            const siblingTabs = container.querySelectorAll('.lang-tab');
            siblingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const lang = tab.getAttribute('data-lang');
            const algoType = tab.getAttribute('data-algo');
            updateCodeSnippets(lang, algoType);
        });
    });

    window.updateCodeSnippets = updateCodeSnippets;

    // ----------------------------------------------------
    // Copy Code Buttons Handler
    // ----------------------------------------------------
    const copyBtns = document.querySelectorAll('.btn-copy');
    const toast = document.getElementById('toast');

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target-code');
            const codeEl = document.getElementById(targetId);
            if (codeEl) {
                const text = codeEl.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    showToast('Code copied to clipboard!');
                }).catch(() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Code copied to clipboard!');
                });
            }
        });
    });
});
