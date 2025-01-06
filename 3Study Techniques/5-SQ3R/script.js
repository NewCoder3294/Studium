document.getElementById('save-btn').addEventListener('click', () => {
  const surveyNotes = document.getElementById('survey-notes').value;
  const questionNotes = document.getElementById('question-notes').value;
  const readNotes = document.getElementById('read-notes').value;
  const reciteNotes = document.getElementById('recite-notes').value;
  const reviewNotes = document.getElementById('review-notes').value;

  const progress = {
    survey: surveyNotes,
    question: questionNotes,
    read: readNotes,
    recite: reciteNotes,
    review: reviewNotes,
  };

  localStorage.setItem('sq3rProgress', JSON.stringify(progress));
  alert('Progress saved!');
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all fields?')) {
    document.getElementById('survey-notes').value = '';
    document.getElementById('question-notes').value = '';
    document.getElementById('read-notes').value = '';
    document.getElementById('recite-notes').value = '';
    document.getElementById('review-notes').value = '';
    localStorage.removeItem('sq3rProgress');
    alert('All fields have been reset.');
  }
});

document.getElementById('save-template-btn').addEventListener('click', () => {
  const templateName = document.getElementById('template-name').value.trim();
  if (!templateName) {
    alert('Please enter a name for your template.');
    return;
  }

  const surveyNotes = document.getElementById('survey-notes').value;
  const questionNotes = document.getElementById('question-notes').value;
  const readNotes = document.getElementById('read-notes').value;
  const reciteNotes = document.getElementById('recite-notes').value;
  const reviewNotes = document.getElementById('review-notes').value;

  const template = {
    name: templateName,
    survey: surveyNotes,
    question: questionNotes,
    read: readNotes,
    recite: reciteNotes,
    review: reviewNotes,
  };

  const templates = JSON.parse(localStorage.getItem('sq3rTemplates')) || [];
  templates.push(template);
  localStorage.setItem('sq3rTemplates', JSON.stringify(templates));

  alert(`Template "${templateName}" saved!`);
  updateTemplateList();
});

document.getElementById('load-template').addEventListener('change', (e) => {
  const templateName = e.target.value;
  if (!templateName) return;

  const templates = JSON.parse(localStorage.getItem('sq3rTemplates')) || [];
  const template = templates.find(t => t.name === templateName);

  if (template) {
    document.getElementById('survey-notes').value = template.survey;
    document.getElementById('question-notes').value = template.question;
    document.getElementById('read-notes').value = template.read;
    document.getElementById('recite-notes').value = template.recite;
    document.getElementById('review-notes').value = template.review;
    alert(`Template "${templateName}" loaded!`);
  }
});

function updateTemplateList() {
  const templates = JSON.parse(localStorage.getItem('sq3rTemplates')) || [];
  const loadTemplateSelect = document.getElementById('load-template');

  loadTemplateSelect.innerHTML = '<option value="">Load a saved template...</option>';

  templates.forEach(template => {
    const option = document.createElement('option');
    option.value = template.name;
    option.textContent = template.name;
    loadTemplateSelect.appendChild(option);
  });
}

function loadProgress() {
  const progress = JSON.parse(localStorage.getItem('sq3rProgress'));
  if (progress) {
    document.getElementById('survey-notes').value = progress.survey;
    document.getElementById('question-notes').value = progress.question;
    document.getElementById('read-notes').value = progress.read;
    document.getElementById('recite-notes').value = progress.recite;
    document.getElementById('review-notes').value = progress.review;
  }
}

window.addEventListener('load', () => {
  loadProgress();
  updateTemplateList();
});