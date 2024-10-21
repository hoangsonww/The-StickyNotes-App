const notesContainer = document.createElement("div");
notesContainer.classList.add("notes-container");
document.body.appendChild(notesContainer);

const calendarBtn = document.createElement("button");
calendarBtn.innerText = "Calendar";
calendarBtn.classList.add("about-btn");
calendarBtn.addEventListener("click", function() {
    window.location.href = 'StickyNotes-Frontend/html/calendar.html';
});
document.body.appendChild(calendarBtn);
calendarBtn.style.marginBottom = "0";

const quotesBtn = document.createElement("button");
quotesBtn.innerText = "Inspiration";
quotesBtn.classList.add("about-btn");
quotesBtn.addEventListener("click", function() {
    window.location.href = 'StickyNotes-Frontend/html/inspiration.html';
});
document.body.appendChild(quotesBtn);

const aboutBtn = document.createElement("button");
aboutBtn.innerText = "About";
aboutBtn.classList.add("about-btn");
aboutBtn.style.marginTop = "3px";
aboutBtn.addEventListener("click", function() {
    window.location.href = 'StickyNotes-Frontend/html/about.html';
});
document.body.appendChild(aboutBtn);

const addBtn = document.getElementById("add");
const notes = JSON.parse(localStorage.getItem("notes"));

if (notes) {
    notes.forEach((note) => {
        addNewNote(note.title, note.text, note.color, note.tag, note.dueDate, note.voiceNote, note.image, note.isPinned);
    });

    sortNotesByDueDate();
    sortNotesByPinned()
}

checkAndDisplayEmptyNotesMessage();

addBtn.addEventListener("click", () => {
    addNewNote();
});

