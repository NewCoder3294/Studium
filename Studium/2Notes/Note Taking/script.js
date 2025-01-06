const addClassBtn = document.getElementById("addClassBtn");
const classInput = document.getElementById("classInput");
const classList = document.getElementById("classList");
const classNameHeading = document.getElementById("className");
const lectureContainer = document.getElementById("lectureContainer");
const noteSystemSelector = document.getElementById("noteSystem");
const saveButton = document.getElementById("saveButton"); 

let currentClass = null;

let classes = JSON.parse(localStorage.getItem("classes")) || [];

function renderClasses() {
  classList.innerHTML = ""; 
  classes.forEach((cls, index) => {
    const li = document.createElement("li");
    li.textContent = cls.name;

    const dropdownArrow = document.createElement("span");
    dropdownArrow.textContent = "▼";
    dropdownArrow.classList.add("dropdown-arrow");
    li.appendChild(dropdownArrow);

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu");

    cls.lectures.forEach((lecture, lectureIndex) => {
      const lectureItem = document.createElement("li");
      lectureItem.textContent = lecture.title || "Untitled Lecture";
      lectureItem.addEventListener("click", () => loadLecture(index, lectureIndex));
      dropdownMenu.appendChild(lectureItem);
    });

    const addLectureButton = document.createElement("button");
    addLectureButton.textContent = "Add New Lecture";
    addLectureButton.classList.add("add-lecture-button");
    addLectureButton.addEventListener("click", (e) => {
      e.stopPropagation(); 
      addNewLecture(index);
    });

    const removeClassButton = document.createElement("button");
    removeClassButton.textContent = "Remove Class";
    removeClassButton.classList.add("remove-class-button");
    removeClassButton.addEventListener("click", (e) => {
      e.stopPropagation(); 
      removeClass(index);
    });

    li.appendChild(dropdownMenu);
    li.appendChild(addLectureButton);
    li.appendChild(removeClassButton);
    li.addEventListener("click", () => toggleDropdown(dropdownMenu));
    classList.appendChild(li);
  });
}

function toggleDropdown(dropdownMenu) {
  dropdownMenu.classList.toggle("show");
}

addClassBtn.addEventListener("click", () => {
  const className = classInput.value.trim();
  if (className) {
    classes.push({ name: className, lectures: [] }); 
    localStorage.setItem("classes", JSON.stringify(classes)); 
    renderClasses(); 
    classInput.value = ""; 
  }
});

function loadLecture(classIndex, lectureIndex) {
  currentClass = { classIndex, lectureIndex }; 
  const selectedClass = classes[classIndex];
  const selectedLecture = selectedClass.lectures[lectureIndex];
  classNameHeading.textContent = `Lecture: ${selectedLecture.title || "Untitled Lecture"}`;
  lectureContainer.innerHTML = ""; 

  const noteSystem = noteSystemSelector.value;
  let lectureDiv;

  switch (noteSystem) {
    case "normal":
      lectureDiv = createNormalLecture(selectedLecture, classIndex, lectureIndex);
      break;
    case "cornell":
      lectureDiv = createCornellLecture(selectedLecture, classIndex, lectureIndex);
      break;
    default:
      lectureDiv = createNormalLecture(selectedLecture, classIndex, lectureIndex);
  }

  lectureContainer.appendChild(lectureDiv);
}

function createNormalLecture(lecture, classIndex, lectureIndex) {
  const lectureDiv = document.createElement("div");
  lectureDiv.classList.add("lecture");

  const lectureTitleInput = document.createElement("input");
  lectureTitleInput.type = "text";
  lectureTitleInput.placeholder = "Lecture Title";
  lectureTitleInput.value = lecture.title;
  lectureTitleInput.addEventListener("input", () => {
    lecture.title = lectureTitleInput.value;
  });

  const lectureTextArea = document.createElement("textarea");
  lectureTextArea.placeholder = "Write your notes here...";
  lectureTextArea.value = lecture.notes;
  lectureTextArea.addEventListener("input", () => {
    lecture.notes = lectureTextArea.value;
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Lecture";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    deleteLecture(classIndex, lectureIndex);
  });

  lectureDiv.appendChild(lectureTitleInput);
  lectureDiv.appendChild(lectureTextArea);
  lectureDiv.appendChild(deleteButton);
  return lectureDiv;
}

