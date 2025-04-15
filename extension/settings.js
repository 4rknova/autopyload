document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['host', 'port', 'username', 'password'], (data) => {
        document.getElementById('host').value = data.host || '';
        document.getElementById('port').value = data.port || '8000';
        document.getElementById('username').value = data.username || '';
        document.getElementById('password').value = data.password || '';
    });

    document.getElementById('save-settings').addEventListener('click', () => {
        const host = document.getElementById('host').value.trim();
        const port = document.getElementById('port').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!host || !port || !username || !password) {
            document.getElementById('status').textContent = 'Please fill in all fields.';
            return;
        }

        chrome.storage.local.set({ host, port, username, password }, () => {
            document.getElementById('status').textContent = 'Settings saved!';
            setTimeout(() => document.getElementById('status').textContent = '', 2000);
        });
    });
});