function addNewNote(title = "Untitled Note - Click here to give it a name!", text = "", color = "#ffffff", tag = "", dueDate = "", voiceNote = "", image = "", isPinned = false) {
    const note = document.createElement("div");
    note.classList.add("note");
    note.title = "Drag to reposition this note";
    note.style.backgroundColor = color;

    let today = new Date().toISOString().split('T')[0];

    if (isPinned) {
        note.classList.add("pinned");
    }

    const imageDisplayStyle = image ? 'block' : 'none';

    note.innerHTML = `
        <div class="notes">
            <div class="tools">
                <input type="text" class="due-date" style="font: inherit" placeholder="Add Due Date..." onfocus="this.type='date';this.focus();" onblur="if(!this.value)this.type='text';" min="${today}" value="${dueDate}">
                <input type="text" class="tag" style="font: inherit" placeholder="Add tag..." value="${tag}"/>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="mic"><i class="fas fa-microphone"></i></button>
                <button class="image-btn"><i class="fas fa-image"></i></button>
                <input type="file" class="image-upload" accept="image/*" style="display: none;">
                <audio class="voice-note" controls src="${voiceNote}"></audio>
                <button class="pin">${isPinned ? 'Unpin' : 'Pin'}</button>
                <button class="delete"><i class="fas fa-trash-alt"></i></button>
                <input type="color" class="color-picker" value="${color}" style="border: 1px solid #000000;" title="Change color for this note">
            </div>
            <div class="note-title ${title ? "" : "untitled"}" contenteditable="true">${title}</div>
            <div class="note-content">
                <textarea style="font: inherit" placeholder="Add note content here..." style="width: 100%;">${text}</textarea>
                <div class="image-container" style="display: ${imageDisplayStyle}; position: relative; text-align: center; height: auto; margin-top: 15px;">
                    <img src="${image}" class="note-image" alt="Note Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
                    <span class="remove-image" style="position: absolute; top: 0; right: 0; color: red; font-weight: bolder; font-size: 20px; cursor: pointer; background: none">✖</span>
                </div>
            </div>
        </div>
    `;

    const editBtn = note.querySelector(".edit");
    const deleteBtn = note.querySelector(".delete");
    const colorPicker = note.querySelector(".color-picker");

    const noteTitle = note.querySelector('.note-title');
    const main = note.querySelector(".main");
    const textArea = note.querySelector("textarea");

    textArea.value = text;

    noteTitle.addEventListener('click', () => {
        if (noteTitle.classList.contains('untitled')) {
            noteTitle.textContent = '';
        }
        noteTitle.contentEditable = true;
        noteTitle.focus();
    });

    noteTitle.addEventListener('blur', () => {
        noteTitle.contentEditable = false;
        if (!noteTitle.textContent.trim()) {
            noteTitle.textContent = 'Untitled Note - Click here to give it a name!';
            noteTitle.classList.add('untitled');
        }
        else {
            noteTitle.classList.remove('untitled');
        }
        updateLS();
    });

    editBtn.addEventListener("click", () => {
        main.classList.toggle("hidden");
        textArea.classList.toggle("hidden");

        if (!textArea.classList.contains("hidden")) {
            textArea.focus();
        }
    });

    const pinBtn = note.querySelector('.pin');
    pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';
    pinBtn.title = isPinned ? "Unpin Note" : "Pin Note";

    if (isPinned) {
        pinBtn.classList.add('pin-pinned');
        pinBtn.classList.remove('pin-unpinned');
        pinBtn.title = "Unpin Note";
    }
    else {
        pinBtn.classList.remove('pin-pinned');
        pinBtn.classList.add('pin-unpinned');
        pinBtn.title = "Pin Note";
    }

    pinBtn.addEventListener('click', () => {
        const isNotePinned = note.classList.toggle('pinned');

        if (isNotePinned) {
            pinBtn.querySelector('i').classList.remove('pin-unpinned');
            pinBtn.querySelector('i').classList.add('pin-pinned');
            pinBtn.title = "Unpin Note";
        }
        else {
            pinBtn.querySelector('i').classList.remove('pin-pinned');
            pinBtn.querySelector('i').classList.add('pin-unpinned');
            pinBtn.title = "Pin Note";
        }
        updateLS();
        sortNotesByPinned();
    });

    editBtn.title = "Edit Note";
    deleteBtn.title = "Delete Note";

    deleteBtn.addEventListener("click", () => {
        note.remove();
        updateLS();
        checkAndDisplayEmptyNotesMessage();
    });

    colorPicker.addEventListener("input", (e) => {
        note.style.backgroundColor = e.target.value;
        updateLS();
    });

    textArea.addEventListener("input", (e) => {
        updateLS();
    });

    const tagInput = note.querySelector(".tag");
    tagInput.value = tag;

    tagInput.addEventListener("change", () => {
        updateLS();
    });

    const dueDatePicker = note.querySelector(".due-date");

    dueDatePicker.type = 'text';
    dueDatePicker.value = '';

    if (dueDate) {
        dueDatePicker.type = 'date';
        dueDatePicker.value = dueDate;
    }

    dueDatePicker.addEventListener("change", () => {
        updateLS();
    });

    const imageBtn = note.querySelector('.image-btn');
    const imageUploadInput = note.querySelector('.image-upload');
    const imageContainer = note.querySelector('.image-container');
    const noteImage = note.querySelector('.note-image');
    const removeImageIcon = note.querySelector('.remove-image');

    imageBtn.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadInput.addEventListener('click', function() {
        this.value = null;
    });

    imageUploadInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                noteImage.src = e.target.result;
                imageContainer.style.display = 'block';
                updateLS();
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    removeImageIcon.addEventListener('click', () => {
        noteImage.src = '';
        imageContainer.style.display = 'none';
        updateLS();
    });

    const micBtn = note.querySelector(".mic");
    const voiceNotePlayer = note.querySelector(".voice-note");
    voiceNotePlayer.title = "Listen to your voice note";
    let mediaRecorder;
    let audioChunks = [];
    const removeRecordingBtn = document.createElement('button');
    removeRecordingBtn.innerHTML = '✖';
    removeRecordingBtn.style.display = 'none';
    removeRecordingBtn.title = "Remove Voice Note";

    if (voiceNote || voiceNote !== '') {
        voiceNotePlayer.src = voiceNote;
        removeRecordingBtn.style.display = 'inline';
    }

    if (voiceNote.src) {
        micBtn.disabled = true;
        removeRecordingBtn.style.display = 'inline';
    }

    micBtn.addEventListener("click", () => {
        if (typeof mediaRecorder === 'undefined' || mediaRecorder.state === "inactive") {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = () => {
                        let audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        let audioUrl = URL.createObjectURL(audioBlob);

                        const reader = new FileReader();
                        reader.onloadend = function() {
                            let base64data = reader.result;
                            voiceNotePlayer.src = base64data;
                            updateLS();
                        };
                        reader.readAsDataURL(audioBlob);

                        audioChunks = [];
                    };

                    audioChunks = [];
                    mediaRecorder.start();
                    micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                });
            recordingStatus.style.display = "block";
        }
        else if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            recordingStatus.style.display = "none";
            removeRecordingBtn.style.display = 'inline';
        }
    });

    removeRecordingBtn.addEventListener('click', () => {
        voiceNotePlayer.src = '';
        removeRecordingBtn.style.display = 'none';
        micBtn.disabled = false;
        updateLS();
    });

    voiceNotePlayer.parentNode.insertBefore(removeRecordingBtn, voiceNotePlayer.nextSibling);

    const moveUpButton = document.createElement('button');
    moveUpButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    moveUpButton.className = 'move-up';
    moveUpButton.title = "Move Note Up";
    moveUpButton.addEventListener('click', () => moveUp(note));
    note.querySelector('.tools').appendChild(moveUpButton);

    const moveDownButton = document.createElement('button');
    moveDownButton.innerHTML = '<i class="fas fa-arrow-down"></i>';
    moveDownButton.className = 'move-down';
    moveDownButton.title = "Move Note Down";
    moveDownButton.addEventListener('click', () => moveDown(note));
    note.querySelector('.tools').appendChild(moveDownButton);

    note.draggable = true;
    note.style.cursor = "grab";
    note.addEventListener('dragstart', handleDragStart);
    note.addEventListener('dragend', handleDragEnd);

    notesContainer.addEventListener('dragover', handleDragOver);
    notesContainer.addEventListener('drop', handleDrop);
    notesContainer.appendChild(note);

    imageBtn.title = "Upload or remove image";
    micBtn.title = "Record or stop recording voice note";

    updateLS();
    checkAndDisplayEmptyNotesMessage();
}

