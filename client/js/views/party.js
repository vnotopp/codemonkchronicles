export async function PartyView() {
  const div = document.createElement('div');
  div.className = 'content';
  div.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">Party</h2>
      <p class="notice">Manage your multi-class party from the Home page. Dedicated management UI coming soon.</p>
    </div>
  `;
  return div;
}
