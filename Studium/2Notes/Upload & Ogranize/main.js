if (!localStorage.getItem('notes')) {
  localStorage.setItem('notes', JSON.stringify([]));
}
if (!localStorage.getItem('folders')) {
  localStorage.setItem('folders', JSON.stringify(['uncategorized']));
}

const fileInput = document.getElementById('file-input');
const folderSelect = document.getElementById('folder-select');
const uploadButton = document.getElementById('upload-button');
const folderNameInput = document.getElementById('folder-name');
const createFolderButton = document.getElementById('create-folder');
const foldersList = document.getElementById('folders-list');

function loadFolders() {
  const folders = JSON.parse(localStorage.getItem('folders'));
  folderSelect.innerHTML = folders.map(folder => `<option value="${folder}">${folder}</option>`).join('');
  renderFolders();
}

function renderFolders() {
  const folders = JSON.parse(localStorage.getItem('folders'));
  const notes = JSON.parse(localStorage.getItem('notes'));

  foldersList.innerHTML = folders.map(folder => `
    <div class="folder">
      <div class="folder-header">
        <span class="dropdown-arrow">▼</span>
        <h3>${folder}</h3>
        <button class="delete-button" data-folder="${folder}">x</button>
      </div>
      <div class="folder-notes">
        ${notes
          .filter(note => note.folder === folder)
          .map(note => `
            <div class="note-item">
              ${note.title || note.name} <!-- Use title if available, otherwise use name -->
              <button class="delete-button" data-id="${note.id}">x</button>
            </div>
          `)
          .join('')}
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.folder-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-button')) {
        const folderNotes = header.nextElementSibling;
        folderNotes.classList.toggle('show');
        header.classList.toggle('collapsed');
      }
    });
  });

  document.querySelectorAll('.note-item .delete-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const noteId = button.getAttribute('data-id');
      deleteNote(noteId);
    });
  });

  document.querySelectorAll('.folder-header .delete-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const folderName = button.getAttribute('data-folder');
      deleteFolder(folderName);
    });
  });
}

uploadButton.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) return alert('Please select a file to upload.');

  const folder = folderSelect.value;
  const reader = new FileReader();

  reader.onload = function (e) {
    const note = {
      id: Date.now().toString(),
      name: file.name,
      type: 'note',
      folder: folder,
      content: e.target.result,
    };

    const notes = JSON.parse(localStorage.getItem('notes'));
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));

    renderFolders();
  };

  reader.readAsDataURL(file);
});

createFolderButton.addEventListener('click', () => {
  const folderName = folderNameInput.value.trim();
  if (!folderName) return alert('Folder name is required.');

  const folders = JSON.parse(localStorage.getItem('folders'));
  if (folders.includes(folderName)) return alert('Folder already exists.');

  folders.push(folderName);
  localStorage.setItem('folders', JSON.stringify(folders));

  folderNameInput.value = '';
  loadFolders();
});

function deleteNote(noteId) {
  if (confirm('Are you sure you want to delete this note?')) {
    let notes = JSON.parse(localStorage.getItem('notes'));
    notes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderFolders(); 
  }
}

function deleteFolder(folderName) {
  if (confirm(`Are you sure you want to delete the folder "${folderName}" and all its notes?`)) {
    let folders = JSON.parse(localStorage.getItem('folders'));
    folders = folders.filter(folder => folder !== folderName);
    localStorage.setItem('folders', JSON.stringify(folders));

    let notes = JSON.parse(localStorage.getItem('notes'));
    notes = notes.filter(note => note.folder !== folderName);
    localStorage.setItem('notes', JSON.stringify(notes));

    renderFolders();
  }
}

function pullNotesFromNoteTakingPage() {
  const noteTakingNotes = JSON.parse(localStorage.getItem('note-taking-notes')) || [];
  const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];

  const mergedNotes = [...existingNotes, ...noteTakingNotes];

  localStorage.setItem('notes', JSON.stringify(mergedNotes));

  localStorage.removeItem('note-taking-notes');

  renderFolders();
}

function addPullNotesButton() {
  const pullNotesButton = document.createElement('button');
  pullNotesButton.textContent = 'Pull Notes from Note-Taking Page';
  pullNotesButton.id = 'pull-notes-button';
  pullNotesButton.addEventListener('click', pullNotesFromNoteTakingPage);

  const uploadSection = document.querySelector('.upload-section');
  uploadSection.appendChild(pullNotesButton);
}

loadFolders();
addPullNotesButton();