function createCornellLecture(lecture, classIndex, lectureIndex) {
  const lectureDiv = document.createElement("div");
  lectureDiv.classList.add("lecture", "cornell");

  const lectureTitleInput = document.createElement("input");
  lectureTitleInput.type = "text";
  lectureTitleInput.placeholder = "Lecture Title";
  lectureTitleInput.value = lecture.title;
  lectureTitleInput.addEventListener("input", () => {
    lecture.title = lectureTitleInput.value;
  });

  const cuesTextArea = document.createElement("textarea");
  cuesTextArea.placeholder = "Cues (Key Points)";
  cuesTextArea.value = lecture.cues || "";
  cuesTextArea.addEventListener("input", () => {
    lecture.cues = cuesTextArea.value;
  });

  const notesTextArea = document.createElement("textarea");
  notesTextArea.placeholder = "Notes";
  notesTextArea.value = lecture.notes || "";
  notesTextArea.addEventListener("input", () => {
    lecture.notes = notesTextArea.value;
  });

  const summaryTextArea = document.createElement("textarea");
  summaryTextArea.placeholder = "Summary";
  summaryTextArea.value = lecture.summary || "";
  summaryTextArea.addEventListener("input", () => {
    lecture.summary = summaryTextArea.value;
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Lecture";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    deleteLecture(classIndex, lectureIndex);
  });

  lectureDiv.appendChild(lectureTitleInput);
  lectureDiv.appendChild(cuesTextArea);
  lectureDiv.appendChild(notesTextArea);
  lectureDiv.appendChild(summaryTextArea);
  lectureDiv.appendChild(deleteButton);
  return lectureDiv;
}

function addNewLecture(classIndex) {
  const selectedClass = classes[classIndex];
  const lecture = {
    id: Date.now().toString(), 
    title: "Untitled Lecture", 
    notes: "", 
    folder: selectedClass.name, 
  }

  selectedClass.lectures.push(lecture);
  localStorage.setItem("classes", JSON.stringify(classes)); 
  saveNote(lecture); 
  renderClasses(); 
  loadLecture(classIndex, selectedClass.lectures.length - 1); 
}

function saveNote(note) {
  const notes = JSON.parse(localStorage.getItem('note-taking-notes')) || [];
  notes.push(note);
  localStorage.setItem('note-taking-notes', JSON.stringify(notes));
}

function removeClass(classIndex) {
  if (confirm("Are you sure you want to remove this class and all its lectures?")) {
    classes.splice(classIndex, 1); 
    localStorage.setItem("classes", JSON.stringify(classes)); 
    renderClasses(); 
    lectureContainer.innerHTML = ""; 
    classNameHeading.textContent = "Select a Class"; 
  }
}

function deleteLecture(classIndex, lectureIndex) {
  if (confirm("Are you sure you want to delete this lecture?")) {
    const selectedClass = classes[classIndex];
    selectedClass.lectures.splice(lectureIndex, 1); 
    localStorage.setItem("classes", JSON.stringify(classes)); 
    renderClasses(); 
    lectureContainer.innerHTML = ""; 
    classNameHeading.textContent = "Select a Class"; 
  }
}

saveButton.addEventListener("click", () => {
  if (currentClass) {
    const selectedClass = classes[currentClass.classIndex];
    const selectedLecture = selectedClass.lectures[currentClass.lectureIndex];

    saveNote(selectedLecture);
    alert("Note saved successfully!");
  } else {
    alert("No lecture selected.");
  }
});

renderClasses();

noteSystemSelector.addEventListener("change", () => {
  if (currentClass !== null) {
    loadLecture(currentClass.classIndex, currentClass.lectureIndex);
  }
});