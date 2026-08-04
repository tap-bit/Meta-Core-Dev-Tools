// js/app.js
async function loadTab(tabName) {
  const container = document.getElementById('tab-container');
  
  try {
    const response = await fetch(`tabs/${tabName}.html`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;

    // Trigger tab-specific JS initialization
    if (tabName === 'ability-gen') {
      import('./generators/ability-gen.js').then(module => {
        if (module.init) module.init();
      });
    }
  } catch (error) {
    console.error('Error loading tab:', error);
    container.innerHTML = `<div class="coming-soon">Failed to load content.</div>`;
  }
}

// Attach event listeners to tab buttons
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const tabName = button.getAttribute('data-tab');
    loadTab(tabName);
  });
});

// Load default tab on launch
loadTab('ability-gen');
