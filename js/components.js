// Komponen SourceTag
class SourceTag extends HTMLElement {
    connectedCallback() {
        const source = this.getAttribute('source') || 'TODO_VERIFIKASI';
        // Anggap kita mengakses global config untuk cek mode
        const isDev = window.APP_CONFIG ? window.APP_CONFIG.mode === 'development' : true;
        
        const span = document.createElement('span');
        
        if (source === 'TODO_VERIFIKASI') {
            span.className = 'source-tag unverified';
            // Hanya tampilkan peringatan di mode development
            span.textContent = isDev ? '[Belum diverifikasi]' : '';
            if(!isDev) span.style.display = 'none';
        } else {
            span.className = 'source-tag';
            span.textContent = `[Sumber: ${source}]`;
        }
        
        this.appendChild(span);
    }
}
customElements.define('source-tag', SourceTag);

// Komponen MascotBubble
class MascotBubble extends HTMLElement {
    connectedCallback() {
        const text = this.getAttribute('text') || 'Halo!';
        
        this.innerHTML = `
            <div class="mascot-text">${text}</div>
            <div class="mascot-avatar">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="#D9D2C5"/>
                    <text x="50" y="55" font-size="40" text-anchor="middle" alignment-baseline="middle">👤</text>
                </svg>
            </div>
            <div class="mascot-disclaimer">Tokoh rekaan, terinspirasi dari kisah nyata para pelajar.</div>
        `;
    }
}
customElements.define('mascot-bubble', MascotBubble);