function updateLS() {
    const notesArr = [];

    document.querySelectorAll(".note").forEach((note) => {
        const imageData = note.querySelector('.note-image').src;
        const voiceData = note.querySelector('.voice-note').src;
        notesArr.push({
            title: note.querySelector(".note-title").textContent,
            text: note.querySelector("textarea").value,
            color: note.style.backgroundColor,
            tag: note.querySelector(".tag").value,
            dueDate: note.querySelector(".due-date").value,
            voiceNote: voiceData.startsWith('data:audio') ? voiceData : '',
            image: imageData.includes('data:image') ? imageData : '',
            isPinned: note.classList.contains('pinned')
        });
    });

    localStorage.setItem("notes", JSON.stringify(notesArr));
}

function sortNotesByPinned() {
    const pinnedNotes = [];
    const unpinnedNotes = [];

    document.querySelectorAll(".note").forEach((note) => {
        if (note.classList.contains('pinned')) {
            pinnedNotes.push(note);
        }
        else {
            unpinnedNotes.push(note);
        }
    });
    pinnedNotes.concat(unpinnedNotes).forEach(note => notesContainer.appendChild(note));
}

let autoScrollInterval;

function handleWindowDragOver(e) {
    const cursorY = e.clientY;
    const triggerDistance = 50;
    if (cursorY < triggerDistance) {
        startAutoScrolling(-5);
    }
    else if (window.innerHeight - cursorY < triggerDistance) {
        startAutoScrolling(5);
    }
    else {
        stopAutoScrolling();
    }
}

function startAutoScrolling(amount) {
    if (autoScrollInterval) return;
    autoScrollInterval = setInterval(() => {
        window.scrollBy(0, amount);
    }, 50);
}

function stopAutoScrolling() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    const draggableElements = [...notesContainer.querySelectorAll('.note:not(.dragging)')];
    draggableElements.forEach(child => child.style.borderTop = '');
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(notesContainer, e.clientY);
    const draggingElement = document.querySelector('.dragging');
    const draggableElements = [...notesContainer.querySelectorAll('.note:not(.dragging)')];

    draggableElements.forEach(element => {
        if (element === afterElement) {
            element.style.borderTop = '2px solid white';
        }
        else {
            element.style.borderTop = '';
        }
    });
}

