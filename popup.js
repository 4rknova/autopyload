// Utility function to handle HTTP requests
function sendRequest(method, url, data, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          callback(true, response);
        } else {
          callback(false, response ? response.error : 'Unexpected error');
        }
      } catch (e) {
        callback(false, 'Invalid server response');
      }
    }
  };

  xhr.timeout = 5000;
  xhr.ontimeout = function () {
    callback(false, 'Server unreachable');
  };

  const params = new URLSearchParams(data).toString();
  xhr.send(params);
}

// Function to check server status
function checkServerStatus(callback) {
  sendRequest('POST', `${origin}/api/statusServer`, {}, (success, response) => {
    if (success) {
      callback(true);
    } else {
      callback(false, response || 'Server not found');
    }
  });
}

// Function to login and set session
function loginToServer(username, password, callback) {
  sendRequest('POST', `${origin}/api/login`, { username, password }, (success, response) => {
    if (success && response.authenticated) {
      callback(true);
    } else {
      callback(false, 'Login failed, invalid credentials');
    }
  });
}

// Function to add the current tab URL to pyLoad
function addDownloadPackage(name, url, callback) {
  const safeName = name.replace(/[^a-z0-9._\-]/gi, '_');
  const data = { name: `"${encodeURIComponent(safeName)}"`, links: `[ "${encodeURIComponent(url)}" ]` };

  sendRequest('POST', `${origin}/api/addPackage`, data, (success, response) => {
    if (success) {
      callback(true);
    } else {
      callback(false, response);
    }
  });
}

// Initialize form and actions on page load
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['host', 'port', 'username', 'password'], (data) => {
    document.getElementById('host').value = data.host || '';
    document.getElementById('port').value = data.port || '8000';
    document.getElementById('username').value = data.username || '';
    document.getElementById('password').value = data.password || '';
  });
});

// Handle form submission
document.getElementById('save').addEventListener('click', () => {
  const host = document.getElementById('host').value.trim();
  const port = document.getElementById('port').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!host || !port || !username || !password) {
    document.getElementById('status').textContent = 'Please fill in all fields.';
    return;
  }

  chrome.storage.local.set({ host, port, username, password });
  origin = `http://${host}:${port}`;
  document.getElementById('status').textContent = 'Connecting to pyLoad...';

  checkServerStatus((success, errorMsg) => {
    if (!success) {
      document.getElementById('status').textContent = errorMsg;
      return;
    }

    loginToServer(username, password, (loggedIn, loginError) => {
      if (!loggedIn) {
        document.getElementById('status').textContent = loginError;
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        const name = new URL(url).hostname || 'Download';

        addDownloadPackage(name, url, (success, errorMsg) => {
          if (success) {
            document.getElementById('status').textContent = 'URL added to pyLoad!';
          } else {
            document.getElementById('status').textContent = 'Error: ' + errorMsg;
          }
        });
      });
    });
  });
});