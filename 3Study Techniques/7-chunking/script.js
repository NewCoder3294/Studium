document.getElementById('save-btn').addEventListener('click', () => {
  const chunks = getChunks();
  const progress = { chunks };
  localStorage.setItem('chunkingProgress', JSON.stringify(progress));
  alert('Progress saved!');
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all fields?')) {
    document.getElementById('chunks-container').innerHTML = '';
    localStorage.removeItem('chunkingProgress');
    alert('All fields have been reset.');
  }
});

document.getElementById('save-template-btn').addEventListener('click', () => {
  const templateName = document.getElementById('template-name').value.trim();
  if (!templateName) {
    alert('Please enter a name for your template.');
    return;
  }

  const chunks = getChunks();
  const template = { name: templateName, chunks };

  const templates = JSON.parse(localStorage.getItem('chunkingTemplates')) || [];
  templates.push(template);
  localStorage.setItem('chunkingTemplates', JSON.stringify(templates));

  alert(`Template "${templateName}" saved!`);
  updateTemplateList();
});

document.getElementById('load-template').addEventListener('change', (e) => {
  const templateName = e.target.value;
  if (!templateName) return;

  const templates = JSON.parse(localStorage.getItem('chunkingTemplates')) || [];
  const template = templates.find(t => t.name === templateName);

  if (template) {
    document.getElementById('chunks-container').innerHTML = '';
    template.chunks.forEach(chunk => addChunk(chunk.title, chunk.content));
    alert(`Template "${templateName}" loaded!`);
  }
});

function updateTemplateList() {
  const templates = JSON.parse(localStorage.getItem('chunkingTemplates')) || [];
  const loadTemplateSelect = document.getElementById('load-template');

  loadTemplateSelect.innerHTML = '<option value="">Load a saved template...</option>';

  templates.forEach(template => {
    const option = document.createElement('option');
    option.value = template.name;
    option.textContent = template.name;
    loadTemplateSelect.appendChild(option);
  });
}

document.getElementById('add-chunk-btn').addEventListener('click', () => {
  addChunk();
});

function addChunk(title = '', content = '') {
  const chunk = document.createElement('div');
  chunk.className = 'chunk';
  chunk.innerHTML = `
    <input type="text" placeholder="Enter chunk title..." value="${title}">
    <textarea placeholder="Enter chunk content...">${content}</textarea>
  `;
  document.getElementById('chunks-container').appendChild(chunk);
}

function getChunks() {
  const chunks = [];
  document.querySelectorAll('.chunk').forEach(chunk => {
    const title = chunk.querySelector('input').value;
    const content = chunk.querySelector('textarea').value;
    chunks.push({ title, content });
  });
  return chunks;
}

function loadProgress() {
  const progress = JSON.parse(localStorage.getItem('chunkingProgress'));
  if (progress) {
    progress.chunks.forEach(chunk => addChunk(chunk.title, chunk.content));
  }
}

window.addEventListener('load', () => {
  loadProgress();
  updateTemplateList();
});