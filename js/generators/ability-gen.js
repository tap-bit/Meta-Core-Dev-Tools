const toTitleCase = str => str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const toSnakeCase = str => str.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

function generateData() {
  const rawInput = document.getElementById('ability-name')?.value || 'ability';
  const snakeName = toSnakeCase(rawInput);
  const titleName = toTitleCase(rawInput);

  const colorCode = document.getElementById('color-select')?.value || '';
  const isBold = document.getElementById('style-bold')?.checked ? '§l' : '';
  const isItalic = document.getElementById('style-italic')?.checked ? '§o' : '';
  const isObfuscated = document.getElementById('style-obfuscated')?.checked ? '§k' : '';

  const formattingPrefix = `${colorCode}${isBold}${isItalic}${isObfuscated}`;
  const finalDisplayName = `${formattingPrefix}${titleName}`;

  const rawStack = document.getElementById('max-stack')?.value;
  const maxStack = rawStack !== '' && rawStack !== undefined ? parseInt(rawStack, 10) : 1;

  const rawMove = document.getElementById('movement-modifier')?.value;
  const moveModifier = rawMove !== '' && rawMove !== undefined ? parseFloat(rawMove) : 0.5;

  const jsonObject = {
    "format_version": "1.20.50",
    "minecraft:item": {
      "description": {
        "identifier": `ability:${snakeName}`,
        "menu_category": { "category": "items" }
      },
      "components": {
        "minecraft:max_stack_size": maxStack,
        "minecraft:display_name": { "value": finalDisplayName },
        "minecraft:icon": { "texture": snakeName },
        "minecraft:use_modifiers": {
          "use_duration": 99999,
          "movement_modifier": moveModifier
        }
      }
    }
  };

  return {
    filename: `${snakeName || 'ability'}.json`,
    jsonString: JSON.stringify(jsonObject, null, 4)
  };
}

function updateJSON() {
  const { filename, jsonString } = generateData();
  const filenameEl = document.getElementById('filename-preview');
  const previewEl = document.getElementById('json-preview');

  if (filenameEl) filenameEl.innerText = filename;
  if (previewEl) previewEl.innerText = jsonString;
}

function downloadJSON() {
  const { filename, jsonString } = generateData();
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyJSON() {
  const { jsonString } = generateData();
  navigator.clipboard.writeText(jsonString).then(() => {
    alert('JSON copied to clipboard!');
  });
}

export function initAbilityGenerator() {
  const inputs = ['ability-name', 'color-select', 'style-bold', 'style-italic', 'style-obfuscated', 'max-stack', 'movement-modifier'];
  
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateJSON);
  });

  document.getElementById('btn-download')?.addEventListener('click', downloadJSON);
  document.getElementById('btn-copy')?.addEventListener('click', copyJSON);

  updateJSON();
}
