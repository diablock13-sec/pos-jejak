import './components.js';

// State & Config App
window.APP_CONFIG = { mode: 'development' };

// Ambil config json
async function loadConfig() {
    try {
        const res = await fetch('data/config.json');
        window.APP_CONFIG = await res.json();
    } catch (e) {
        console.warn("Gagal memuat config.json, menggunakan default.");
    }
}

// Manajemen LocalStorage
const STORAGE_KEY = 'posJejakState';
function loadState() {
    const defaultState = { safetyAgreed: false, archiveFound: [false, false, false] };
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
}
function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Router Sederhana Berbasis Hash
function router() {
    const hash = window.location.hash.replace('#', '') || 'safety';
    const state = loadState();
    
    // Semua container disembunyikan
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    
    // Logika rute
    if (!state.safetyAgreed && hash !== 'safety') {
        window.location.hash = 'safety';
        return;
    }
    
    if (hash === 'safety') {
        if(state.safetyAgreed) {
            // Peringatan tetap muncul singkat, tapi pengguna bisa langsung lihat beranda jika diset paksa.
            // Sesuai aturan: "peringatan tetap muncul singkat tiap sesi baru", kita biarkan mereka centang lagi jika sesi reset, 
            // atau cukup aktifkan tombol jika sudah pernah setuju.
        }
        document.getElementById('safety-screen').classList.remove('hidden');
    } else if (hash === 'home') {
        document.getElementById('home-screen').classList.remove('hidden');
        updateArchiveUI(state);
    } else {
        // Halaman lain (Placeholder Tahap Selanjutnya)
        document.getElementById('other-screen').classList.remove('hidden');
        document.getElementById('content-area').innerHTML = `<h2>Memuat ${hash}...</h2><p>Halaman ini akan dibangun pada tahap selanjutnya.</p>`;
    }
}

function updateArchiveUI(state) {
    const count = state.archiveFound.filter(Boolean).length;
    document.getElementById('archive-count').textContent = count;
    
    if(count === 3) {
        document.getElementById('btn-surat').disabled = false;
    }
}

// Inisialisasi Event Listener
function init() {
    loadConfig().then(() => {
        // Keselamatan UI
        const check = document.getElementById('safety-check');
        const btnStart = document.getElementById('btn-start');
        
        check.addEventListener('change', (e) => {
            btnStart.disabled = !e.target.checked;
        });
        
        btnStart.addEventListener('click', () => {
            const state = loadState();
            state.safetyAgreed = true;
            saveState(state);
            window.location.hash = 'home';
        });

        // Router listener
        window.addEventListener('hashchange', router);
        
        // Panggilan awal
        router();
    });
}

document.addEventListener('DOMContentLoaded', init);
