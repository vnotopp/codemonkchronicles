import { db, saveUser, award, saveDb } from '../state/db.js';
import { getAuth, setAuth } from '../state/session.js';

export async function DojoView() {
  const root = document.createElement('div');
  root.className = 'content';
  // Choose a random encouraging message for this view
  const companionMessages = [
    'remember to stay hydrated!',
    'you got this—keep going!',
    'tiny steps lead to big wins.',
    'progress over perfection.',
    'believe in your practice.',
    'rest your eyes for 20 seconds.',
    'debugging is learning in disguise.',
    'breathe—one concept at a time.',
    'celebrate small victories!',
    'curiosity fuels mastery.'
  ];
  const companionMsg = companionMessages[Math.floor(Math.random() * companionMessages.length)];
  // Full-screen scenic background (behind header and sides)
  try {
    const id = 'dojo-global-bg';
    // Remove any previous route background
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const bg = document.createElement('div');
    bg.id = id;
    bg.setAttribute('aria-hidden', 'true');
    Object.assign(bg.style, {
      position: 'fixed',
      inset: '0',
      backgroundImage: "url('/assets/images/dojo.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: '0.25',
      pointerEvents: 'none',
      zIndex: '0',
      filter: 'saturate(105%)'
    });
    document.body.appendChild(bg);
    // Clean up when navigating away from Dojo
    const onHash = () => { if (!location.hash.startsWith('#/dojo')) { try { bg.remove(); } catch {} window.removeEventListener('hashchange', onHash); } };
    window.addEventListener('hashchange', onHash);
  } catch {}

  const state = db();
  const auth = getAuth();
  if (!auth.user || !auth.user.primaryClass) {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<p>Please <a href="#/class">choose a class</a> first.</p>`;
    root.appendChild(d);
    return root;
  }

  // Floating active sprite with speech bubble (bottom-right)
  function mountActiveSpriteBadge() {
    try {
      const state = db();
      const auth = getAuth();
      const user = auth?.user;
      if (!user || !user.activeSprite) return;
      const sprites = (state.shop && state.shop.sprites) || [];
      const ref = sprites.find(s => s.id === user.activeSprite);
      const src = (ref && (ref.path || (ref.file ? ('/assets/sprites/' + ref.file) : ''))) || '';
      if (!src) return;
      const wrap = document.createElement('div');
      wrap.style.position = 'fixed';
      wrap.style.right = '16px';
      wrap.style.bottom = '16px';
      wrap.style.zIndex = '900';

      const holder = document.createElement('div');
      holder.style.position = 'relative';
      holder.style.width = '216px';
      holder.style.height = '216px';

      const img = document.createElement('img');
      img.src = src; img.alt = 'active sprite';
      img.style.width = '216px';
      img.style.height = '216px';
      img.style.objectFit = 'contain';
      img.style.background = 'transparent';
      img.style.border = 'none';
      img.style.borderRadius = '12px';

      const bubble = document.createElement('div');
      bubble.textContent = companionMsg;
      bubble.style.position = 'absolute';
      bubble.style.top = '-10px';
      bubble.style.left = '-10px';
      bubble.style.background = '#fff';
      bubble.style.color = '#111';
      bubble.style.border = '1px solid rgba(0,0,0,0.08)';
      bubble.style.borderRadius = '12px';
      bubble.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
      bubble.style.padding = '8px 12px';
      bubble.style.fontSize = '13px';
      bubble.style.maxWidth = '240px';

      holder.appendChild(img);
      holder.appendChild(bubble);
      wrap.appendChild(holder);
      root.appendChild(wrap);
    } catch {}
  }

  // Ensure only the next uncompleted lesson in a track is red, others grey (unless completed)
  function recalcTrackHighlightForLesson(lessonId) {
    try {
      const track = tracks.find(t => (t.lessons||[]).some(l => l.id === lessonId));
      if (!track) return;
      const lessons = track.lessons || [];
      const completed = new Set(auth.user.completedLessons || []);
      const unmarked = new Set(auth.user.unmarkedLessons || []);
      // First, set all bubbles per completed/muted
      lessons.forEach(lsn => {
        const node = root.querySelector('.road-node[data-id="' + lsn.id + '"] .bubble');
        if (!node) return;
        if (completed.has(lsn.id)) node.style.background = 'var(--success)';
        else if (unmarked.has(lsn.id)) node.style.background = 'var(--warning, #eab308)';
        else node.style.background = 'var(--muted)';
      });
      // Then set the first unfinished to red
      const next = lessons.find(lsn => !completed.has(lsn.id) && !unmarked.has(lsn.id));
      if (next) {
        const node = root.querySelector('.road-node[data-id="' + next.id + '"] .bubble');
        if (node) node.style.background = 'var(--danger)';
      }
    } catch {}
  }

  // Helper: update all counters on screen (used on modal close)
  function updateProgressCounter(lessonId) {
    try {
      tracks.forEach(track => {
        const lessons = track.lessons || [];
        const totalUnits = lessons.length + lessons.reduce((a,l)=> a + ((l.tasks||[]).length>0 ? (l.tasks||[]).length : 0), 0);
        const doneLessons = lessons.filter(l => (auth.user.completedLessons||[]).includes(l.id)).length;
        const doneTasks = lessons.reduce((acc, l)=> acc + (l.tasks||[]).filter(t => (auth.user.completedTasks||[]).includes(l.id+':'+t.id)).length, 0);
        const progress = totalUnits ? Math.round(((doneLessons + doneTasks) / totalUnits) * 100) : 0;
        const card = root.querySelector('.card[data-topic="' + track.topic + '"]');
        const notice = card && card.querySelector('.notice');
        if (notice) notice.textContent = (doneLessons + doneTasks) + '/' + totalUnits + ' • ' + progress + '%';
      });
    } catch {}
  }

  // Migrate existing users missing completedTasks
  if (!Array.isArray(auth.user.completedTasks)) {
    auth.user.completedTasks = [];
    saveUser(auth.user); setAuth(auth);
  }

  function renderLessonFromContent(lesson) {
    const { id, title, content, videoUrl } = lesson;
    const safe = (content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const isMp4 = !!(videoUrl && /\.mp4(?:$|[?#])/i.test(videoUrl));
    const isCompleted = Array.isArray(auth.user.completedLessons) && auth.user.completedLessons.includes(id);
    const videoBlock = videoUrl ? (
      isMp4
        ? `
      <div class="lesson-modal__video" style="margin:12px 0;">
        <video src="${videoUrl}" controls playsinline style="width:100%;max-height:60vh;border-radius:8px;border:1px solid var(--line);background:#000"></video>
      </div>`
        : `
      <div class="lesson-modal__video" style="margin:12px 0;">
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;border:1px solid var(--line)">
          <iframe src="${videoUrl}"
                  title="Lesson video"
                  style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen></iframe>
        </div>
      </div>`
    ) : '';
    showModal(`
      <div class="lesson-modal__header" style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <h2 style="margin:0">${title}</h2>
        <div style="display:flex; gap:8px; align-items:center">
          ${isCompleted
            ? '<button class="btn" data-uncomplete="' + id + '">Unmark as complete</button>'
            : '<button class="btn success" data-complete="' + id + '">Mark as complete</button>'}
          <button class="btn secondary" id="close-viewer">Close</button>
        </div>
      </div>
      ${videoBlock}
      <div class="lesson-modal__body">
        <pre style="white-space:pre-wrap;background:#181818;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px">${safe}</pre>
      </div>
    `);
    const btn = modal.querySelector('#close-viewer');
    if (btn) btn.addEventListener('click', closeModal);
  }

  const klass = state.classes.find(c => c.id === auth.user.primaryClass);
  const lang = klass.language;
  let tracks = (state.curriculum && state.curriculum[lang]) || [];

  const header = document.createElement('div');
  header.className = 'card';
  header.innerHTML = `
    <h2 style="margin-top:0">Dojo • ${klass.name.split('(')[1]?.replace(')','') || klass.name}</h2>
    <div class="notice">Progressive lessons curated from official docs and high-quality sources. Mark a lesson as complete to earn XP.</div>
  `;
  root.appendChild(header);

  // Modal overlay for lessons
  let overlay = null;
  let modal = null;
  function ensureModal() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.75)';
    overlay.style.backdropFilter = 'blur(6px) saturate(120%)';
    overlay.style.display = 'grid';
    overlay.style.placeItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.padding = '24px';
    modal = document.createElement('div');
    modal.className = 'lesson-modal';
    modal.style.width = 'min(720px, 92vw)';
    modal.style.maxHeight = '82vh';
    modal.style.overflow = 'auto';
    modal.style.background = '#121212';
    modal.style.border = '1px solid rgba(255,255,255,0.08)';
    modal.style.borderRadius = '16px';
    modal.style.boxShadow = '0 24px 80px rgba(0,0,0,0.6)';
    modal.style.padding = '20px';
    modal.style.position = 'relative';
    overlay.appendChild(modal);
    overlay.addEventListener('click', (e)=>{ if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', escClose, true);

    // Handle completion actions inside the modal (since modal lives outside root)
    overlay.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-complete]');
      if (btn) {
        e.preventDefault();
        const id = btn.getAttribute('data-complete');
        if (!auth.user.completedLessons.includes(id)) {
          auth.user.completedLessons.push(id);
          const xp = (tracks.flatMap(t => t.lessons).find(l => l.id === id)?.xp) || 20;
          award(auth.user, { xp, coins: Math.round(xp/2) });
          // Remove from unmarked if present
          auth.user.unmarkedLessons = (auth.user.unmarkedLessons||[]).filter(x => x !== id);
          // Award points once per lesson
          if (!Array.isArray(auth.user.awardedLessons)) auth.user.awardedLessons = [];
          if (!auth.user.awardedLessons.includes(id)) {
            auth.user.points = (auth.user.points || 0) + 25;
            auth.user.awardedLessons.push(id);
          }
          saveUser(auth.user); setAuth(auth);
          // Update roadmap bubble color for this track
          const bubble = root.querySelector('.road-node[data-id="' + id + '"] .bubble');
          if (bubble) bubble.style.background = 'var(--success)';
          // Recompute which node should be red (only one current at a time)
          recalcTrackHighlightForLesson(id);
          // Close modal
          closeModal();
        }
        return;
      }
      const ub = e.target.closest('button[data-uncomplete]');
      if (ub) {
        e.preventDefault();
        const id = ub.getAttribute('data-uncomplete');
        const idx = auth.user.completedLessons.indexOf(id);
        if (idx !== -1) {
          auth.user.completedLessons.splice(idx, 1);
          saveUser(auth.user); setAuth(auth);
          // Track as explicitly unmarked and color yellow
          if (!Array.isArray(auth.user.unmarkedLessons)) auth.user.unmarkedLessons = [];
          if (!auth.user.unmarkedLessons.includes(id)) auth.user.unmarkedLessons.push(id);
          const bubble = root.querySelector('.road-node[data-id="' + id + '"] .bubble');
          if (bubble) bubble.style.background = 'var(--warning, #eab308)';
          // Swap button to mark (no need to close)
          ub.outerHTML = '<button class="btn success" data-complete="' + id + '">Mark as complete</button>';
          // Recompute highlights so only next unfinished (not unmarked) is red
          recalcTrackHighlightForLesson(id);
        }
        return;
      }
    });
  }
  function escClose(e){ if (e.key === 'Escape') closeModal(); }
  function closeModal(){
    if (!overlay) return;
    document.body.removeChild(overlay);
    overlay = null; modal = null;
    document.removeEventListener('keydown', escClose, true);
    // After closing modal, refresh counters and redraw curves
    try {
      updateAllProgressCounters();
      const evt = new Event('resize');
      window.dispatchEvent(evt);
    } catch {}
  }
  function buildSpriteFixedHolder(src) {
    const holder = document.createElement('div');
    holder.style.position = 'fixed';
    holder.style.right = '16px';
    holder.style.bottom = '16px';
    holder.style.width = '216px';
    holder.style.height = '216px';
    holder.style.zIndex = '1001';
    holder.style.pointerEvents = 'none';
    const inner = document.createElement('div');
    inner.style.position = 'relative';
    inner.style.width = '216px';
    inner.style.height = '216px';
    const img = document.createElement('img');
    img.src = src; img.alt = 'active sprite';
    Object.assign(img.style, { width: '216px', height: '216px', objectFit: 'contain', background: 'transparent', border: 'none', borderRadius: '12px' });
    const bubble = document.createElement('div');
    bubble.textContent = companionMsg;
    Object.assign(bubble.style, { position:'absolute', top:'-10px', left:'-10px', background:'#fff', color:'#111', border:'1px solid rgba(0,0,0,0.08)', borderRadius:'12px', boxShadow:'0 12px 40px rgba(0,0,0,0.25)', padding:'8px 12px', fontSize:'13px', maxWidth:'240px' });
    inner.appendChild(img); inner.appendChild(bubble); holder.appendChild(inner);
    holder.setAttribute('data-modal-sprite','');
    return holder;
  }
  function showModal(innerHtml){
    ensureModal();
    modal.innerHTML = innerHtml;
    // Append active sprite outside modal (fixed bottom-right of overlay)
    try {
      const state = db(); const auth = getAuth(); const user = auth?.user;
      if (user && user.activeSprite) {
        const sprites = (state.shop && state.shop.sprites) || [];
        const ref = sprites.find(s => s.id === user.activeSprite);
        const src = (ref && (ref.path || (ref.file ? ('/assets/sprites/' + ref.file) : ''))) || '';
        if (src) overlay.appendChild(buildSpriteFixedHolder(src));
      }
    } catch {}
    document.body.appendChild(overlay);
  }

  const COLLAPSE_KEY = 'dojo_collapse_' + lang;
  let collapseState = {};
  try { collapseState = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '{}'); } catch { collapseState = {}; }

  tracks.forEach(track => {
    const sec = document.createElement('div');
    sec.className = 'card';
    sec.style.position = 'relative';
    // Tag card with topic for easy lookup when updating progress later
    sec.setAttribute('data-topic', track.topic);

    const lessons = (track.lessons || []);
    const totalUnits = lessons.length + lessons.reduce((a,l)=> a + ((l.tasks||[]).length>0 ? (l.tasks||[]).length : 0), 0);
    const doneLessons = lessons.filter(l => auth.user.completedLessons.includes(l.id)).length;
    const doneTasks = lessons.reduce((acc, l)=> acc + (l.tasks||[]).filter(t => auth.user.completedTasks.includes(l.id+':'+t.id)).length, 0);
    const progress = totalUnits ? Math.round(((doneLessons + doneTasks) / totalUnits) * 100) : 0;

    // Header with collapse toggle
    const bar = document.createElement('div');
    bar.style.marginBottom = '8px';
    const isCollapsed = !!collapseState[track.topic];
    bar.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="btn secondary" data-toggle="topic" data-topic="${track.topic}" aria-expanded="${!isCollapsed}" style="display:flex;align-items:center;justify-content:center;padding:4px 8px;min-height:auto;line-height:1">
            <span class="arrow" style="display:inline-block;line-height:1;transform:rotate(${isCollapsed ? '90deg' : '0deg'});transition:transform .15s">▶</span>
          </button>
          <h3 style="margin:0">${track.topic}</h3>
        </div>
        <div class="notice">${doneLessons + doneTasks}/${totalUnits} • ${progress}%</div>
      </div>
    `;
    sec.appendChild(bar);

    // Section body (collapsible)
    const secBody = document.createElement('div');
    secBody.style.display = isCollapsed ? 'none' : '';

    // Road container for lessons
    const road = document.createElement('div');
    road.className = 'road';

    // Determine lock progression
    const completedSet = new Set(auth.user.completedLessons || []);
    const unmarkedSet = new Set(auth.user.unmarkedLessons || []);
    const firstActive = lessons.findIndex(l => !completedSet.has(l.id) && !unmarkedSet.has(l.id));
    const currentIdx = firstActive === -1 ? lessons.length - 1 : firstActive;

    // Random-ish offset to avoid edges
    function offsetFor(id, idx) {
      let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
      h = (h + idx * 1315423911) >>> 0;
      const p = (h % 70) + 15; // 15..85
      return p;
    }

    function nodeHtml(lsn, i) {
      const isCompleted = completedSet.has(lsn.id);
      const isUnmarked = unmarkedSet.has(lsn.id);
      const isCurrent = i === currentIdx && !isCompleted && !isUnmarked;
      const isLocked = false; // unlocking lessons: everything is accessible
      const color = isCompleted ? 'var(--success)' : isUnmarked ? 'var(--warning, #eab308)' : isCurrent ? 'var(--danger)' : 'var(--muted)';
      const cursor = 'pointer';
      const aria = isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Available';
      return `
        <div class="road-node" data-id="${lsn.id}" data-locked="${isLocked}" title="${lsn.title} • ${aria}">
          <div class="cap" style="margin-bottom:6px">${lsn.title}</div>
          <div class="bubble" style="background:${color}; cursor:${cursor}"><span>${i+1}</span></div>
        </div>`;
    }

    lessons.forEach((lsn, idx) => {
      const row = document.createElement('div');
      row.className = 'road-row';
      row.style.justifyContent = 'flex-start';
      const holder = document.createElement('div');
      holder.innerHTML = nodeHtml(lsn, idx);
      const node = holder.firstElementChild;
      node.style.marginInlineStart = offsetFor(lsn.id, idx) + '%';
      row.appendChild(node);
      road.appendChild(row);
    });

    secBody.appendChild(road);

    // Absolute SVG layer to connect lesson bubbles
    const layer = document.createElementNS('http://www.w3.org/2000/svg','svg');
    layer.classList.add('road-layer');
    layer.setAttribute('aria-hidden','true');
    secBody.appendChild(layer);
    sec.appendChild(secBody);
    function drawCurves() {
      const bubbles = Array.from(road.querySelectorAll('.road-node .bubble'));
      const hostRect = sec.getBoundingClientRect();
      const w = sec.clientWidth; const h = sec.clientHeight;
      layer.setAttribute('viewBox', `0 0 ${w} ${h}`);
      layer.setAttribute('width', `${w}`);
      layer.setAttribute('height', `${h}`);
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      const centers = bubbles.map(b => {
        const r = b.getBoundingClientRect();
        return { x: r.left - hostRect.left + r.width/2, y: r.top - hostRect.top + r.height/2 };
      });
      for (let i=0; i<centers.length-1; i++) {
        const a = centers[i], b = centers[i+1];
        const dy = Math.max(40, Math.abs(b.y - a.y));
        const c1 = { x: a.x, y: a.y + dy*0.4 };
        const c2 = { x: b.x, y: b.y - dy*0.4 };
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d', `M ${a.x} ${a.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`);
        layer.appendChild(path);
      }
    }
    if (!isCollapsed) requestAnimationFrame(drawCurves);
    setTimeout(drawCurves, 250); setTimeout(drawCurves, 800);
    window.addEventListener('resize', () => requestAnimationFrame(drawCurves));
    const ro = new ResizeObserver(() => requestAnimationFrame(drawCurves));
    ro.observe(sec);

    root.appendChild(sec);
  });

  // Handle completion, open actions, and collapse toggles
  root.addEventListener('click', (e) => {
    const tgl = e.target.closest('button[data-toggle="topic"]');
    if (tgl) {
      e.preventDefault();
      const topic = tgl.getAttribute('data-topic');
      const card = tgl.closest('.card');
      const body = card?.querySelector(':scope > div + div'); // header is first, body next
      const arrow = tgl.querySelector('.arrow');
      const nowCollapsed = body && body.style.display !== 'none' ? true : false;
      if (body) body.style.display = nowCollapsed ? 'none' : '';
      if (arrow) arrow.style.transform = nowCollapsed ? 'rotate(90deg)' : 'rotate(0deg)';
      try {
        const st = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '{}');
        if (nowCollapsed) st[topic] = true; else delete st[topic];
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(st));
      } catch {}
      // Redraw curves when expanding
      if (!nowCollapsed) {
        const svg = card?.querySelector('svg.road-layer');
        if (svg) {
          const evt = new Event('resize');
          window.dispatchEvent(evt);
        }
      }
      return;
    }
    // Roadmap click: open lesson (no locks)
    const node = e.target.closest('.road-node');
    if (node) {
      e.preventDefault();
      const id = node.getAttribute('data-id');
      // Determine track and index
      const track = tracks.find(t => (t.lessons||[]).some(l => l.id === id));
      const lessons = (track?.lessons)||[];
      const idx = lessons.findIndex(l => l.id === id);
      const lesson = lessons[idx];
      if (lesson?.content) {
        renderLessonFromContent(lesson);
      } else if ((lesson?.resources||[])[0]) {
        renderLessonInline(lesson.resources[0].url, lesson.title);
      } else {
        alert('No content available for this lesson.');
      }
      return;
    }

    const link = e.target.closest('a[data-open]');
    if (link) {
      e.preventDefault();
      const rawUrl = decodeURIComponent(link.getAttribute('data-open'));
      const title = link.getAttribute('data-title') || 'Lesson';
      renderLessonInline(rawUrl, title);
      return;
    }

    // Practice task check
    const taskBtn = e.target.closest('button[data-task-submit]');
    if (taskBtn) {
      e.preventDefault();
      const tid = taskBtn.getAttribute('data-task-submit');
      const xp = Number(taskBtn.getAttribute('data-xp')||'5');
      const ans = decodeURIComponent(taskBtn.getAttribute('data-ans')||'').trim();
      const input = root.querySelector(`input[data-task-input="${tid}"]`);
      if (!input) return;
      const val = normalize(input.value);
      if (val && isAnswerCorrect(val, ans)) {
        auth.user.completedTasks.push(tid);
        award(auth.user, { xp, coins: Math.round(xp/2) });
        saveUser(auth.user); setAuth(auth);
        taskBtn.outerHTML = '<span class="notice">✓</span>';
        input.remove();
      } else {
        input.style.borderColor = 'var(--danger)';
        setTimeout(()=> input.style.borderColor = 'var(--line)', 800);
      }
      return;
    }

    const btn = e.target.closest('button[data-complete]');
    if (btn) {
      const id = btn.getAttribute('data-complete');
      if (!auth.user.completedLessons.includes(id)) {
        auth.user.completedLessons.push(id);
        const xp = (tracks.flatMap(t => t.lessons).find(l => l.id === id)?.xp) || 20;
        award(auth.user, { xp, coins: Math.round(xp/2) });
        // Remove from unmarked if present
        auth.user.unmarkedLessons = (auth.user.unmarkedLessons||[]).filter(x => x !== id);
        // Award points once per lesson
        if (!Array.isArray(auth.user.awardedLessons)) auth.user.awardedLessons = [];
        if (!auth.user.awardedLessons.includes(id)) {
          auth.user.points = (auth.user.points || 0) + 25;
          auth.user.awardedLessons.push(id);
        }
        saveUser(auth.user); setAuth(auth);
        // Swap to Unmark button in modal
        const header = btn.parentElement;
        if (header) {
          btn.outerHTML = '<button class="btn" data-uncomplete="' + id + '">Unmark as complete</button>';
        }
        // Turn the roadmap node green
        const bubble = root.querySelector('.road-node[data-id="' + id + '"] .bubble');
        if (bubble) bubble.style.background = 'var(--success)';
        // Ensure only next uncompleted is red
        recalcTrackHighlightForLesson(id);
        // Update section progress display
        updateProgressCounter(id);
        // Close the modal viewer
        closeModal();
        return;
      }
    }

    const ub = e.target.closest('button[data-uncomplete]');
    if (ub) {
      const id = ub.getAttribute('data-uncomplete');
      const idx = auth.user.completedLessons.indexOf(id);
      if (idx !== -1) {
        auth.user.completedLessons.splice(idx, 1);
        saveUser(auth.user); setAuth(auth);
        // Swap to Mark button in modal
        const header = ub.parentElement;
        if (header) {
          ub.outerHTML = '<button class="btn success" data-complete="' + id + '">Mark as complete</button>';
        }
        return;
      }
    }
  });

  function hookTabs() {
    const tabS = modal.querySelector('#tab-summary');
    const tabF = modal.querySelector('#tab-full');
    const pS = modal.querySelector('#panel-summary');
    const pF = modal.querySelector('#panel-full');
    if (!tabS || !tabF) return;
    tabS.addEventListener('click', () => { pS.style.display = ''; pF.style.display = 'none'; });
    tabF.addEventListener('click', () => { pS.style.display = 'none'; pF.style.display = ''; });
  }

  // Very lightweight summarizer: pick key lines (headings, list items, first sentences)
  function renderSummary(text) {
    try {
      // Normalize line endings and strip HTML tags if any leaked through
      const plain = text.replace(/\r/g, '').replace(/<[^>]+>/g, '');
      const lines = plain.split('\n').map(s => s.trim()).filter(Boolean);
      const scored = lines.map((ln, i) => ({
        ln,
        score:
          (ln.startsWith('#') ? 3 : 0) +
          (/^(?:\d+\.|[-*])\s/.test(ln) ? 2 : 0) +
          (/[.:;]$/.test(ln) ? 0.5 : 0) +
          (i < 20 ? 1 : 0)
      }));
      scored.sort((a,b) => b.score - a.score);
      const top = scored.slice(0, 12).map(x => x.ln)
        .map(s => s.replace(/^#+\s*/, '').replace(/^(?:\d+\.|[-*])\s*/, ''))
        .map(s => s.length > 160 ? s.slice(0,157) + '…' : s);
      if (top.length === 0) return '<div class="notice">No summary available.</div>';
      return '<ul>' + top.map(s => `<li>${escapeHtml(s)}</li>`).join('') + '</ul>';
    } catch {
      return '<div class="notice">Summary unavailable.</div>';
    }
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Helpers for answer checking
  function normalize(s) {
    return (s || '')
      .replace(/;+/g, ';')
      .replace(/\s+/g, ' ')
      .replace(/\s*;\s*$/,'')
      .trim();
  }
  function isAnswerCorrect(user, expect) {
    const a = normalize(user);
    const b = normalize(expect);
    if (a === b) return true;
    // Case-insensitive fallback for text-only answers
    return a.toLowerCase() === b.toLowerCase();
  }

  // Mount sprite badge last so it overlays content
  mountActiveSpriteBadge();
  return root;
}
