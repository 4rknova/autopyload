function renderHistory(history = []) {
    const container = document.getElementById('history-rows');
    container.innerHTML = '';

    if (!history.length) {
        container.innerHTML = `<div class="history-row empty">No downloads yet.</div>`;
        return;
    }

    history.slice().reverse().forEach(entry => {
        const row = document.createElement('div');
        row.className = 'history-row';
        row.innerHTML = `
            <span class="col-name">${entry.name}</span>
            <span class="col-url">
                <button class="copy-btn" data-url="${entry.url}" title="Copy URL">📋</button>
                <span class="url-text" title="${entry.url}">${entry.url}</span>
            </span>
            <span class="col-date">${new Date(entry.date).toLocaleString()}</span>
        `;
        container.appendChild(row);
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            navigator.clipboard.writeText(url).then(() => {
                btn.textContent = '✓';
                setTimeout(() => btn.textContent = '📋', 1000);
            });
        });
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get({ downloadHistory: [] }, (data) => {
        renderHistory(data.downloadHistory);
    });
});

// Auto-update on changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.downloadHistory) {
        renderHistory(changes.downloadHistory.newValue || []);
    }
});

document.getElementById('clear-history').addEventListener('click', async () => {
    await chrome.storage.local.set({ downloadHistory: [] });
    document.getElementById('download-history').innerHTML = '<li class="empty">History cleared.</li>';
});