function handleDrop(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(notesContainer, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        notesContainer.appendChild(draggable);
    }
    else {
        notesContainer.insertBefore(draggable, afterElement);
    }
    draggable.classList.remove('dragging');
    updateLS();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - (box.height * 0.25);
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.addEventListener('dragover', handleWindowDragOver);
document.addEventListener('dragend', stopAutoScrolling);

function moveUp(noteElem) {
    const prevNote = noteElem.previousElementSibling;
    if (prevNote) {
        notesContainer.insertBefore(noteElem, prevNote);
        updateLS();
    }
}

function moveDown(noteElem) {
    const nextNote = noteElem.nextElementSibling;
    if (nextNote) {
        notesContainer.insertBefore(nextNote, noteElem);
        updateLS();
    }
}

function shakeAllNotes() {
    const notes = document.querySelectorAll(".note");
    notes.forEach((note) => {
        note.classList.add("shake-it");
        note.addEventListener("animationend", () => {
            note.classList.remove("shake-it");
        });
    });
}

const shakeButton = document.createElement("button");
shakeButton.innerText = "Shake Notes!";
document.body.appendChild(shakeButton);
shakeButton.addEventListener("click", shakeAllNotes);
shakeButton.className = "button";
shakeButton.title = "Shake all notes for a fun effect!";

const recordingStatus = document.createElement("div");
recordingStatus.innerText = "Recording...";
recordingStatus.style.display = "none";
document.body.appendChild(recordingStatus);

function sortNotesByDueDate() {
    const notesArray = Array.from(document.querySelectorAll('.note'));
    notesArray.sort((a, b) => {
        const dateA = a.querySelector(".due-date").value;
        const dateB = b.querySelector(".due-date").value;
        const titleA = a.querySelector(".note-title").textContent.trim().toUpperCase();
        const titleB = b.querySelector(".note-title").textContent.trim().toUpperCase();

        if (dateA && dateB) {
            return new Date(dateA) - new Date(dateB);
        }
        else if (dateA) {
            return -1;
        }
        else if (dateB) {
            return 1;
        }
        else {
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        }
    });
    notesArray.forEach(note => notesContainer.appendChild(note));
}

document.addEventListener("DOMContentLoaded", function() {
    const searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("input", (e) => {
        const { value } = e.target;
        filterNotes(value);
    });
});

function filterNotes(query) {
    const notes = document.querySelectorAll(".note");
    notes.forEach((note) => {
        const noteContent = note.textContent;
        if (noteContent.toLowerCase().includes(query.toLowerCase())) {
            note.style.display = "block";
        }
        else {
            note.style.display = "none";
        }
    });
}

const themeToggleButton = document.createElement("button");
themeToggleButton.innerText = "Toggle Dark Mode";
themeToggleButton.id = "themeToggle";
themeToggleButton.className = "button";
themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark-mode");
    }
    else {
        localStorage.removeItem("theme");
    }
});

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');

    if (isDarkMode) {
        localStorage.setItem('theme', 'dark-mode');
    }
    else {
        localStorage.removeItem('theme');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark-mode") {
        document.body.classList.add("dark-mode");
    }
    else {
        document.body.classList.remove("dark-mode");
    }
});

function exportNotes() {
    const notesToExport = localStorage.getItem("notes");
    const blob = new Blob([notesToExport], { type: "text/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.json";
    link.title = "Export all current notes in a single JSON file!";
    link.click();
}

function importNotes(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const notes = JSON.parse(e.target.result);
            localStorage.setItem("notes", JSON.stringify(notes));
            location.reload();
        };
        reader.readAsText(file);
    }
}

const exportButton = document.createElement("button");
exportButton.innerText = "Export Notes";
exportButton.title = "Export all current notes in a single JSON file!";
exportButton.className = "sticky-button";
document.body.appendChild(exportButton);
exportButton.addEventListener("click", exportNotes);
exportButton.className = "button";

const importLabel = document.createElement("label");
importLabel.innerText = "Import Notes";
importLabel.title = "Import notes from any data file (accepted file type: JSON)";
importLabel.setAttribute("for", "import-input");
importLabel.className = "sticky-button";
document.body.appendChild(importLabel);
importLabel.style.transition = "all 0.3s ease-in-out";

importLabel.addEventListener("mouseenter", () => {
    importLabel.style.transform = "scale(1.1)";
});

