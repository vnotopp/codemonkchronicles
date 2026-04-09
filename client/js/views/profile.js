import { getAuth } from '../state/session.js';

export async function ProfileView() {
  const { user } = getAuth();
  const div = document.createElement('div');
  div.className = 'content';
  const initial = (user?.name || 'U').slice(0,1);
  div.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">Profile</h2>
      <div style="display:flex;align-items:center;gap:12px;margin-top:10px">
        <div class="avatar avatar-lg">${user?.picture ? `<img src="${user.picture}" alt="avatar"/>` : `<span>${initial}</span>`}</div>
        <div>
          <div style="font-size:14px">${user?.name || 'Unknown Adventurer'}</div>
          <div class="notice">${user?.email || ''}</div>
        </div>
      </div>
      <div style="margin-top:14px">
        <a class="btn secondary" href="#/class">Change Class</a>
      </div>
    </div>
  `;
  return div;
}
