({
    state: {
        isFirstVisit: true,
        currentView: 'lander',
        keyword: "",
        results: [],
        loading: false
    },

    sys: null,
    appName: 'trend-signal',

    themes: {
        dark: {
            '--bg-root': '#06b6d4',
            '--glass': 'rgba(15, 23, 42, 0.95)',
            '--glass-border': '1px solid rgba(255, 255, 255, 0.1)',
            '--txt': '#f8fafc',
            '--prm': '#38bdf8'
        }
    },

    mount(sys) {
        this.sys = sys;
        this.render();
        this.onThemeChange('dark');
    },

    onThemeChange(t) {
        const theme = this.themes[t] || this.themes['dark'];
        for (const [key, value] of Object.entries(theme)) this.sys.root.style.setProperty(key, value);
    },

    async analyze() {
        if(!this.state.keyword) return this.sys.toast("Enter keyword", "error");
        this.state.loading = true;
        this.render();

        this.sys.toast("Scanning velocity...", "info");

        // Mocking API call for demo (keeping logic structure)
        setTimeout(() => {
            this.state.results = [
                { title: "The Future of AI 2026", velocity: "2.4k VPH", views: "1.2M" },
                { title: "Why Web3 is Returning", velocity: "1.1k VPH", views: "450k" }
            ];
            this.state.loading = false;
            this.render();
        }, 1500);
    },

    render() {
        this.sys.root.innerHTML = `
            <div class="app-root">
                <div class="content-limit">
                    <div class="glass-panel">
                        <h2 style="font-weight: 900; color: #38bdf8; margin-bottom: 15px;">TREND RADAR</h2>
                        <div style="display: flex; gap: 10px;">
                            <input id="inp-kw" class="input-blue" placeholder="Enter Niche Keyword..." value="${this.state.keyword}">
                            <button id="btn-scan" class="btn-blue">${this.state.loading ? '...' : 'SCAN'}</button>
                        </div>
                    </div>

                    <div style="width: 100%; margin-top: 20px; display: grid; gap: 15px;">
                        ${this.state.results.map(res => `
                            <div class="glass-panel" style="padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 700; color: #fff;">${res.title}</div>
                                    <div style="font-size: 10px; color: #38bdf8;">${res.views} Views</div>
                                </div>
                                <div style="text-align: right; color: #10b981; font-weight: 900;">${res.velocity}</div>
                            </div>
                        `).join('')}
                        ${this.state.results.length === 0 && !this.state.loading ? '<p style="text-align:center; opacity:0.5;">No signals detected.</p>' : ''}
                    </div>
                </div>
            </div>
            <style>
                .app-root { width: 100%; height: 100%; background: var(--bg-root); color: var(--txt); padding: 85px 20px; overflow-y: auto; }
                .content-limit { width: 100%; max-width: 1020px; margin: 0 auto; }
                .glass-panel { background: var(--glass); border: var(--glass-border); border-radius: 24px; padding: 25px; }
                .btn-blue { background: #2563eb; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; }
                .input-blue { background: rgba(0,0,0,0.3); border: 1px solid #38bdf8; color: #38bdf8 !important; padding: 12px; border-radius: 12px; flex: 1; outline: none; }
            </style>
        `;
        this.bindEvents();
    },

    bindEvents() {
        const root = this.sys.root;
        const btn = root.querySelector('#btn-scan');
        if(btn) btn.onclick = () => {
            this.state.keyword = root.querySelector('#inp-kw').value;
            this.analyze();
        };
    }
})