importLabel.addEventListener("mouseleave", () => {
    importLabel.style.transform = "scale(1)";
});

const importInput = document.createElement("input");
importInput.type = "file";
importInput.id = "import-input";
document.body.appendChild(importInput);
importInput.addEventListener("change", importNotes);
importInput.className = "button";

const chatInput = document.querySelector(".chat-input");
const chatMessages = document.querySelector(".chat-messages");
const chatTitleElem = document.createElement("div");
chatTitleElem.className = "chat-header chat-title";
chatTitleElem.innerText = "The StickyNotes Assistant";
document.querySelector(".chatbot").prepend(chatTitleElem);

function deleteNoteWithTitle(title) {
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        const noteTitle = note.querySelector('.note-title').textContent;
        if (noteTitle.includes(title)) {
            note.querySelector('.delete').click();
        }
    });
}

function searchForNote(query) {
    const searchBox = document.getElementById("searchBox");
    searchBox.value = query;
    filterNotes(query);
}

function toggleTyping(enable) {
    let screen = document.getElementById('calcScreen');
    screen.disabled = !enable;

    if (enable) {
        screen.focus();
    }
}

document.getElementById('calcScreen').addEventListener('click', function() {
    toggleTyping(true);
});

document.getElementById('calcScreen').addEventListener('blur', function() {
    toggleTyping(false);
});

function enableScreen() {
    const screen = document.getElementById('calcScreen');
    screen.disabled = false;
    screen.focus();
}

function clearScreen() {
    document.getElementById('calcScreen').value = '';
}

function press(num) {
    const screen = document.getElementById('calcScreen');

    if (num === '%') {
        screen.value = (eval(screen.value) / 100).toString();
    }
    else {
        screen.value += num;
    }
}

function calculate() {
    try {
        const expression = document.getElementById('calcScreen').value;
        const result = expression.includes('**') ? eval(expression) : eval(expression.replace('^', '**'));
        document.getElementById('calcScreen').value = result;
    }
    catch (e) {
        document.getElementById('calcScreen').value = 'Error';
    }
}

document.getElementById('calcScreen').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    }
});

document.getElementById('calcScreen').addEventListener('click', enableScreen);

document.getElementById('calcScreen').addEventListener('input', function(event) {
    const allowedCharacters = /[0-9+\-*/.]/;
    let value = event.target.value;
    let newValue = value.split('').filter(char => allowedCharacters.test(char)).join('');
    event.target.value = newValue;
});

function toggleCalculator() {
    const calcBody = document.querySelector('.calc-body');
    const toggleCalcButton = document.getElementById('toggleCalc');

    if (calcBody.style.display === 'none') {
        calcBody.style.display = 'block';
        toggleCalcButton.innerText = '-';
        enableScreen();
    }
    else {
        calcBody.style.display = 'none';
        toggleCalcButton.innerText = '+';
    }
}

document.getElementById('toggleCalc').addEventListener('click', toggleCalculator);
document.querySelector('.calc-body').style.display = 'none';
document.getElementById('toggleCalc').innerText = '+';

enableScreen();

document.getElementById('calculator').addEventListener('click', enableScreen);

enableScreen();

document.getElementById('calculator').addEventListener('click', enableScreen);

function pressOperation(operation) {
    const screen = document.getElementById('calcScreen');
    const value = screen.value;

    switch (operation) {
        case 'sqrt':
            screen.value = Math.sqrt(value);
            break;
        case 'pow':
            if (value) {
                screen.value += '^';
            }
            break;
        default:
            break;
    }
}

