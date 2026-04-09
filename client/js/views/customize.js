import { db, saveUser } from '../state/db.js';
import { getAuth, setAuth } from '../state/session.js';

export async function CustomizeView() {
  const div = document.createElement('div');
  div.className = 'content';
  const state = db();
  const auth = getAuth();
  const user = auth?.user;
  const inv = Array.isArray(user?.inventory) ? user.inventory : [];
  const sprites = (state.shop && state.shop.sprites) || [];
  const byId = Object.fromEntries(sprites.map(s => [s.id, s]));
  const ownedSprites = inv.filter(it => it && it.type === 'sprite');
  const activeId = user?.activeSprite || null;

  const grid = ownedSprites.map(it => {
    const s = byId[it.id] || {};
    const src = s.path || (it.file ? `/assets/sprites/${it.file}` : '');
    const isActive = activeId === it.id;
    return `
      <div class="sprite-own" data-id="${it.id}" style="position:relative;background:#0e0f13;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:10px;${isActive?'box-shadow:0 0 0 2px var(--primary,#3b82f6) inset;':''}">
        <div style="position:relative;width:160px;height:160px;overflow:hidden;border-radius:12px;background:#0b0c10;border:1px solid rgba(255,255,255,0.06)">
          <img src="${src}" alt="${it.name||s.name||it.id}" style="width:100%;height:100%;object-fit:contain"/>
          ${isActive ? '<div style="position:absolute;top:8px;right:8px;background:var(--success);border-radius:9999px;padding:4px 8px;font-size:12px">Active</div>' : ''}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
          <div style="font-weight:700">${it.name||s.name||'Sprite'}</div>
          ${isActive
            ? '<button class="btn secondary" disabled style="border-radius:10px">Selected</button>'
            : '<button class="btn" data-set-active="'+it.id+'" style="border-radius:10px;background:var(--primary,#3b82f6)">Set Active</button>'}
        </div>
      </div>`;
  }).join('');

  div.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <h2 style="margin:0">Customize</h2>
        ${activeId ? `<div class="notice" style="display:flex;align-items:center;gap:8px">
            <span>Current Sprite:</span>
            <img src="${(byId[activeId]?.path)||''}" alt="active sprite" style="width:32px;height:32px;object-fit:contain;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:#0b0c10"/>
          </div>` : '<div class="notice">No active sprite selected</div>'}
      </div>
    </div>
    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">Owned Sprites</h3>
      ${ownedSprites.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">${grid}</div>` : '<p class="notice">You do not own any sprites yet. Visit the Shop to purchase one.</p>'}
    </div>
  `;

  // Interactions: set active sprite
  div.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-set-active]');
    if (!btn) return;
    const id = btn.getAttribute('data-set-active');
    if (!user) return;
    user.activeSprite = id;
    saveUser(user);
    setAuth(auth);
    // Re-render this view
    CustomizeView().then(node => div.replaceWith(node));
  });
  return div;
}
