export async function VillageView() {
  const div = document.createElement('div');
  div.className = 'content';
  div.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">Village</h2>
      <p class="notice">Meet villagers, take quests, and earn quick rewards. More coming soon.</p>
    </div>
  `;
  return div;
}