function submitFeedback(event) {
    event.preventDefault();

    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackText = document.getElementById('feedbackText').value;

    if (feedbackText) {
        fetch('https://formspree.io/f/mayryobo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: new FormData(feedbackForm)
        })
          .then(response => {
              if (response.ok) {
                  alert('Thank you for your feedback!');
                  document.getElementById('feedbackText').value = '';
                  toggleFeedbackForm();
              } else {
                  alert('Oops! Something went wrong.');
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
    }
    else {
        alert('Please enter some feedback before submitting.');
    }
}

function toggleTimer() {
    const timerForm = document.getElementById('timerForm');
    const timerBtn = document.querySelector('.timer-toggle-btn');
    closeAllFormsExcept(timerForm);

    if (timerForm.style.display === 'block') {
        timerForm.style.display = 'none';
        timerBtn.style.display = 'flex';
    }
    else {
        timerForm.style.display = 'block';
        timerBtn.style.display = 'none';
    }
}

function toggleFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackBtn = document.querySelector('.feedback-btn');
    const timerBtn = document.querySelector('.timer-toggle-btn');
    timerBtn.style.display = 'block';
    closeAllFormsExcept(feedbackForm);

    if (feedbackForm.style.display === 'block') {
        feedbackForm.style.display = 'none';
        feedbackBtn.style.display = 'block';
    }
    else {
        feedbackForm.style.display = 'block';
        feedbackBtn.style.display = 'none';
    }
}

let countdownInterval;
let defaultTimeInSeconds = 25 * 60;
let totalTimeInSeconds = defaultTimeInSeconds;

function startTimer() {
    if (!countdownInterval) {
        decrementTimeAndUpdateDisplay();

        countdownInterval = setInterval(decrementTimeAndUpdateDisplay, 1000);

        document.getElementById('startTimerBtn').style.display = 'none';
        document.getElementById('pauseTimerBtn').style.display = 'inline';
    }
}

function decrementTimeAndUpdateDisplay() {
    if (totalTimeInSeconds <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        notifyTimerComplete();
        resetTimer();
        return;
    }

    totalTimeInSeconds--;
    updateTimerDisplay();
}

function pauseTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        document.getElementById('startTimerBtn').style.display = 'inline';
        document.getElementById('pauseTimerBtn').style.display = 'none';
    }
}

function resetTimer() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    totalTimeInSeconds = defaultTimeInSeconds;
    updateTimerDisplay();
    document.getElementById('startTimerBtn').style.display = 'inline';
    document.getElementById('pauseTimerBtn').style.display = 'none';
}

function updateTimerDisplay() {
    let hours = Math.floor(totalTimeInSeconds / 3600);
    let minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    let seconds = totalTimeInSeconds % 60;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    document.getElementById('timerDisplay').textContent = `${hours}:${minutes}:${seconds}`;
}

function setTimerManually() {
    let hours = parseInt(prompt("Set hours (0-24)", "0"), 10);
    let minutes = parseInt(prompt("Set minutes (0-59)", "25"), 10);
    let seconds = parseInt(prompt("Set seconds (0-59)", "0"), 10);

    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
            alert("Invalid input. Hours must be 0-24, minutes and seconds must be 0-59.");
            return;
        }
        totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        updateTimerDisplay();
    }
    else {
        alert("Invalid input. Please enter numeric values for hours, minutes, and seconds.");
    }
}

function notifyTimerComplete() {
    playSound('utils/timer-sound.mp3');
    setTimeout(function() {
        alert("Timer complete!");
    }, 100);
}

function playSound(filename) {
    const audio = new Audio(filename);
    audio.play();
}

document.addEventListener("DOMContentLoaded", function() {
    updateTimerDisplay();
    function updateTime() {
        const now = new Date();
        const timeParts = now.toLocaleTimeString().split(" ");
        const timeString = timeParts[0];
        const amPm = timeParts[1];
        document.getElementById("timeContainer").innerHTML = timeString + "<br>" + amPm;
    }
    updateTime();
    setInterval(updateTime, 1000);
});

const weatherSearchContainer = document.getElementById('weather-search-container');
const weatherSearchInput = document.getElementById('weather-search-input');
const weatherSearchBtn = document.getElementById('weather-search-btn');
const weatherLocation = `${getWeather()}`;

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherLocation}&units=metric`);
        const data = await response.json();
        displayWeather(data);
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function handleGeoLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    weatherDisplay.innerHTML = "<p>Loading Local Weather...</p>";
    fetchWeatherByCoords(lat, lon);
}

weatherSearchBtn.addEventListener('click', () => {
    const city = weatherSearchInput.value;
    fetchWeather(city);
});

weatherSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const city = weatherSearchInput.value;
        fetchWeather(city);
    }
});

const weatherDisplay = document.getElementById('weather-display');
weatherDisplay.innerHTML = "<p>Loading Weather...</p>";

function displayWeather(data) {
    if (data.cod !== 200) {
        weatherDisplay.innerHTML = '<p>Weather data not found</p>';
        return;
    }
    const temp = data.main.temp.toFixed(0);
    weatherDisplay.innerHTML = `
        <strong style="text-align: center; margin-top: -5px">${data.name}</strong>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">
        <span>${temp}°C</span>
    `;
}

function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherLocation}&units=metric`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherDisplay.innerHTML = '<p>Error loading weather data</p>';
        });
}

