import { db, saveUser } from '../state/db.js';
import { getAuth, setAuth } from '../state/session.js';

export async function ClassSelectView() {
  const classes = db().classes;
  const auth = getAuth();

  const content = document.createElement('div');
  content.className = 'content fullscreen class-select-page';
  content.dataset.noHeader = 'true';
  content.dataset.fullscreen = 'true';

  // Hero layout
  content.innerHTML = `
    <div class="class-hero">
      <div class="class-card float-anim">
        <div class="login-brand">
          <span class="brand-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3l7 7-9 9-7-7 9-9z" fill="#ffde59" stroke="#000" stroke-width="2"/>
              <path d="M3 21l6-6" stroke="#fff" stroke-width="2"/>
              <path d="M6 18l-3 3" stroke="#000" stroke-width="3"/>
            </svg>
          </span>
          <div class="brand-title title-glow">Choose Your Path</div>
        </div>
        <p class="login-subtitle">Pick a starting class. You can switch later.</p>
        <div class="class-grid" role="radiogroup" aria-label="Select your class">
          ${classes.map((k,i) => `
            <button class="class-btn" role="radio" aria-checked="false" tabindex="${i===0? '0':'-1'}" data-id="${k.id}">
              <span class="emoji">${emojiOf(k.id)}</span>
              <span class="label">${k.name}</span>
              <span class="check" aria-hidden="true">✓</span>
            </button>
          `).join('')}
        </div>
        <div class="login-actions" style="margin-top:18px">
          <a class="back-link" href="#/login">← Back</a>
        </div>
      </div>
    </div>
  `;

  // Preload and set background image via CSS variable
  const heroEl = content.querySelector('.class-hero');
  const heroUrl = '/assets/images/class-hero.jpg';
  if (heroEl) {
    const img = new Image();
    img.onload = () => { heroEl.style.setProperty('--class-hero', `url('${heroUrl}')`); };
    img.onerror = () => { heroEl.style.removeProperty('--class-hero'); };
    img.src = heroUrl;
  }

  const gridEl = content.querySelector('.class-grid');
  const btns = Array.from(gridEl.querySelectorAll('.class-btn'));

  function setSelected(btn) {
    btns.forEach(b => { b.classList.toggle('selected', b === btn); b.setAttribute('aria-checked', b===btn? 'true':'false'); });
    btn.focus();
  }

  function commit(btn) {
    const id = btn.getAttribute('data-id');
    auth.user.primaryClass = id;
    if (!auth.user.party.find(p => p.id === id)) auth.user.party.push({ id, level: 1, xp: 0 });
    saveUser(auth.user); setAuth(auth);
    location.hash = '/';
  }

  content.addEventListener('click', (e) => {
    const target = e.target;
    const btn = target.closest('button[data-id]');
    if (btn) {
      setSelected(btn);
      // Delay small for haptic feel before committing
      setTimeout(() => commit(btn), 80);
    }
  });

  content.addEventListener('keydown', (e) => {
    const active = document.activeElement && document.activeElement.closest('.class-btn');
    if (!active) return;
    const idx = btns.indexOf(active);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = btns[(idx + 1) % btns.length];
      next.tabIndex = 0; active.tabIndex = -1; setSelected(next);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = btns[(idx - 1 + btns.length) % btns.length];
      prev.tabIndex = 0; active.tabIndex = -1; setSelected(prev);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(active);
    }
  });

  return content;
}

function emojiOf(id) {
  const map = { 'warrior-js': '⚔️', 'ninja-py': '🥷', 'monk-java':'🧘', 'mage-cpp':'🪄' };
  return map[id] || '🎌';
}


