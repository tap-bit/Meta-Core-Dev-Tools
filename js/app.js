import { initAbilityGenerator } from './generators/ability-gen.js';

// Registry maps tab IDs to their module initializer functions
const tabInitializers = {
  'ability-gen': initAbilityGenerator,
};

async function loadTab(tabBtn) {
  const tabId = tabBtn.dataset.tab;
  const src = tabBtn.dataset.src;
  const container = document.getElementById('tab-container');

  // Update button active states
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  tabBtn.classList.add('active');

  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    container.innerHTML = await response.text();

    // Initialize JS logic tied to the active tab if present
    if (tabInitializers[tabId]) {
      tabInitializers[tabId]();
    }
  } catch (err) {
    container.innerHTML = `<div class="coming-soon"><h2>Error loading tab content</h2></div>`;
    console.error(err);
  }
}

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const defaultTab = document.querySelector('.tab-btn.active');
  if (defaultTab) loadTab(defaultTab);

  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', (e) => loadTab(e.currentTarget));
  });
});
