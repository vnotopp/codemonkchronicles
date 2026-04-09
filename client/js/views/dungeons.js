import { db, saveUser, award } from '../state/db.js';
import { getAuth, setAuth } from '../state/session.js';

export async function DungeonsView() {
  const root = document.createElement('div');
  root.className = 'content';
  // Choose a random encouraging message for this view
  const companionMessages = [
    'The boss awaits—sharpen your resolve.',
    'Trust your instincts, adventurer.',
    'Every dungeon hides a secret. Seek it.',
    'Your aura burns bright—press on!',
    'HP check. Stamina steady. Move!',
    'Steel your heart; fear is a paper tiger.',
    'Loot glitters for the bold.',
    'Party spirit up! Support your allies.',
    'Blade, spell, and will—unleash!',
    'Legends are forged in dark corridors.'
  ];
  const companionMsg = companionMessages[Math.floor(Math.random() * companionMessages.length)];
  // Full-screen scenic background (behind header and sides)
  try {
    const id = 'dungeons-global-bg';
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const bg = document.createElement('div');
    bg.id = id;
    bg.setAttribute('aria-hidden', 'true');
    Object.assign(bg.style, {
      position: 'fixed',
      inset: '0',
      backgroundImage: "url('/assets/images/dungeon.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: '0.25',
      pointerEvents: 'none',
      zIndex: '0',
      filter: 'saturate(105%)'
    });
    document.body.appendChild(bg);
    const onHash = () => { if (!location.hash.startsWith('#/dungeons')) { try { bg.remove(); } catch {} window.removeEventListener('hashchange', onHash); } };
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

  // --- Helpers to sync with Dojo ---
  function completeLessonAndUI(p, auth) {
    try {
      // Mark underlying Dojo lesson complete
      const lessonId = p.lessonId;
      if (lessonId && !auth.user.completedLessons.includes(lessonId)) {
        auth.user.completedLessons.push(lessonId);
        award(auth.user, { xp: p.xp || 40, coins: p.coins || Math.round((p.xp||40)/2) });
        // If this lesson was previously unmarked, clear that state
        if (Array.isArray(auth.user.unmarkedLessons)) {
          auth.user.unmarkedLessons = auth.user.unmarkedLessons.filter(x => x !== lessonId);
        }
        // Points for quizzes should award once per puzzle id
        if (!Array.isArray(auth.user.awardedPuzzles)) auth.user.awardedPuzzles = [];
        if (!auth.user.awardedPuzzles.includes(p.id)) {
          auth.user.points = (auth.user.points || 0) + 25;
          auth.user.awardedPuzzles.push(p.id);
        }
        saveUser(auth.user); setAuth(auth);
      }
      // Color node green
      const bubble = root.querySelector('.road-node[data-id="' + p.id + '"] .bubble');
      if (bubble) bubble.style.background = 'var(--success)';
      // Update counters
      refreshDungeonCounters();
      // Ensure only the next unfinished is red
      recalcDungeonHighlight();
      // Redraw connectors
      redrawAndRefresh();
    } catch {}
  }

  function refreshDungeonCounters() {
    try {
      const done = dojoLessons.filter(l => (auth.user.completedLessons||[]).includes(l.id)).length;
      const total = dojoLessons.length;
      const pct = total ? Math.round((done/total)*100) : 0;
      const notice = sec.querySelector('.notice');
      if (notice) notice.textContent = `${done}/${total} • ${pct}%`;
    } catch {}
  }

  function redrawAndRefresh() {
    try {
      refreshDungeonCounters();
      const evt = new Event('resize');
      window.dispatchEvent(evt);
    } catch {}
  }

  // Ensure only one red (current) node exists: the first unfinished
  function recalcDungeonHighlight() {
    try {
      const completed = new Set(auth.user.completedLessons || []);
      const unmarked = new Set(auth.user.unmarkedLessons || []);
      // Reset all to success or muted
      dojoLessons.forEach((lsn, i) => {
        const qid = 'dojoq-' + lsn.id;
        const node = root.querySelector('.road-node[data-id="' + qid + '"] .bubble');
        if (!node) return;
        if (completed.has(lsn.id)) node.style.background = 'var(--success)';
        else if (unmarked.has(lsn.id)) node.style.background = 'var(--warning, #eab308)';
        else node.style.background = 'var(--muted)';
      });
      // Mark first unfinished as red
      const next = dojoLessons.find(lsn => !completed.has(lsn.id) && !unmarked.has(lsn.id));
      if (next) {
        const qid = 'dojoq-' + next.id;
        const node = root.querySelector('.road-node[data-id="' + qid + '"] .bubble');
        if (node) node.style.background = 'var(--danger)';
      }
    } catch {}
  }
  

  const klass = state.classes.find(c => c.id === auth.user.primaryClass);
  const lang = klass.language;

  // Section header
  const header = document.createElement('div');
  header.className = 'card';
  header.innerHTML = `
    <h2 style="margin-top:0">Dungeons • ${capitalize(lang)}</h2>
    <div class="notice">Solve puzzles to earn XP and coins. Your progress is saved automatically.</div>`;
  root.appendChild(header);

  // Modal overlay for puzzles (styled like Spotify dialogs)
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
  }
  // Centered in-app popup styled like the modal
  function showToast(msg) {
    const wrap = document.createElement('div');
    wrap.style.position = 'fixed';
    wrap.style.inset = '0';
    wrap.style.display = 'grid';
    wrap.style.placeItems = 'center';
    wrap.style.zIndex = '1500';
    wrap.style.pointerEvents = 'none';

    const card = document.createElement('div');
    card.textContent = msg;
    card.style.background = '#121212';
    card.style.color = 'var(--text, #fff)';
    card.style.border = '1px solid rgba(255,255,255,0.08)';
    card.style.borderRadius = '16px';
    card.style.boxShadow = '0 24px 80px rgba(0,0,0,0.6)';
    card.style.padding = '20px 28px';
    card.style.fontSize = '18px';
    card.style.letterSpacing = '.2px';
    card.style.transform = 'scale(0.96)';
    card.style.opacity = '0';
    card.style.transition = 'opacity .15s ease, transform .15s ease';
    wrap.appendChild(card);
    document.body.appendChild(wrap);
    requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; });
    setTimeout(() => {
      card.style.opacity = '0'; card.style.transform = 'scale(0.96)';
      setTimeout(() => { try { document.body.removeChild(wrap); } catch {} }, 160);
    }, 1400);
  }
  function escClose(e){ if (e.key === 'Escape') closeModal(); }
  function closeModal(){ if (!overlay) return; document.body.removeChild(overlay); overlay = null; modal = null; document.removeEventListener('keydown', escClose, true); try { redrawAndRefresh(); } catch {}
  }
  function showModal(innerHtml){ 
    ensureModal(); 
    modal.innerHTML = innerHtml; 
    // Append active sprite outside modal (fixed bottom-right of overlay)
    try {
      const state = db(); 
      const auth = getAuth(); 
      const user = auth?.user;
      if (user && user.activeSprite) {
        const sprites = (state.shop && state.shop.sprites) || [];
        const ref = sprites.find(s => s.id === user.activeSprite);
        const src = (ref && (ref.path || (ref.file ? ('/assets/sprites/' + ref.file) : ''))) || '';
        if (src) overlay.appendChild(buildSpriteHolder(src));
      }
    } catch {}
    document.body.appendChild(overlay);
  }

  function buildSpriteHolder(src) {
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
    img.src = src; 
    img.alt = 'active sprite';
    Object.assign(img.style, { 
      width: '216px', 
      height: '216px', 
      objectFit: 'contain', 
      background: 'transparent', 
      border: 'none', 
      borderRadius: '12px' 
    });
    const bubble = document.createElement('div'); 
    bubble.textContent = companionMsg;
    Object.assign(bubble.style, { 
      position:'absolute', 
      top:'-10px', 
      left:'-10px', 
      background:'#fff', 
      color:'#111', 
      border:'1px solid rgba(0,0,0,0.08)', 
      borderRadius:'12px', 
      boxShadow:'0 12px 40px rgba(0,0,0,0.25)', 
      padding:'8px 12px', 
      fontSize:'13px', 
      maxWidth:'240px' 
    });
    inner.appendChild(img); 
    inner.appendChild(bubble);
    holder.appendChild(inner);
    return holder;
  }

  // Modal-based quiz/challenge openers (closures over modal helpers)
  function openChallengeModal(p, auth) {
    const t0 = (p.tests && p.tests[0]) || { input: '', expect: '' };
    showModal(`
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h2 style="margin:0;font-weight:700;letter-spacing:.2px">${p.title}</h2>
        <div><button class="btn secondary" id="close-viewer" style="border-radius:9999px;padding:.5rem .9rem">Close</button></div>
      </div>
      <div style="margin-top:12px">
        <div class="notice">Answer this challenge without running code.</div>
        <div style="margin-top:10px">
          <div style="font-size:14px;margin-bottom:6px;opacity:.9">Starter:</div>
          <pre style="white-space:pre-wrap;background:#181818;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px">${escapeHtml(p.starter)}</pre>
        </div>
        ${t0.input ? `<div style=\"margin-top:8px\"><div style=\"font-size:14px;margin-bottom:6px\">Input:</div><pre style=\"white-space:pre-wrap\">${escapeHtml(t0.input)}</pre></div>` : ''}
        <div style="display:flex;gap:10px;align-items:center;margin-top:12px">
          <input id="challenge-answer" placeholder="Type expected output" style="padding:10px 12px;border-radius:9999px;border:1px solid rgba(255,255,255,0.08);background:#1f1f1f;color:var(--text);flex:1"/>
          <button class="btn" id="challenge-submit" style="border-radius:9999px;padding:.6rem 1rem;background: var(--primary, #3b82f6)">Check</button>
        </div>
        <div class="notice" id="challenge-feedback" style="margin-top:8px"></div>
      </div>
    `);
    const close = modal.querySelector('#close-viewer');
    if (close) close.addEventListener('click', () => { closeModal(); });
    const submit = modal.querySelector('#challenge-submit');
    const input = modal.querySelector('#challenge-answer');
    const feedback = modal.querySelector('#challenge-feedback');
    submit.addEventListener('click', () => {
      const ok = (input.value || '').trim() === String(t0.expect).trim();
      if (ok) {
        feedback.textContent = 'Correct!';
        completeLessonAndUI(p, auth);
        showToast('Congrats, warrior!');
        closeModal();
      } else {
        feedback.textContent = 'Wrong answer, come back stronger warrior!';
        input.style.borderColor = 'var(--danger)';
        setTimeout(() => input.style.borderColor = 'var(--line)', 800);
      }
    });
  }

  function openQuizModal(p, auth) {
    const q = p.questions[0];
    const letters = (q.choices || []).map((_, i) => String.fromCharCode(65 + i));
    showModal(`
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h2 style="margin:0;font-weight:700;letter-spacing:.2px">${p.title}</h2>
        <div><button class="btn secondary" id="close-viewer" style="border-radius:9999px;padding:.5rem .9rem">Close</button></div>
      </div>
      <div style="margin-top:12px">
        <div style="font-size:14px;margin-bottom:8px">${escapeHtml(q.q)}</div>
        <div class="quiz-options" style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
          ${(q.choices||[]).map((c,i)=>`
            <button class="quiz-option" data-idx="${i}" style="text-align:left;display:block;width:100%;background:#181818;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;color:var(--text);transition:border-color .15s, background .15s">
              <span style="display:inline-block;min-width:24px;color:var(--primary,#3b82f6);font-weight:600">${letters[i]})</span>
              <span>${escapeHtml(c)}</span>
            </button>
          `).join('')}
        </div>
        <div style="display:flex;gap:10px;align-items-center;margin-top:12px;justify-content:flex-end">
          <button class="btn" id="quiz-submit" style="border-radius:9999px;padding:.6rem 1rem;background: var(--primary, #3b82f6)">Check</button>
        </div>
        <div class="notice" id="quiz-feedback" style="margin-top:8px"></div>
      </div>
    `);
    const close = modal.querySelector('#close-viewer');
    if (close) close.addEventListener('click', () => { closeModal(); });
    const submit = modal.querySelector('#quiz-submit');
    const feedback = modal.querySelector('#quiz-feedback');
    let selected = null;
    const opts = Array.from(modal.querySelectorAll('.quiz-option'));
    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        opts.forEach(b => { b.style.borderColor = 'rgba(255,255,255,0.08)'; b.style.background = '#181818'; });
        btn.style.borderColor = 'var(--primary, #3b82f6)';
        btn.style.background = '#1b2435';
        selected = parseInt(btn.getAttribute('data-idx'), 10);
      });
    });
    submit.addEventListener('click', () => {
      if (selected === null) {
        feedback.textContent = 'Please select an option (A, B, C, ...).';
        return;
      }
      const ok = selected === q.a;
      if (ok) {
        feedback.textContent = 'Correct!';
        completeLessonAndUI(p, auth);
        showToast('Congrats, warrior!');
        closeModal();
      } else {
        feedback.textContent = 'Wrong answer, come back stronger warrior!';
        const chosen = opts[selected];
        if (chosen) {
          const prev = chosen.style.borderColor;
          chosen.style.borderColor = 'var(--danger)';
          setTimeout(()=> { chosen.style.borderColor = prev || 'rgba(255,255,255,0.08)'; }, 800);
        }
      }
    });
  }

  // Ensure completedPuzzles array exists
  if (!Array.isArray(auth.user.completedPuzzles)) auth.user.completedPuzzles = [];

  // (Deprecated) Inline viewer retained for fallback; modal is preferred now
  const viewer = document.createElement('div');
  viewer.className = 'card';
  viewer.id = 'dungeon-viewer';
  viewer.style.display = 'none';
  root.appendChild(viewer);

  // Build quizzes derived from Dojo lessons for the current language
  const lessonTracks = (state.curriculum && state.curriculum[lang]) || [];
  const dojoLessons = lessonTracks.flatMap(t => t.lessons || []);
  // Generate proper quiz questions based on lesson content
  function generateQuizFromLesson(lsn){
    const quizBank = {
      'java-start-what-is-java': {
        q: 'When was Java created?',
        choices: ['1995', '1990', '2000'],
        a: 0
      },
      'java-start-getting-started': {
        q: 'What must match the filename in Java?',
        choices: ['The class name', 'The method name', 'The variable name'],
        a: 0
      },
      'java-start-syntax': {
        q: 'What is the starting point of every Java program?',
        choices: ['main() method', 'class declaration', 'import statement'],
        a: 0
      },
      'java-start-statements': {
        q: 'What must you add at the end of every Java statement?',
        choices: ['Semicolon (;)', 'Period (.)', 'Comma (,)'],
        a: 0
      },
      'java-start-printing': {
        q: 'Which method is used to print text in Java?',
        choices: ['System.out.println()', 'print()', 'console.log()'],
        a: 0
      },
      'java-start-print-numbers': {
        q: 'When printing numbers in Java, do you need quotes?',
        choices: ['No', 'Yes', 'Sometimes'],
        a: 0
      },
      'java-start-comments': {
        q: 'How do you write a single-line comment in Java?',
        choices: ['//', '/* */', '#'],
        a: 0
      },
      'java-start-variables': {
        q: 'Which keyword makes a variable unchangeable in Java?',
        choices: ['final', 'const', 'static'],
        a: 0
      },
      'java-start-display-variables': {
        q: 'What operator is used to combine text and variables in Java?',
        choices: ['+', '&', '.'],
        a: 0
      },
      'java-start-multi-vars': {
        q: 'How can you declare multiple variables of the same type in one line?',
        choices: ['int x = 5, y = 6, z = 50;', 'int x, y, z = 5, 6, 50;', 'int x; y; z = 5, 6, 50;'],
        a: 0
      },
      'java-start-data-types': {
        q: 'Which is a primitive data type in Java?',
        choices: ['int', 'String', 'Array'],
        a: 0
      }
    };
    
    const quiz = quizBank[lsn.id] || {
      q: `What is the main topic of "${lsn.title}"?`,
      choices: [lsn.title, 'Something else', 'Not sure'],
      a: 0
    };
    
    return {
      id: `dojoq-${lsn.id}`,
      title: `Quiz: ${lsn.title}`,
      lessonId: lsn.id,
      questions: [quiz],
      xp: lsn.xp || 40,
      coins: Math.round((lsn.xp || 40)/2)
    };
  }
  const quizzes = dojoLessons.map(generateQuizFromLesson);
  const sec = document.createElement('div');
  sec.className = 'card';
  sec.style.position = 'relative';
  // Progress synced with Dojo lessons
  const completedLessons = new Set(auth.user.completedLessons || []);
  const unmarkedLessons = new Set(auth.user.unmarkedLessons || []);
  const firstActiveIdx = dojoLessons.findIndex(l => !completedLessons.has(l.id) && !unmarkedLessons.has(l.id));
  const currentIdx = firstActiveIdx === -1 ? dojoLessons.length - 1 : firstActiveIdx;
  const done = dojoLessons.filter(l => completedLessons.has(l.id)).length;
  const total = dojoLessons.length;
  const pct = total ? Math.round((done/total)*100) : 0;

  // Header
  sec.setAttribute('data-topic', 'Quests Roadmap');
  sec.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px">
      <h3 style="margin:0">Quests Roadmap</h3>
      <div class="notice">${done}/${total} • ${pct}%</div>
    </div>
  `;

  // Roadmap vertical container
  const road = document.createElement('div');
  road.className = 'road';

  // Helper to create a node
  function nodeHtml(q, i) {
    const lsnId = q.lessonId;
    const isCompleted = completedLessons.has(lsnId);
    const isUnmarked = unmarkedLessons.has(lsnId);
    const isCurrent = i === currentIdx && !isCompleted && !isUnmarked;
    const color = isCompleted ? 'var(--success)' : isUnmarked ? 'var(--warning, #eab308)' : isCurrent ? 'var(--danger)' : 'var(--muted)';
    const isLocked = false;
    const cursor = 'pointer';
    const aria = isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Available';
    return `
      <div class="road-node" data-id="${q.id}" data-lesson-id="${lsnId}" data-locked="${isLocked}" title="${q.title} • ${aria}">
        <div class="bubble" style="background:${color}; cursor:${cursor}"><span>${i+1}</span></div>
        <div class="cap">${q.title}</div>
      </div>`;
  }

  // Build vertical zig-zag with connectors
  // Deterministic pseudo-random offset (12%..88%) based on id so layout is stable
  function offsetFor(id, idx) {
    let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    h = (h + idx * 1315423911) >>> 0;
    const p = (h % 77) + 12; // 12..88
    return p;
  }

  quizzes.forEach((q, idx) => {
    const row = document.createElement('div');
    row.className = 'road-row';
    row.style.justifyContent = 'flex-start';
    const holder = document.createElement('div');
    holder.innerHTML = nodeHtml(q, idx);
    const node = holder.firstElementChild;
    // apply offset within the row
    const off = offsetFor(q.id, idx);
    node.style.marginInlineStart = off + '%';
    row.appendChild(node);
    road.appendChild(row);
  });
  sec.appendChild(road);
  // Add an absolute SVG layer that connects the actual bubble centers
  const layer = document.createElementNS('http://www.w3.org/2000/svg','svg');
  layer.classList.add('road-layer');
  layer.setAttribute('aria-hidden','true');
  // Allow clicks to pass through to the nodes beneath
  layer.style.pointerEvents = 'none';
  sec.appendChild(layer);
  function drawCurves() {
    const bubbles = Array.from(road.querySelectorAll('.road-node .bubble'));
    const hostRect = sec.getBoundingClientRect();
    // Resize svg to the card size
    const w = sec.clientWidth; const h = sec.clientHeight;
    layer.setAttribute('viewBox', `0 0 ${w} ${h}`);
    layer.setAttribute('width', `${w}`);
    layer.setAttribute('height', `${h}`);
    // Clear existing
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    // Compute centers
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
  // Draw initially and on resize/scroll changes
  requestAnimationFrame(drawCurves);
  // Extra retries to account for late layout shifts (fonts/images)
  setTimeout(drawCurves, 250);
  setTimeout(drawCurves, 800);
  window.addEventListener('load', drawCurves, { once: true });
  window.addEventListener('resize', () => requestAnimationFrame(drawCurves));
  // Redraw after inline quiz opens/closes (height changes)
  const ro = new ResizeObserver(() => requestAnimationFrame(drawCurves));
  ro.observe(sec);
  root.appendChild(sec);

  // Interactions
  root.addEventListener('click', (e) => {
    // Roadmap node click
    const node = e.target.closest('.road-node');
    if (node) {
      const id = node.getAttribute('data-id');
      const p = quizzes.find(q => q.id === id);
      if (p) { openQuizModal(p, auth); }
      return;
    }
    // (Removed legacy list-based quiz button handling)

    // Ignore old runner buttons (not in roadmap UI)

    // No manual mark in roadmap
  });

  // Mount sprite badge last so it overlays content
  mountActiveSpriteBadge();
  return root;
}

function buildTracks(state, lang) {
  const tracks = [];
  if (state.puzzles.quiz?.length) {
    const items = state.puzzles.quiz.filter(q => !q.language || q.language === lang);
    if (items.length) tracks.push({ title: 'Quizzes', type: 'quiz', items });
  }
  if (state.puzzles['js-runner']?.length) {
    const items = state.puzzles['js-runner'].filter(p => !p.language || p.language === lang);
    if (items.length) tracks.push({ title: 'Code Runner', type: 'js-runner', items });
  }
  if (state.puzzles['leetcode-medium']?.length) {
    const items = state.puzzles['leetcode-medium'];
    if (items.length) tracks.push({ title: 'Challenge Notes', type: 'note', items });
  }
  return tracks;
}

function renderPuzzleRow(p, auth) {
  const done = auth.user.completedPuzzles.includes(p.id);
  const right = done ? '<span class="notice">✓</span>' : '';
  let actions = '';
  if (p.questions) {
    actions = `<button class="btn" data-quiz="${p.id}">Take Quiz</button>`;
  } else if (p.starter) {
    actions = `<button class="btn" data-run="${p.id}">Open Challenge</button>`;
  } else {
    actions = `<button class="btn" data-mark="${p.id}">Mark Done</button>`;
  }
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
      <div>
        <div style="font-size:14px">${p.title}</div>
        <div class="notice">${p.xp || 60} XP • ${p.coins || 30} coins</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">${right}${actions}</div>
    </div>
  `;
}

function findPuzzle(tracks, id) {
  for (const t of tracks) {
    const p = t.items.find(x => x.id === id); if (p) return p;
  }
  return null;
}

function completeIf(ok, p, auth) {
  if (!ok) return;
  if (!auth.user.completedPuzzles.includes(p.id)) {
    auth.user.completedPuzzles.push(p.id);
    award(auth.user, { xp: p.xp || 60, coins: p.coins || 30 });
    if (!Array.isArray(auth.user.awardedPuzzles)) auth.user.awardedPuzzles = [];
    if (!auth.user.awardedPuzzles.includes(p.id)) {
      auth.user.points = (auth.user.points || 0) + 25;
      auth.user.awardedPuzzles.push(p.id);
    }
    saveUser(auth.user); setAuth(auth);
    location.reload();
  }
}

// (global variant removed; using closures inside DungeonsView)

function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

function openQuizInline(viewer, p, auth) {
  const q = p.questions[0];
  viewer.style.display = '';
  const choices = (q.choices || []).map((c, i) => `${String.fromCharCode(65+i)}) ${c}`).join('\n');
  viewer.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
      <h2 style="margin:0">${p.title}</h2>
      <div><button class="btn secondary" id="close-viewer">Close</button></div>
    </div>
    <div style="margin-top:8px">
      <div style="font-size:14px;margin-bottom:8px">${escapeHtml(q.q)}</div>
      ${q.choices ? `<pre style="white-space:pre-wrap">${escapeHtml(choices)}</pre>` : ''}
      <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
        <input id="quiz-answer" placeholder="Type answer (e.g., C or const)" style="padding:6px 8px;border-radius:8px;border:1px solid var(--line);background:#0d1117;color:var(--text);flex:1"/>
        <button class="btn" id="quiz-submit">Check</button>
      </div>
      <div class="notice" id="quiz-feedback" style="margin-top:8px"></div>
    </div>
  `;
  const close = viewer.querySelector('#close-viewer');
  if (close) close.addEventListener('click', () => { viewer.style.display = 'none'; viewer.innerHTML = ''; });
  const submit = viewer.querySelector('#quiz-submit');
  const input = viewer.querySelector('#quiz-answer');
  const feedback = viewer.querySelector('#quiz-feedback');
  submit.addEventListener('click', () => {
    const ok = isQuizCorrect(input.value, q);
    if (ok) {
      feedback.textContent = 'Correct!';
      completeIf(true, p, auth);
      viewer.style.display = 'none';
      viewer.innerHTML = '';
    } else {
      feedback.textContent = 'Wrong answer, come back stronger warrior!';
      input.style.borderColor = 'var(--danger)';
      setTimeout(() => input.style.borderColor = 'var(--line)', 800);
    }
  });
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function isQuizCorrect(val, q) {
  const v = (val || '').trim();
  if (!v) return false;
  // Accept letter (A/B/C/...) or choice text
  const idx = q.a;
  const correctText = (q.choices && q.choices[idx]) ? q.choices[idx] : '';
  const letter = String.fromCharCode(65 + idx);
  if (v.toUpperCase() === letter) return true;
  if (correctText && v.toLowerCase() === correctText.toLowerCase()) return true;
  return false;
}

function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
