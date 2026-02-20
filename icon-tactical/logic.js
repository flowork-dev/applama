({
    state: {
        isFirstVisit: true,
        currentView: 'lander',
        sourceImg: null,
        padding: 10,
        radius: 20,
        bgColor: "#ffffff"
    },

    sys: null,
    appName: 'icon-tactical',

    mount(sys) {
        this.sys = sys;
        this.render();
        this.onThemeChange('dark');
    },

    onThemeChange(t) {
        this.sys.root.style.setProperty('--bg-root', '#06b6d4');
    },

    handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.state.sourceImg = e.target.result;
            this.state.currentView = 'main';
            this.render();
        };
        reader.readAsDataURL(file);
    },

    saveToDevice(blob, filename, mimeType) {
        if (this.sys && typeof this.sys.download === 'function') {
            this.sys.download(blob, filename, mimeType);
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a);
        }
    },

    render() {
        this.sys.root.innerHTML = `
            <div class="app-root">
                <div class="content-limit">
                    <div class="glass-panel" style="text-align: center; width: 100%;">
                        <h2 style="font-weight: 900; color: #38bdf8; margin-bottom: 20px;">ICON TACTICAL</h2>

                        ${!this.state.sourceImg ? `
                            <div id="drop-zone" style="border: 2px dashed #38bdf8; padding: 40px; border-radius: 20px; cursor: pointer;">
                                <p>Drop logo here or Click to upload</p>
                                <input type="file" id="file-hidden" style="display:none" accept="image/*">
                            </div>
                        ` : `
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left;">
                                <div>
                                    <label style="font-size: 10px; font-weight: 900; color: #38bdf8;">PADDING (${this.state.padding}%)</label>
                                    <input type="range" id="rng-pad" min="0" max="40" value="${this.state.padding}" style="width: 100%;">

                                    <label style="font-size: 10px; font-weight: 900; color: #38bdf8; margin-top: 15px; display: block;">CORNER RADIUS (${this.state.radius}%)</label>
                                    <input type="range" id="rng-rad" min="0" max="50" value="${this.state.radius}" style="width: 100%;">

                                    <button id="btn-reset" class="btn-blue" style="width: 100%; margin-top: 20px; background: #ef4444;">NEW IMAGE</button>
                                </div>
                                <div style="display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.5); border-radius: 20px; padding: 20px;">
                                    <div style="width: 120px; height: 120px; background: ${this.state.bgColor}; border-radius: ${this.state.radius}%; padding: ${this.state.padding}%; overflow: hidden;">
                                        <img src="${this.state.sourceImg}" style="width: 100%; height: 100%; object-fit: contain;">
                                    </div>
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            <style>
                .app-root { width: 100%; height: 100%; background: var(--bg-root); padding: 85px 20px; color: #fff; }
                .content-limit { width: 100%; max-width: 800px; margin: 0 auto; }
                .glass-panel { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 30px; }
                .btn-blue { background: #2563eb; color: #fff; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; }
            </style>
        `;
        this.bindEvents();
    },

    bindEvents() {
        const root = this.sys.root;
        const drop = root.querySelector('#drop-zone');
        const fileIn = root.querySelector('#file-hidden');

        if(drop) drop.onclick = () => fileIn.click();
        if(fileIn) fileIn.onchange = (e) => this.handleFile(e.target.files[0]);

        const rngPad = root.querySelector('#rng-pad');
        if(rngPad) rngPad.oninput = (e) => { this.state.padding = e.target.value; this.render(); };

        const rngRad = root.querySelector('#rng-rad');
        if(rngRad) rngRad.oninput = (e) => { this.state.radius = e.target.value; this.render(); };

        const btnReset = root.querySelector('#btn-reset');
        if(btnReset) btnReset.onclick = () => { this.state.sourceImg = null; this.render(); };
    }
})