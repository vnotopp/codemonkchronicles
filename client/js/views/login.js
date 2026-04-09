import { setAuth } from '../state/session.js';
import { ensureUser } from '../state/db.js';

export async function LoginView() {
  const div = document.createElement('div');
  div.className = 'content login-page fullscreen';
  // Signal to the app shell not to render the header on this page
  div.dataset.noHeader = 'true';
  // Signal to mount without the screen chrome for true fullscreen hero
  div.dataset.fullscreen = 'true';

  const clientId = "346150806212-3bgohgj0r0litmam5lsng5a89ggtkvu9.apps.googleusercontent.com";

  div.innerHTML = `
    <div class="login-wrap">
      <div class="login-hero">
        <button id="btn-vol" class="vol-btn" title="Music volume" aria-label="Music volume" aria-live="polite">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true">
            <path d="M3 10h4l5-4v12l-5-4H3z" fill="currentColor"/>
            <path d="M16 8a4 4 0 010 8" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
        <div class="wind" aria-hidden="true"></div>
        <div class="sparkle" aria-hidden="true"></div>
        <div class="sparkle s2" aria-hidden="true"></div>
        <div class="sparkle s3" aria-hidden="true"></div>
        <div class="sprite sprite-left" aria-hidden="true"></div>
        <div class="sprite sprite-right" aria-hidden="true"></div>
        <div class="login-card float-anim">
          <div class="login-brand">
            <span class="brand-logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 3l7 7-9 9-7-7 9-9z" fill="#ffde59" stroke="#000" stroke-width="2"/>
                <path d="M3 21l6-6" stroke="#fff" stroke-width="2"/>
                <path d="M6 18l-3 3" stroke="#000" stroke-width="3"/>
              </svg>
            </span>
            <div class="brand-title title-glow">CodeMonkChronicles</div>
          </div>
          <p class="login-subtitle fade-in-up" data-anim="0">A cozy coding adventure in a land of quests and knowledge.</p>
          <p class="login-motd fade-in-up" data-anim="1"><span id="motd"></span></p>
          <div id="googleBtn" class="fade-in-up" data-anim="2"></div>
          <div class="login-actions fade-in-up" data-anim="3">
            <button id="btn-guest" class="btn secondary">Continue as Guest</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set scenic background image (expects file at /assets/images/login-hero.jpg)
  const heroEl = div.querySelector('.login-hero');
  const heroUrl = '/assets/images/login-hero.jpg';
  const spriteLeftUrl = '/assets/images/sprite-left.gif';
  const spriteRightUrl = '/assets/images/sprite-right.gif';
  if (heroEl) {
    const img = new Image();
    img.onload = () => {
      heroEl.style.setProperty('--login-hero', `url('${heroUrl}')`);
      // Set sprite images when hero is ready
      heroEl.style.setProperty('--sprite-left', `url('${spriteLeftUrl}')`);
      heroEl.style.setProperty('--sprite-right', `url('${spriteRightUrl}')`);
    };
    img.onerror = () => {
      // Fallback: no image, keep gradient overlays
      console.warn('Login hero image not found at', heroUrl);
      heroEl.style.removeProperty('--login-hero');
    };
    img.src = heroUrl;

    // Preload sprites; if missing, hide elements gracefully
    ['left','right'].forEach(side => {
      const url = side === 'left' ? spriteLeftUrl : spriteRightUrl;
      const s = new Image();
      s.onload = () => { heroEl.style.setProperty(`--sprite-${side}`, `url('${url}')`); };
      s.onerror = () => {
        const el = div.querySelector(`.sprite-${side}`);
        if (el) el.style.display = 'none';
      };
      s.src = url;
    });
  }

  // Background Music (attempt autoplay; toggle on click)
  const bgm = new Audio('/assets/music/login-theme.mp3');
  bgm.preload = 'auto';
  bgm.loop = true; // ensure loop
  bgm.volume = 0.6; // default volume
  function tryPlay() {
    bgm.play().catch(() => { /* Autoplay blocked: wait for user gesture */ });
  }
  // Attempt immediate; some browsers allow if no interaction was required previously
  tryPlay();
  const onceStart = () => { if (bgm.paused) tryPlay(); document.removeEventListener('pointerdown', onceStart, true); };
  document.addEventListener('pointerdown', onceStart, true);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && bgm.volume > 0 && bgm.paused) tryPlay(); });
  // Volume icon cycles: mute -> 30% -> 60%
  const btnVol = div.querySelector('#btn-vol');
  const setIcon = () => {
    if (!btnVol) return;
    btnVol.classList.toggle('muted', bgm.volume === 0);
    btnVol.style.display = '';
  };
  btnVol?.addEventListener('click', (e) => {
    e.preventDefault();
    if (bgm.volume > 0.59) bgm.volume = 0.0; else if (bgm.volume > 0.0) bgm.volume = 0.6; else bgm.volume = 0.3;
    if (bgm.paused && bgm.volume > 0) tryPlay();
    setIcon();
  });
  setIcon();
  bgm.addEventListener('error', () => {
    console.warn('Background music failed to load at /assets/music/login-theme.mp3');
    if (btnVol) btnVol.style.display = 'none';
  });

  window.onGoogleSignIn = (response) => {
    try {
      const payload = parseJwt(response.credential);
      const user = ensureUser(payload.sub, {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
      setAuth({ user, token: response.credential });
      // If no class chosen yet, go to class select, else go home
      const next = user.primaryClass ? '/' : '/class';
      location.hash = next;
    } catch (e) {
      alert('Google sign-in failed.');
    }
  };

  // Ensure Google button renders in SPA navigation
  const tryRenderGoogle = () => {
    // Guard: help the developer if the client ID hasn't been set
    if (clientId.startsWith('YOUR_GOOGLE_CLIENT_ID')) {
      const btn = div.querySelector('#googleBtn');
      if (btn) btn.innerHTML = `<div class="notice">Set your Google OAuth Client ID in <code>client/js/views/login.js</code> to enable Google Sign-In.</div>`;
      return true; // Stop retrying; nothing to render without a valid clientId
    }
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: window.onGoogleSignIn,
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(
        div.querySelector('#googleBtn'),
        { theme: 'outline', size: 'medium', shape: 'pill', type: 'standard', logo_alignment: 'left' }
      );
      // Optionally show One Tap if available
      try { window.google.accounts.id.prompt(); } catch {}
      return true;
    }
    return false;
  };

  // Typewriter rotating messages under the subtitle
  const messages = [
    'Learn. Quest. Level up.',
    'Solve puzzles. Earn XP.',
    'Master the Monk within.',
  ];
  const motdEl = () => div.querySelector('#motd');
  let idx = 0, char = 0, deleting = false;
  function tick() {
    const el = motdEl(); if (!el) return;
    const full = messages[idx % messages.length];
    if (!deleting) {
      char++;
      el.textContent = full.slice(0, char);
      if (char === full.length) { deleting = true; setTimeout(tick, 1200); return; }
    } else {
      char--;
      el.textContent = full.slice(0, char);
      if (char === 0) { deleting = false; idx++; }
    }
    const delay = deleting ? 35 : 55;
    setTimeout(tick, delay);
  }
  // start typewriter after initial render
  setTimeout(tick, 400);

  if (!tryRenderGoogle()) {
    // If the script tag is missing, inject it
    const existing = document.querySelector('script[src^="https://accounts.google.com/gsi/client"]');
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true; s.defer = true;
      s.onload = () => tryRenderGoogle();
      document.head.appendChild(s);
    }
    // Retry for a bit while the script loads
    let attempts = 0;
    const maxAttempts = 100; // ~10s at 100ms
    const timer = setInterval(() => {
      attempts++;
      if (tryRenderGoogle() || attempts >= maxAttempts) clearInterval(timer);
    }, 100);
  }

  div.querySelector('#btn-guest').addEventListener('click', () => {
    const guestId = 'guest-' + Math.floor(Math.random() * 1e6);
    const user = ensureUser(guestId, { name: 'Guest', email: '', picture: '' });
    setAuth({ user, token: null });
    const next = user.primaryClass ? '/' : '/class';
    location.hash = next;
  });

  return wrapContent(div);
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function wrapContent(inner) {
  const c = document.createElement('div');
  c.className = 'content';
  c.appendChild(inner);
  // Propagate no-header flag to the wrapper so the shell can read it
  if (inner && inner.dataset && inner.dataset.noHeader) {
    c.dataset.noHeader = inner.dataset.noHeader;
  }
  // Propagate fullscreen flag so main.js can bypass shell chrome
  if (inner && inner.dataset && inner.dataset.fullscreen) {
    c.dataset.fullscreen = inner.dataset.fullscreen;
    // Also add fullscreen class so CSS rule .content.fullscreen removes padding
    c.classList.add('fullscreen');
  }
  return c;
}


