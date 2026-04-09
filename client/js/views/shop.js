import { getAuth, setAuth } from '../state/session.js';
import { db, saveUser } from '../state/db.js';

export async function ShopView() {
  const div = document.createElement('div');
  div.className = 'content';
  const auth = getAuth();
  const pts = auth?.user?.points || 0;
  const state = db();
  const sprites = (state.shop && state.shop.sprites) || [];
  const owns = new Set((auth?.user?.inventory || []).map(it => it?.id));
  // Reconcile: if user already owns sprites but hasn't had points deducted yet, deduct once per sprite
  try {
    const user = auth?.user;
    if (user) {
      user.spentPointsSprites = Array.isArray(user.spentPointsSprites) ? user.spentPointsSprites : [];
      let changed = false;
      sprites.forEach(s => {
        const owned = owns.has(s.id);
        const alreadySpent = user.spentPointsSprites.includes(s.id);
        if (owned && !alreadySpent) {
          const pricePts = s.price ?? 75;
          user.points = Math.max(0, (user.points || 0) - pricePts);
          user.spentPointsSprites.push(s.id);
          changed = true;
        }
      });
      if (changed) { saveUser(user); setAuth(auth); }
    }
  } catch {}
  div.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <h2 style="margin-top:0;margin-bottom:0">Shop</h2>
        <div style="display:flex;align-items:center;gap:8px;background:#121212;border:1px solid rgba(255,255,255,0.08);border-radius:9999px;padding:8px 12px;box-shadow:0 12px 40px rgba(0,0,0,0.35)">
          <span class="notice" style="opacity:.85">Points</span>
          <span style="font-size:22px;font-weight:800;letter-spacing:.3px;color:var(--primary,#3b82f6)">${pts}</span>
        </div>
      </div>
      <p class="notice" style="margin-top:12px">Spend coins on cosmetics in the Home > Shop panel. Standalone shop coming soon.</p>
    </div>
    <div class="card" style="margin-top:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px">
        <h3 style="margin:0">Sprites</h3>
        <div class="notice" style="opacity:.8">Tap to preview & purchase</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px">
        ${sprites.map(s => `
          <div class="sprite-card" data-id="${s.id}" style="position:relative;background:#0e0f13;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:12px;transition:transform .12s ease, box-shadow .12s ease">
            <div style="position:relative;width:192px;height:192px;overflow:hidden;border-radius:12px;background:#0b0c10;border:1px solid rgba(255,255,255,0.06)">
              <img src="${s.path || '/assets/sprites/'+s.file}" alt="${s.name}" style="width:100%;height:100%;object-fit:contain;filter:${owns.has(s.id)?'none':'grayscale(80%)'};opacity:${owns.has(s.id)?'1':'0.7'}"/>
              <div style="position:absolute;top:8px;right:8px;background:${owns.has(s.id)?'var(--success)':'#111'};border:1px solid rgba(255,255,255,0.08);border-radius:9999px;padding:4px 8px;color:${owns.has(s.id)?'#0b2':'#999'};font-size:13px">
                ${owns.has(s.id)?'✓':'🔒'}
              </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
              <div style="font-size:16px;font-weight:700">${s.name}</div>
              <div style="background:#121318;border:1px solid rgba(255,255,255,0.06);border-radius:9999px;padding:4px 10px;font-size:12px" class="notice">${s.price} coins</div>
            </div>
            ${owns.has(s.id)
              ? '<button class="btn secondary" disabled style="width:100%;border-radius:12px">Owned</button>'
              : '<button class="btn" data-buy="'+s.id+'" style="width:100%;border-radius:12px;background:var(--primary,#3b82f6)">Buy</button>'}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  // Images now use absolute paths from DB (s.path) similar to LoginView assets.
  // Handle purchases
  div.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-buy]');
    if (!btn) return;
    const id = btn.getAttribute('data-buy');
    const item = sprites.find(x => x.id === id);
    if (!item) return;
    const user = auth.user;
    if (!user) return;
    if ((user.coins||0) < item.price) {
      alert('Not enough coins.');
      return;
    }
    // Deduct and add to inventory
    user.coins -= item.price;
    user.inventory = Array.isArray(user.inventory) ? user.inventory : [];
    user.inventory.push({ id: item.id, type: 'sprite', file: item.file, name: item.name });
    // Deduct points once per sprite if not already deducted
    user.spentPointsSprites = Array.isArray(user.spentPointsSprites) ? user.spentPointsSprites : [];
    if (!user.spentPointsSprites.includes(item.id)) {
      const pricePts = item.price ?? 75;
      user.points = Math.max(0, (user.points || 0) - pricePts);
      user.spentPointsSprites.push(item.id);
    }
    saveUser(user);
    setAuth(auth);
    // Rerender this view quickly
    ShopView().then(node => {
      div.replaceWith(node);
    });
  });
  return div;
}
