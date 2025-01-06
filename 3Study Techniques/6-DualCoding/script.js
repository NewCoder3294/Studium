document.getElementById('save-btn').addEventListener('click', () => {
  const textNotes = document.getElementById('text-notes').value;
  const imagePreview = document.getElementById('image-preview').innerHTML;

  const progress = {
    text: textNotes,
    image: imagePreview,
  };

  localStorage.setItem('dualCodingProgress', JSON.stringify(progress));
  alert('Progress saved!');
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all fields?')) {
    document.getElementById('text-notes').value = '';
    document.getElementById('image-upload-input').value = '';
    document.getElementById('image-preview').innerHTML = '';
    localStorage.removeItem('dualCodingProgress');
    alert('All fields have been reset.');
  }
});

document.getElementById('save-template-btn').addEventListener('click', () => {
  const templateName = document.getElementById('template-name').value.trim();
  if (!templateName) {
    alert('Please enter a name for your template.');
    return;
  }

  const textNotes = document.getElementById('text-notes').value;
  const imagePreview = document.getElementById('image-preview').innerHTML;

  const template = {
    name: templateName,
    text: textNotes,
    image: imagePreview,
  };

  const templates = JSON.parse(localStorage.getItem('dualCodingTemplates')) || [];
  templates.push(template);
  localStorage.setItem('dualCodingTemplates', JSON.stringify(templates));

  alert(`Template "${templateName}" saved!`);
  updateTemplateList();
});

document.getElementById('load-template').addEventListener('change', (e) => {
  const templateName = e.target.value;
  if (!templateName) return;

  const templates = JSON.parse(localStorage.getItem('dualCodingTemplates')) || [];
  const template = templates.find(t => t.name === templateName);

  if (template) {
    document.getElementById('text-notes').value = template.text;
    document.getElementById('image-preview').innerHTML = template.image;
    alert(`Template "${templateName}" loaded!`);
  }
});

function updateTemplateList() {
  const templates = JSON.parse(localStorage.getItem('dualCodingTemplates')) || [];
  const loadTemplateSelect = document.getElementById('load-template');

  loadTemplateSelect.innerHTML = '<option value="">Load a saved template...</option>';

  templates.forEach(template => {
    const option = document.createElement('option');
    option.value = template.name;
    option.textContent = template.name;
    loadTemplateSelect.appendChild(option);
  });
}

document.getElementById('image-upload-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imagePreview = document.getElementById('image-preview');
      imagePreview.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image">`;
    };
    reader.readAsDataURL(file);
  }
});

function loadProgress() {
  const progress = JSON.parse(localStorage.getItem('dualCodingProgress'));
  if (progress) {
    document.getElementById('text-notes').value = progress.text;
    document.getElementById('image-preview').innerHTML = progress.image;
  }
}

window.addEventListener('load', () => {
  loadProgress();
  updateTemplateList();
});