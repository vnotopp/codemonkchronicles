import { getAuth, setAuth } from '../state/session.js';
import { db, saveUser, award } from '../state/db.js';

export async function HomeView() {
  const auth = getAuth();
  const data = db();

  const root = document.createElement('div');
  root.className = 'content';

  if (!auth.user) {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<p>Please <a href="#/login">login</a>.</p>`;
    root.appendChild(d);
    return root;
  }

  const hero = document.createElement('div');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="sprite-box" style="height:220px;font-size:120px;line-height:1">${getEmoji(auth)}</div>
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:16px">${auth.user.name} ${auth.user.retired ? '(Retired)' : ''}</div>
        <div class="statline">
          <span class="kv">Lv ${auth.user.level}</span>
          <span class="kv">XP ${auth.user.xp}</span>
          <span class="kv">Coins ${auth.user.coins}</span>
          <span class="kv">Class ${className(data, auth)}</span>
        </div>
      </div>
      <div style="margin-top:10px" class="grid cols-3">
        ${sectionBtn('Dojo', 'dojo', '#/dojo')} 
        ${sectionBtn('Dungeons', 'dungeons', '#/dungeons')} 
        ${sectionBtn('Village', 'village', '#/village')} 
        ${sectionBtn('Guild', 'guild', '#/guild')} 
        ${sectionBtn('Shop', 'shop', '#/shop')} 
        ${sectionBtn('Party', 'party', '#/party')} 
        ${sectionBtn('Customize', 'customize', '#/customize')} 
      </div>
    </div>
  `;
  root.appendChild(wrap('Your Adventure', hero));

  // Quick Dojo & Dungeon panels
  root.appendChild(renderDojo(data, auth));
  root.appendChild(renderDungeons(data, auth));
  root.appendChild(renderVillage(data, auth));
  root.appendChild(renderGuild(data, auth));
  root.appendChild(renderShop(data, auth));
  root.appendChild(renderParty(data, auth));
  root.appendChild(renderCustomize(data, auth));

  return root;
}

function wrap(title, el) {
  const c = document.createElement('div'); c.className = 'card';
  const h = document.createElement('h3'); h.textContent = title; h.style.marginTop = '0'; h.style.fontSize = '14px';
  c.appendChild(h); c.appendChild(el); return c;
}

function getArt(auth) {
  if (!auth.user.primaryClass) return 'samurai';
  const map = { 'warrior-js': 'samurai', 'ninja-py': 'ninja', 'monk-java':'monk', 'mage-cpp':'mage' };
  return map[auth.user.primaryClass] || 'samurai';
}

function getEmoji(auth) {
  const map = { 'warrior-js': '⚔️', 'ninja-py': '🥷', 'monk-java': '🧘', 'mage-cpp': '🪄' };
  if (!auth.user.primaryClass) return '⚔️';
  return map[auth.user.primaryClass] || '⚔️';
}

function className(data, auth) {
  const k = data.classes.find(c => c.id === auth.user.primaryClass);
  return k ? k.name : 'Unassigned';
}

function sectionBtn(name, key, href) {
  return `<a class="btn" href="${href}">${name}</a>`;
}

function renderDojo(data, auth) {
  const div = document.createElement('div');
  const lang = langOf(auth, data);
  const lessons = data.lessons[lang] || [];
  const list = document.createElement('ul'); list.className = 'list';
  lessons.forEach(lsn => {
    const li = document.createElement('li');
    const done = auth.user.completedLessons.includes(lsn.id);
    li.innerHTML = `
      <span>${lsn.title}</span>
      <span class="notice"> (${lsn.xp} XP)</span>
      <a class="btn secondary" target="_blank" rel="noopener" href="${lsn.url}">Open lesson</a>
      <button class="btn success" data-lesson="${lsn.id}">${done ? 'Completed' : 'Mark Complete'}</button>
    `;
    list.appendChild(li);
  });
  div.appendChild(list);

  div.addEventListener('click', (e) => {
    const btn = e.target; if (!btn.matches('button[data-lesson]')) return;
    const id = btn.getAttribute('data-lesson');
    if (!auth.user.completedLessons.includes(id)) {
      auth.user.completedLessons.push(id);
      const lsn = lessons.find(l => l.id === id);
      award(auth.user, { xp: lsn.xp, coins: 0 });
      saveUser(auth.user); setAuth(auth); location.reload();
    }
  });

  return wrap('Dojo (Lessons via W3Schools)', div);
}

function renderDungeons(data, auth) {
  const div = document.createElement('div');
  const grid = document.createElement('div'); grid.className = 'grid cols-3';
  data.dungeons.forEach(d => {
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `
      <div style="font-size:14px">${d.title}</div>
      <div class="notice">${d.difficulty} • ${d.xp} XP • ${d.coins} coins</div>
      <button class="btn" data-dungeon="${d.id}">Enter</button>
    `;
    grid.appendChild(card);
  });
  div.appendChild(grid);

  div.addEventListener('click', (e) => {
    const btn = e.target; if (!btn.matches('button[data-dungeon]')) return;
    const id = btn.getAttribute('data-dungeon');
    openDungeon(id, data, auth);
  });

  return wrap('Dungeons', div);
}

function openDungeon(id, data, auth) {
  const d = data.dungeons.find(x => x.id === id);
  if (!d) return;
  if (d.engine === 'js-runner') return openJsRunner(data.puzzles['js-runner'][0], auth);
  if (d.engine === 'quiz') return openQuiz(data.puzzles['quiz'][0], auth);
  if (d.engine === 'leetcode-medium') return openLeetNote(data.puzzles['leetcode-medium'][0]);
}

function openLeetNote(p) {
  alert(`${p.title} — Practice on your preferred site (LeetCode/HackerRank), then come back and mark in Guild.`);
}

function openQuiz(p, auth) {
  const correct = confirm(`${p.title}: ${p.questions[0].q}\nA) ${p.questions[0].choices[0]}\nB) ${p.questions[0].choices[1]}\nC) ${p.questions[0].choices[2]}\n\nClick OK if you choose C, Cancel otherwise.`);
  if (correct) {
    award(auth.user, { xp: p.xp, coins: p.coins }); saveUser(auth.user); location.reload();
  }
}

function openJsRunner(p, auth) {
  const code = prompt(`${p.title}:\nWrite function in JS. Starter provided. Submit to run tests.`, p.starter);
  if (code == null) return;
  try {
    // Simple sandbox via Function
    const module = { exports: {} };
    const fn = new Function('module', 'exports', code + '\nreturn module.exports;');
    const exported = fn(module, module.exports);
    const results = p.tests.map(t => String(eval(t.input))).join('|');
    const expect = p.tests.map(t => t.expect).join('|');
    if (results === expect) {
      award(auth.user, { xp: p.xp, coins: p.coins }); saveUser(auth.user); alert('Success! Rewards granted.'); location.reload();
    } else {
      alert('Tests failed.');
    }
  } catch (e) {
    alert('Error running code: ' + e.message);
  }
}

function renderVillage(data, auth) {
  const div = document.createElement('div');
  const quest = { id: 'speed-typing', title: 'Swift Scribe', desc: 'Type this code in 20s', code: 'for (let i=0;i<10;i++){console.log(i)}', reward: { xp: 80, coins: 60 } };
  div.innerHTML = `
    <div class="notice">Villager Quest: ${quest.title} — ${quest.desc}</div>
    <button class="btn" id="btn-quest">Attempt</button>
  `;
  div.querySelector('#btn-quest').addEventListener('click', () => {
    const start = Date.now();
    const input = prompt('Type exactly within 20s:', quest.code);
    const elapsed = (Date.now() - start) / 1000;
    if (input === quest.code && elapsed <= 20) {
      award(auth.user, quest.reward); saveUser(auth.user); alert('Quest complete!'); location.reload();
    } else {
      alert('Failed.');
    }
  });
  return wrap('Village', div);
}

function renderGuild(data, auth) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="statline">Track progress across classes. Retire at Lv 99 after medium problems.</div>
    <div class="inventory">${auth.user.completedLessons.length} lessons, ${auth.user.level} level</div>
  `;
  return wrap('Guild', div);
}

function renderShop(data, auth) {
  const div = document.createElement('div');
  const grid = document.createElement('div'); grid.className = 'grid cols-3';
  data.shop.cosmetics.forEach(item => {
    const c = document.createElement('div'); c.className = 'card';
    c.innerHTML = `
      <div style="font-size:14px">${item.name}</div>
      <div class="notice">${item.price} coins</div>
      <button class="btn" data-buy="${item.id}">Buy</button>
    `;
    grid.appendChild(c);
  });
  div.appendChild(grid);

  div.addEventListener('click', (e) => {
    const btn = e.target; if (!btn.matches('button[data-buy]')) return;
    const id = btn.getAttribute('data-buy'); const item = data.shop.cosmetics.find(i => i.id === id);
    if (auth.user.coins >= item.price) {
      auth.user.coins -= item.price; auth.user.inventory.push(item); saveUser(auth.user); alert('Purchased!'); location.reload();
    } else { alert('Not enough coins'); }
  });
  return wrap('Shop', div);
}

function renderParty(data, auth) {
  const div = document.createElement('div');
  const list = document.createElement('ul'); list.className = 'list';
  data.classes.forEach(klass => {
    const li = document.createElement('li');
    const inParty = !!auth.user.party.find(p => p.id === klass.id);
    li.innerHTML = `
      <span>${klass.name}</span>
      <button class="btn" data-toggle="${klass.id}">${inParty ? 'Remove' : 'Add'}</button>
      <button class="btn secondary" data-switch="${klass.id}">Switch To</button>
    `;
    list.appendChild(li);
  });
  div.appendChild(list);

  div.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('button[data-toggle]')) {
      const id = t.getAttribute('data-toggle');
      const idx = auth.user.party.findIndex(p => p.id === id);
      if (idx >= 0) auth.user.party.splice(idx, 1); else auth.user.party.push({ id, level: 1, xp: 0 });
      saveUser(auth.user); location.reload();
    }
    if (t.matches('button[data-switch]')) {
      const id = t.getAttribute('data-switch'); auth.user.primaryClass = id; saveUser(auth.user); location.reload();
    }
  });

  return wrap('Party', div);
}

function renderCustomize(data, auth) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="notice">Equip cosmetics to change your look (head/body/pet).</div>
    <div class="inventory">${auth.user.inventory.map(i => `<span class="item">${i.name}</span>`).join('') || 'No items yet'}</div>
  `;
  return wrap('Customize', div);
}

function langOf(auth, data) {
  const c = data.classes.find(x => x.id === auth.user.primaryClass);
  if (!c) return 'javascript';
  return c.language;
}