const isMobileDevice = window.innerWidth < 768;

if (!isMobileDevice && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeoLocation, (error) => {
        if (error.code === error.PERMISSION_DENIED) {
            weatherDisplay.innerHTML = "<p>Location Access Denied.</p>";
        }
        weatherSearchContainer.classList.remove('weather-hidden');
    });
}
else {
    weatherSearchContainer.classList.remove('weather-hidden');
}

document.addEventListener("DOMContentLoaded", () => {
    loadTasksFromLocalStorage();
});

const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
        taskInput.value = '';
    }
});

function addTask(task) {
    if (task.trim() === '') return;
    const li = document.createElement("li");
    li.textContent = task;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = function() {
        this.parentElement.remove();
        updateLocalStorage();
    };
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    updateLocalStorage();
}

function updateLocalStorage() {
    const tasks = [];

    document.querySelectorAll("#task-list li").forEach(li => {
        tasks.push(li.textContent.replace("✖", "").trim());
    });
    localStorage.setItem("quick-tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("quick-tasks")) || [];
    tasks.forEach(task => addTask(task));
}

function logMood() {
    const mood = document.getElementById('moodSelect').value;
    const moodLog = JSON.parse(localStorage.getItem('moodLog')) || {};
    moodLog[mood] = (moodLog[mood] || 0) + 1;

    localStorage.setItem('moodLog', JSON.stringify(moodLog));
    provideMoodRecommendation(moodLog);
}

function provideMoodRecommendation(moodLog) {
    const mostFrequentMood = getMostFrequentMood(moodLog);
    const recommendation = getMoodRecommendation(mostFrequentMood);
    alert(`Your most frequent mood is '${mostFrequentMood}'. ${recommendation}`);
}

function getMostFrequentMood(moodLog) {
    return Object.keys(moodLog).reduce((a, b) => moodLog[a] > moodLog[b] ? a : b);
}

function getMoodRecommendation(mood) {
    const recommendations = {
        'Happy': 'Keep up the good work! Maybe share your happiness with others.',
        'Sad': 'Consider talking to a friend or doing something you enjoy.',
        'Stressed': 'A break might be good. Perhaps try some relaxation techniques.',
        'Relaxed': 'Sounds like a good state to be in! Maybe it is a good time for a creative activity!'
    };
    return recommendations[mood] || 'Enjoy your day!';
}

function getWeather() {
    const weatherLoc = 'NTkzMzA5Mjg0ZDNlYjA5M2VlOTY2NDdlYjI5NDkwNWI=';
    const weatherLat = atob(weatherLoc);
    return weatherLat;
}

async function generateRecommendedNote() {
    const categories = {
        morning: ["Plan your day ahead", "List three things you are grateful for", "Write a morning affirmation"],
        afternoon: ["Summarize your morning achievements", "Draft a to-do list for the afternoon", "Reflect on a positive interaction you had today"],
        evening: ["Plan a relaxing evening activity", "Journal about your day", "Set goals for tomorrow"],
        weekend: ["Brainstorm a creative project", "Write about your ideal weekend", "Create a list of books or movies you want to explore"],
        creative: ["Sketch a small drawing", "Write a short poem or story", "Brainstorm business ideas or inventions"],
        wellness: ["Note down your workout plan", "Meditation or mindfulness exercise", "Track your water intake or diet for the day"],
        learning: ["Write about a new topic you want to learn", "Reflect on an interesting article or book", "Plan your learning goals for the week"]
    };

    const now = new Date();

    let selectedCategory;
    let isWeekend = [0, 6].includes(now.getDay());
    let month = now.getMonth();
    let isSummer = month >= 5 && month <= 7;

    if (now.getHours() < 12) {
        selectedCategory = categories.morning;
    }
    else if (now.getHours() < 18) {
        selectedCategory = categories.afternoon;
    }
    else {
        selectedCategory = categories.evening;
    }

    if (isWeekend) {
        selectedCategory = categories.weekend;
    }

    if (Math.random() < 0.2) {
        selectedCategory = isSummer ? categories.wellness : categories.creative;
    }

    const recommendedPrompt = selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
    createRecommendedNote(recommendedPrompt);
}

function createRecommendedNote(prompt) {
    const popup = document.getElementById('recommendedNoteForm');
    popup.innerHTML = `
        <h4 class="recommended-note-title">We've got a suggestion!</h4>
        <p>Based on your recent activities and the time of day, we think you might enjoy this:</p>
        <p class="recommended-prompt"><strong>${prompt}</strong></p>
        <button onclick="addNewNote('Recommended: ${prompt}', '${prompt}'); toggleRecommendedNoteForm();">Create This Note</button>
        <button onclick="toggleRecommendedNoteForm()">Close</button>
    `;
    popup.style.display = 'block';
}

function toggleMoodTracker() {
    const moodForm = document.getElementById('moodTrackerForm');
    closeAllFormsExcept(moodForm);

    const timerBtn = document.querySelector('.timer-toggle-btn');
    timerBtn.style.display = 'flex';
    moodForm.style.display = moodForm.style.display === 'block' ? 'none' : 'block';
}

function toggleRecommendedNoteForm() {
    const recommendedNoteForm = document.getElementById('recommendedNoteForm');
    closeAllFormsExcept(recommendedNoteForm);

    const timerBtn = document.querySelector('.timer-toggle-btn');
    timerBtn.style.display = 'flex';
    recommendedNoteForm.style.display = recommendedNoteForm.style.display === 'block' ? 'none' : 'block';
}

function closeAllFormsExcept(exceptForm) {
    const allForms = [
        document.getElementById('timerForm'),
        document.getElementById('feedbackForm'),
        document.getElementById('moodTrackerForm'),
        document.getElementById('recommendedNoteForm')
    ];

    allForms.forEach(form => {
        if (form !== exceptForm) {
            form.style.display = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const generateRecommendedNoteBtn = document.getElementById("generateRecommendedNoteBtn");

    if (generateRecommendedNoteBtn) {
        generateRecommendedNoteBtn.addEventListener("click", function() {
            generateRecommendedNote();
        });
    }
});

function handleSignInOut() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedInStickyNotes')) || false;

    if (isSignedIn) {
        localStorage.setItem('isSignedInStickyNotes', JSON.stringify(false));
        alert('You have been signed out.');
    }
    else {
        window.location.href = 'StickyNotes-Frontend/html/sign-in.html';
        return;
    }

    updateSignInButtonState();
}

function updateSignInButtonState() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedInStickyNotes')) || false;

    const signInText = document.getElementById('signInOutText');
    const signInIcon = document.getElementById('signInIcon');
    const signOutIcon = document.getElementById('signOutIcon');

    if (isSignedIn) {
        signInText.textContent = 'Sign Out';
        signInIcon.style.display = 'none';
        signOutIcon.style.display = 'inline-block';
    }
    else {
        signInText.textContent = 'Sign In';
        signInIcon.style.display = 'inline-block';
        signOutIcon.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButtonState();
    document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

function checkAndDisplayEmptyNotesMessage() {
    let notesContainer = document.querySelector(".notes-container");
    let emptyMessage = document.querySelector("#emptyNotesMessage");

    if (!emptyMessage) {
        emptyMessage = document.createElement("div");
        emptyMessage.id = "emptyNotesMessage";
        emptyMessage.textContent = "No notes added yet";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.marginTop = "20px";
        emptyMessage.style.fontWeight = "bold";
        notesContainer.appendChild(emptyMessage);
    }

    const notes = notesContainer.querySelectorAll(".note");
    emptyMessage.style.display = notes.length === 0 ? "block" : "none";
}

document.getElementById("add").addEventListener("click", function() {
    checkAndDisplayEmptyNotesMessage();
});

document.addEventListener("DOMContentLoaded", function() {
    checkAndDisplayEmptyNotesMessage();
});

document.getElementById("toggleAddBtn").addEventListener("click", function() {
    checkAndDisplayEmptyNotesMessage();
});

checkAndDisplayEmptyNotesMessage();
