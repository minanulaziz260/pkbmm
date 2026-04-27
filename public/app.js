/* ===== PKBM MUGI SAE — shared frontend helpers ===== */
(function () {
  'use strict';

  const TOKEN_KEY = 'pkbm:token';
  const USER_KEY  = 'pkbm:user';

  /* ===== Auth state ===== */
  const Auth = {
    get token() { return localStorage.getItem(TOKEN_KEY); },
    get user()  { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; } },
    save(token, user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
    },
    clear() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    requireOrRedirect(redirectTo) {
      if (!this.token) {
        window.location.href = redirectTo || '/login.html';
        throw new Error('redirected');
      }
    },
  };

  /* ===== HTTP wrapper around fetch with JWT ===== */
  async function api(method, url, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.token;
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch (e) { /* no JSON */ }
    if (!res.ok) {
      // Auto-logout on 401
      if (res.status === 401) {
        Auth.clear();
        if (!window.location.pathname.endsWith('/login.html')) {
          window.location.href = '/login.html';
        }
      }
      const err = new Error((data && data.message) || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  /* ===== Toast ===== */
  let toastHost;
  function toast(msg, level = 'info', duration = 2400) {
    if (!toastHost) {
      toastHost = document.createElement('div');
      toastHost.id = 'toast-host';
      document.body.appendChild(toastHost);
    }
    const el = document.createElement('div');
    el.className = `toast ${level}`;
    el.textContent = msg;
    toastHost.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  /* ===== Modal ===== */
  function ensureModalHost() {
    let host = document.getElementById('modal-host');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'modal-host';
    host.className = 'modal-backdrop';
    host.hidden = true;
    host.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <header>
          <h2 id="modal-title"></h2>
          <button class="x" type="button" id="modal-close" aria-label="Tutup">×</button>
        </header>
        <div class="body" id="modal-body"></div>
      </div>`;
    document.body.appendChild(host);
    host.addEventListener('click', e => { if (e.target === host) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !host.hidden) closeModal();
    });
    host.querySelector('#modal-close').addEventListener('click', closeModal);
    return host;
  }
  function openModal(title, html) {
    const host = ensureModalHost();
    host.querySelector('#modal-title').textContent = title;
    host.querySelector('#modal-body').innerHTML = html;
    host.hidden = false;
  }
  function closeModal() {
    const host = document.getElementById('modal-host');
    if (host) host.hidden = true;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function fmtDate(s) {
    if (!s) return '-';
    try { return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return s; }
  }

  /* ===== Header / nav rendering for protected pages ===== */
  function renderHeader(activeKey) {
    const u = Auth.user || {};
    const links = [
      { key: 'dashboard',  href: '/dashboard.html',  label: 'Dashboard' },
      { key: 'users',      href: '/users.html',      label: 'Pengguna' },
      { key: 'packages',   href: '/packages.html',   label: 'Paket' },
      { key: 'curriculum', href: '/curriculum.html', label: 'Kurikulum' },
    ];
    const html = `
      <header class="app-header">
        <div class="brand">
          <div class="logo">MS</div>
          <div>
            <div class="title">PKBM MUGI SAE</div>
            <div class="sub">Paket A · B · C</div>
          </div>
        </div>
        <nav class="nav">
          ${links.map(l => `<a href="${l.href}" class="${l.key === activeKey ? 'active' : ''}">${l.label}</a>`).join('')}
        </nav>
        <div class="right">
          <span class="who">${escapeHtml(u.name || '')} · <span class="muted">${escapeHtml(u.role || '')}</span></span>
          <button class="btn ghost" id="logout-btn" type="button">Keluar</button>
        </div>
      </header>`;
    const host = document.getElementById('app-header') || document.body;
    if (host.id === 'app-header') {
      host.outerHTML = html;
    } else {
      const div = document.createElement('div');
      div.innerHTML = html;
      document.body.prepend(div.firstElementChild);
    }
    document.getElementById('logout-btn').addEventListener('click', async () => {
      try { await api('POST', '/api/auth/logout'); } catch (e) { /* ignore */ }
      Auth.clear();
      window.location.href = '/login.html';
    });
  }

  /* Expose */
  window.PKBM = {
    Auth, api, toast, openModal, closeModal, escapeHtml, fmtDate, renderHeader,
  };
})();
