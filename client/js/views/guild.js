export async function GuildView() {
  const div = document.createElement('div');
  div.className = 'content';
  div.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">Guild</h2>
      <p class="notice">Track your journey across classes and achievements. More stats coming soon.</p>
    </div>
  `;
  return div;
}
