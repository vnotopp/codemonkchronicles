import { getAuth, signOut } from '../state/session.js';

export function renderHeader() {
  const div = document.createElement('div');
  div.className = 'header';
  const auth = getAuth();

  div.innerHTML = `
    <div class="brand">
      <span class="brand-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
          <!-- Sword icon: diagonal blade with guard and handle -->
          <g fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Blade -->
            <path d="M20 4 L10 14"/>
            <!-- Tip accent -->
            <path d="M20 4 L18 6"/>
            <!-- Guard -->
            <path d="M9 13 L7.5 14.5"/>
            <path d="M9 13 L10.5 11.5"/>
            <!-- Handle -->
            <path d="M6 16 L4 18"/>
            <!-- Pommel -->
            <circle cx="3.5" cy="18.5" r="0.8" fill="#ffffff" stroke="#ffffff"/>
          </g>
        </svg>
      </span>
      <div class="brand-title" style="font-size:1.25em; line-height:1; font-weight:700">CodeMonkChronicles</div>
    </div>
    <div class="tabs">
      <a class="tab" href="#/dojo">Dojo</a>
      <a class="tab" href="#/dungeons">Dungeons</a>
      <a class="tab" href="#/shop">Shop</a>
      <a class="tab" href="#/customize">Customize</a>
    </div>
    <div class="header-right">
      ${auth.user ? `<a class="avatar" id="btn-profile" href="#/profile" title="Profile">
        ${auth.user.picture ? `<img src="${auth.user.picture}" alt="avatar"/>` : `<span>${(auth.user.name||'U').slice(0,1)}</span>`}
      </a>` : ''}
      ${auth.user ? `<button id="btn-logout" class="btn">Logout</button>` : ''}
    </div>
  `;

  const btn = div.querySelector('#btn-logout');
  if (btn) btn.addEventListener('click', () => { signOut(); location.hash = '/login'; });

  return div;
}


