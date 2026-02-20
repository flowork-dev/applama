({
    state: {
        isFirstVisit: true,
        currentView: 'lander',
        isPlaying: false,
        speed: 3,
        fontSize: 40,
        isMirrored: false,
        script: "WELCOME CREATOR!\n\nThis is your tactical prompter.\n\nTips:\n1. Adjust speed to your pace.\n2. Mirror mode for glass reflectors.\n3. Stay focused and smile!\n\n(This text will scroll automatically...)\n\nFlowork V2.0",
        scrollPos: 0
    },

    sys: null,
    observer: null,
    appName: 'tele-ops',
    rafId: null,

    themes: {
        dark: {
            '--bg-root': '#06b6d4',
            '--glass': 'rgba(15, 23, 42, 0.95)',
            '--glass-border': '1px solid rgba(255, 255, 255, 0.1)',
            '--txt': '#f8fafc',
            '--txt-dim': '#94a3b8',
            '--prm': '#38bdf8',
            '--scs': '#10b981',
            '--err': '#ef4444'
        },
        light: {
            '--bg-root': '#06b6d4',
            '--glass': 'rgba(255, 255, 255, 0.95)',
            '--glass-border': '1px solid rgba(0, 0, 0, 0.1)',
            '--txt': '#0f172a',
            '--txt-dim': '#64748b',
            '--prm': '#2563eb'
        }
    },

    mount(sys) {
        this.sys = sys;
        if (localStorage.getItem('app_visited_' + this.appName)) {
            this.state.isFirstVisit = false;
            this.state.currentView = 'main';
        }
        this.render();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.onThemeChange(currentTheme);
    },

    unmount() {
        cancelAnimationFrame(this.rafId);
        this.sys.root.innerHTML = '';
    },

    onThemeChange(t) {
        const theme = this.themes[t] || this.themes['dark'];
        for (const [key, value] of Object.entries(theme)) this.sys.root.style.setProperty(key, value);
    },

    togglePlay() {
        this.state.isPlaying = !this.state.isPlaying;
        const btn = this.sys.root.querySelector('#btn-play');
        if(btn) btn.innerText = this.state.isPlaying ? "PAUSE" : "PLAY";

        if(this.state.isPlaying) this.loop();
    },

    loop() {
        if(!this.state.isPlaying) return;
        const container = this.sys.root.querySelector('#prompter-scroll');
        if(container) {
            this.state.scrollPos += (this.state.speed * 0.5);
            container.scrollTop = this.state.scrollPos;

            if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
                this.state.isPlaying = false;
                this.togglePlay();
                return;
            }
        }
        this.rafId = requestAnimationFrame(() => this.loop());
    },

    render() {
        const { currentView } = this.state;
        this.sys.root.innerHTML = `
            <div class="app-root">
                <div class="content-limit">
                    ${currentView === 'lander' ? this.renderLander() : this.renderMain()}
                </div>
            </div>
            <style>
                .app-root { width: 100%; height: 100%; background: var(--bg-root); color: var(--txt); padding: 85px 20px; overflow: hidden; }
                .content-limit { width: 100%; max-width: 1020px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; }
                .glass-panel { background: var(--glass); border: var(--glass-border); border-radius: 24px; padding: 25px; box-shadow: var(--shadow); }
                .btn-blue { background: #2563eb; color: #fff; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; }
                .input-blue { background: rgba(0,0,0,0.2); border: 1px solid #38bdf8; color: #38bdf8 !important; padding: 15px; border-radius: 12px; width: 100%; font-family: monospace; }
                .prompter-view { background: #000; border-radius: 20px; flex: 1; overflow: hidden; position: relative; margin-top: 20px; }
                #prompter-scroll { height: 100%; overflow-y: scroll; scrollbar-width: none; padding: 50vh 20px; text-align: center; }
            </style>
        `;
        this.bindEvents();
    },

    renderLander() {
        return `<div class="glass-panel" style="text-align: center;"><h1>TELE OPS</h1><p>Tactical Prompter Engine</p><button id="btn-start" class="btn-blue" style="width: 100%;">START STUDIO</button></div>`;
    },

    renderMain() {
        return `
            <div class="glass-panel" style="margin-bottom: 10px;">
                <textarea id="script-input" class="input-blue" style="height: 120px;">${this.state.script}</textarea>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 15px;">
                    <button id="btn-play" class="btn-blue">PLAY</button>
                    <button id="btn-reset" class="btn-blue" style="background: #64748b;">RESET</button>
                    <div class="btn-blue" style="background: rgba(0,0,0,0.3); font-size: 10px; display: flex; flex-direction: column; align-items: center;">
                        <span>SPEED</span>
                        <input type="range" id="speed-range" min="1" max="10" value="${this.state.speed}" style="width: 100%;">
                    </div>
                </div>
            </div>
            <div class="prompter-view">
                <div id="prompter-scroll" style="font-size: ${this.state.fontSize}px; ${this.state.isMirrored ? 'transform: scaleX(-1);' : ''}">
                    ${this.state.script.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    },

    bindEvents() {
        const root = this.sys.root;
        const btnStart = root.querySelector('#btn-start');
        if(btnStart) btnStart.onclick = () => { this.state.currentView = 'main'; this.render(); };

        const btnPlay = root.querySelector('#btn-play');
        if(btnPlay) btnPlay.onclick = () => this.togglePlay();

        const btnReset = root.querySelector('#btn-reset');
        if(btnReset) btnReset.onclick = () => { this.state.scrollPos = 0; this.render(); };

        const speedRange = root.querySelector('#speed-range');
        if(speedRange) speedRange.oninput = (e) => this.state.speed = parseInt(e.target.value);

        const scriptIn = root.querySelector('#script-input');
        if(scriptIn) scriptIn.oninput = (e) => { this.state.script = e.target.value; this.render(); };
    }
})