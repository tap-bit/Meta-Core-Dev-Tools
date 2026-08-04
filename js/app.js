import { initAbilityGenerator } from './generators/ability-gen.js';

const tabInitializers = {
  'ability-gen': initAbilityGenerator,
};

async function loadTab(tabBtn) {
  const tabId = tabBtn.dataset.tab;
  const src = tabBtn.dataset.src;
  const container = document.getElementById('tab-container');

  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  tabBtn.classList.add('active');

  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    container.innerHTML = await response.text();

    if (tabInitializers[tabId]) {
      tabInitializers[tabId]();
    }
  } catch (err) {
    container.innerHTML = `<div class="card coming-soon-card"><div class="section-title">Error Loading Tool</div></div>`;
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const defaultTab = document.querySelector('.tab.active');
  if (defaultTab) loadTab(defaultTab);

  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', (e) => loadTab(e.currentTarget));
  });
});
