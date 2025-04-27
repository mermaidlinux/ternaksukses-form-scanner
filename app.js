document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const scanBtn = document.getElementById('scanBtn');
  const useSampleBtn = document.getElementById('useSampleBtn');
  const loading = document.getElementById('loading');
  const resultBox = document.getElementById('result');

  const sampleFormHtml = `<form id="sampleForm" action="/submit">
    <input type="text" name="user" placeholder="Username">
    <input type="password" name="pass" placeholder="Password">
    <input type="hidden" name="secret" value="123">
    <input type="submit" value="Submit">
  </form>`;
  const sampleDiv = document.createElement('div');
  sampleDiv.innerHTML = sampleFormHtml;
  sampleDiv.id = 'sample';
  sampleDiv.style.display = 'none';
  document.body.appendChild(sampleDiv);

  async function scanDocument(docRoot) {
    const forms = docRoot.querySelectorAll('form');
    if (!forms.length) return 'Tidak ditemukan form';
    let html = '';
    forms.forEach((form, i) => {
      const action = form.getAttribute('action') || 'N/A';
      const hasPassword = !!form.querySelector('input[type="password"]');
      const hasHidden = !!form.querySelector('input[type="hidden"]');
      html += `<strong>Form ${i+1}</strong><br>`;
      html += `Action: ${action}<br>`;
      html += `Password Field: ${hasPassword}<br>`;
      html += `Hidden Field: ${hasHidden}<br><br>`;
    });
    return html;
  }

  let deferredPrompt;
  const installBtn = document.createElement('button');
  installBtn.textContent = '📲 Install App';
  installBtn.id = 'installBtn';
  installBtn.style.cssText = `
    display:none;
    margin:10px auto;
    padding:8px 16px;
    background:#0288d1;
    color:#fff;
    border:none;
    border-radius:8px;
    cursor:pointer;
  `;
  document.querySelector('.container').appendChild(installBtn);
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // cegah Chrome otomatis prompt
    e.preventDefault();
    deferredPrompt = e;
    // tampilkan tombol install yang kita buat
    installBtn.style.display = 'block';
  });
  
  installBtn.addEventListener('click', async () => {
    installBtn.style.display = 'none';
    if (!deferredPrompt) return;
    // munculkan prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response to install prompt:', outcome);
    deferredPrompt = null;
  });
  
  // service-worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(reg => {
        console.log('Service Worker registered:', reg);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

  scanBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return alert('Masukkan URL terlebih dahulu');
    resultBox.innerHTML = '';
    loading.classList.remove('hidden');
    try {
      const proxy = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(proxy + encodeURIComponent(url));
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const res = await scanDocument(doc);
      resultBox.innerHTML = res;
    } catch(err) {
      resultBox.innerText = 'Error: ' + err.message;
    }
    loading.classList.add('hidden');
  });

  useSampleBtn.addEventListener('click', async () => {
    resultBox.innerHTML = '';
    loading.classList.remove('hidden');
    const formEl = document.getElementById('sampleForm');
    const res = await scanDocument(formEl);
    resultBox.innerHTML = res;
    loading.classList.add('hidden');
  });
});