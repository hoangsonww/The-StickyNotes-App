const notesContainer = document.createElement("div");
notesContainer.classList.add("notes-container");
document.body.appendChild(notesContainer);

const aboutBtn = document.createElement("button");
aboutBtn.innerText = "About This App";
aboutBtn.classList.add("about-btn");

aboutBtn.addEventListener("click", function() {
    window.location.href = 'src/html/about.html';
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
    note.style.backgroundColor = color;
    let today = new Date().toISOString().split('T')[0];

    if (isPinned) {
        note.classList.add("pinned");
    }

    note.innerHTML = `
        <div class="notes">
            <div class="tools">
                <input type="text" class="due-date" style="font: inherit" placeholder="Add Due Date..." onfocus="this.type='date';this.focus();" onblur="if(!this.value)this.type='text';" min="${today}" value="">
                <input type="text" class="tag" style="font: inherit" placeholder="Add tag..."/>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="mic"><i class="fas fa-microphone"></i></button>
                <button class="image-btn"><i class="fas fa-image"></i></button>
                <input type="file" class="image-upload" accept="image/*" style="display: none;">
                <audio class="voice-note" controls></audio>
                <button class="pin">${isPinned ? 'Unpin' : 'Pin'}</button>
                <button id="deletBtn" class="delete"><i class="fas fa-trash-alt"></i></button>
                <input type="color" class="color-picker" value="${color}" style="border: 1px solid #000000;">
            </div>
            <div class="note-title ${title ? "" : "untitled"}" contenteditable="false">${title}</div>
            <div class="main ${text ? "" : "hidden"}"></div>
            <div class="note-content">
                <textarea>${text}</textarea>
                <div class="image-container ${image ? "" : "hidden"}">
                    <img src="${image}" class="note-image" />
                    <span class="remove-image">✖</span>
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
    pinBtn.addEventListener('click', () => {
        const isNotePinned = note.classList.toggle('pinned');
        pinBtn.innerHTML = isNotePinned ? '<i class="fas fa-thumbtack"></i>' : '<i class="far fa-thumbtack"></i>';
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

    if (image) {
        noteImage.src = image;
        imageContainer.classList.remove('hidden');
    }

    imageBtn.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                noteImage.src = e.target.result;
                imageContainer.classList.remove('hidden');
                updateLS();
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    removeImageIcon.addEventListener('click', () => {
        noteImage.src = '';
        imageContainer.classList.add('hidden');
        updateLS();
    });

    const imageTooltip = document.createElement("span");
    imageTooltip.classList.add("tooltip");
    imageTooltip.innerText = "Upload or remove image";
    imageBtn.appendChild(imageTooltip);

    imageBtn.addEventListener("mouseenter", () => {
        imageTooltip.classList.add("visible");
    });

    imageBtn.addEventListener("mouseleave", () => {
        imageTooltip.classList.remove("visible");
    });

    const micBtn = note.querySelector(".mic");
    const voiceNotePlayer = note.querySelector(".voice-note");
    let mediaRecorder;
    let audioChunks = [];
    const removeRecordingBtn = document.createElement('button');
    removeRecordingBtn.innerHTML = '✖';
    removeRecordingBtn.className = 'remove-recording hidden';
    removeRecordingBtn.title = "Remove Voice Note";

    if (voiceNote) {
        note.querySelector('.voice-note').src = voiceNote;
    }

    if (voiceNote.src) {
        micBtn.disabled = true;
        removeRecordingBtn.classList.remove('hidden');
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
        }
    });

    removeRecordingBtn.addEventListener('click', () => {
        voiceNotePlayer.src = '';
        removeRecordingBtn.classList.add('hidden');
        micBtn.disabled = false;
        updateLS();
    });

    voiceNotePlayer.parentNode.insertBefore(removeRecordingBtn, voiceNotePlayer.nextSibling);

    const micTooltip = document.createElement("span");
    micTooltip.classList.add("tooltip");
    micTooltip.innerText = "Record a quick voice note instead of typing!";
    micBtn.style.position = "relative";
    micBtn.appendChild(micTooltip);

    const playbackTooltip = document.createElement("span");
    playbackTooltip.classList.add("tooltip");
    playbackTooltip.innerText = "Listen to your voice note!";
    voiceNotePlayer.style.position = "relative";
    voiceNotePlayer.parentNode.insertBefore(playbackTooltip, voiceNotePlayer.nextSibling);

    micBtn.addEventListener("mouseenter", () => {
        micTooltip.classList.add("visible");
    });

    micBtn.addEventListener("mouseleave", () => {
        micTooltip.classList.remove("visible");
    });

    voiceNotePlayer.addEventListener("mouseenter", () => {
        playbackTooltip.classList.add("visible");
    });

    voiceNotePlayer.addEventListener("mouseleave", () => {
        playbackTooltip.classList.remove("visible");
    });

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

document.addEventListener('dragover', handleWindowDragOver);
document.addEventListener('dragend', stopAutoScrolling);

function handleDragStart(e) {
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    const draggableElements = [...notesContainer.querySelectorAll('.note:not(.dragging)')];
    draggableElements.forEach(child => child.style.borderTop = 'none');
}

function handleDragOver(e) {
    e.preventDefault();
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
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function moveUp(noteElem) {
    const prevNote = noteElem.previousElementSibling;
    if (prevNote) {
        notesContainer.insertBefore(noteElem, prevNote);
    }
}

function moveDown(noteElem) {
    const nextNote = noteElem.nextElementSibling;
    if (nextNote) {
        notesContainer.insertBefore(nextNote, noteElem);
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
shakeButton.title = "Shake all notes!";

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
exportButton.className = "sticky-button";
document.body.appendChild(exportButton);
exportButton.addEventListener("click", exportNotes);
exportButton.className = "button";

const importLabel = document.createElement("label");
importLabel.innerText = "Import Notes";
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
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
        const question = e.target.value.trim();
        const userMsgElem = document.createElement("div");
        userMsgElem.innerText = `You: ${question}`;
        chatMessages.appendChild(userMsgElem);
        setTimeout(() => {
            const response = getElizaResponse(question);
            const elizaMsgElem = document.createElement("div");
            elizaMsgElem.innerText = `Assistant: ${response}`;
            chatMessages.appendChild(elizaMsgElem);
        }, 1000);
        e.target.value = '';
    }
});

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

function getElizaResponse(question) {
    question = question.toLowerCase();
    const responses = [
        {
            pattern: /add note titled "?([^"]+)"? with content "?([^"]+)"?/i,
            response: "Adding note titled '{title}' with content '{content}'...",
            action: (title, content) => addNewNote(title, content)
        },
        {
            pattern: /add note titled "?([^"]+)"?/i,
            response: "Adding note titled '{title}'...",
            action: (title, content) => addNewNote(title, content)
        },
        {
            pattern: /dark mode/,
            response: "Toggling dark mode",
            action: () => toggleDarkMode()
        },
        {
            pattern: /delete note titled "?([^"]+)"?/i,
            response: "Deleting note titled '{title}'...",
            action: (title) => deleteNoteWithTitle(title)
        },
        {
            pattern: /toggle (dark|light) mode/i,
            response: "Toggling {mode} mode...",
            action: () => toggleDarkMode()
        },
        {
            pattern: /search for "?([^"]+)"?/i,
            response: "Searching for '{query}'...",
            action: (query) => searchForNote(query)
        },
        { pattern: /hello|hi|hey/, response: "Hello! How can I assist you today?" },
        { pattern: /what is this app|what does this app do/, response: "This app allows you to create, edit, and manage sticky notes." },
        { pattern: /who created this app/, response: "The app was created by David Nguyen in 2023." },
        { pattern: /thank you|thanks/, response: "You're welcome! If you have more questions, just ask." },
        { pattern: /dark mode/, response: "Click the 'Toggle Dark Mode' button to switch between themes." },
        { pattern: /export notes/, response: "You can export your notes by clicking the 'Export Notes' button. It'll save as a JSON file." },
        { pattern: /import notes/, response: "Click on the 'Choose Files' button to select and upload your notes." },
        { pattern: /how are you/, response: "I'm a computer program, so I don't have feelings, but I'm operating at full capacity. How can I help?" },
        { pattern: /what can you do/, response: "I'm here to answer your questions about the app. Just ask away!" },
        { pattern: /create note|new note/, response: "To create a new note, click on the 'Add New Note' button and start typing." },
        { pattern: /delete note/, response: "You can delete a note by selecting it and clicking the 'Delete' button (Trash icon)." },
        { pattern: /edit note/, response: "Simply click on a note to start editing its content." },
        { pattern: /save note/, response: "Your notes are saved automatically once you stop typing." },
        { pattern: /lost note|recover note/, response: "If you've exported your notes previously, you can re-import them. Otherwise, deleted notes cannot be recovered." },
        { pattern: /how many notes/, response: "You can have as many notes as you like in the app. There's no set limit!" },
        { pattern: /search note/, response: "Use the search bar at the top of the app to find specific notes by their content." },
        { pattern: /shortcut|keyboard shortcut/, response: "Use 'Ctrl + N' for a new note, 'Ctrl + S' to save, and 'Ctrl + D' to delete a note." },
        { pattern: /share note/, response: "Currently, this app doesn't support direct note sharing. You can export and send the JSON file manually." },
        { pattern: /cloud|sync/, response: "We don't have cloud syncing at the moment, but it's a feature we're considering for future versions." },
        { pattern: /security|privacy/, response: "Your notes are stored locally on your device. We don't access or store them on any external servers." },
        { pattern: /can i customize/, response: "At the moment, customization is limited to dark and light themes. We're working on more personalization features!" },
        { pattern: /feedback|suggestion/, response: "We appreciate feedback and suggestions! There's a 'Feedback' button in the settings where you can submit yours." },
        { pattern: /language|translate/, response: "Currently, the app is in English only, but multi-language support is in our roadmap." },
        { pattern: /update|new version/, response: "Keep an eye on the 'Updates' section in settings for any new versions or features." },
        { pattern: /bug|issue/, response: "Sorry for the inconvenience. Please report any bugs through the 'Feedback' section so we can address them." },
        { pattern: /cost|price/, response: "The basic version of the app is free, but there might be premium features available for purchase in the future." },
        { pattern: /tutorial|guide/, response: "There's a 'Help' section in the app that provides a step-by-step guide on how to use the various features." },
        { pattern: /favorite note|bookmark/, response: "You can 'star' or mark your favorite notes to easily find them later in the 'Favorites' section." },
        { pattern: /how does this app work/, response: "This app allows you to create, edit, and manage sticky notes." },
        { pattern: /search notes/, response: "You can use the search bar at the top to quickly find any note by its content or title." },
        { pattern: /who created this app/, response: "The app was created by David Nguyen in 2023." },
        { pattern: /thank you|thanks/, response: "You're welcome! If you have more questions, just ask." },
        { pattern: /dark mode/, response: "Click the 'Toggle Dark Mode' button to switch between themes." },
        { pattern: /export notes/, response: "You can export your notes by clicking the 'Export Notes' button. It'll save as a JSON file." },
        { pattern: /import notes/, response: "Click on the 'Choose Files' button to select and upload your notes." },
        { pattern: /how are you/, response: "I'm a computer program, so I don't have feelings, but I'm operating at full capacity. How can I help?" },
        { pattern: /what can you do/, response: "I'm here to answer your questions about the app. Just ask away!" },
        { pattern: /create note|new note/, response: "To create a new note, click on the 'New Note' button and start typing." },
        { pattern: /delete note/, response: "You can delete a note by selecting it and clicking the 'Delete' button." },
        { pattern: /edit note/, response: "Simply click on a note to start editing its content." },
        { pattern: /save note/, response: "Your notes are saved automatically once you stop typing." },
        { pattern: /lost note|recover note/, response: "If you've exported your notes previously, you can re-import them. Otherwise, deleted notes cannot be recovered." },
        { pattern: /how many notes/, response: "You can have as many notes as you like in the app. There's no set limit!" },
        { pattern: /search note/, response: "Use the search bar at the top of the app to find specific notes by their content." },
        { pattern: /shortcut|keyboard shortcut/, response: "Use 'Ctrl + N' for a new note, 'Ctrl + S' to save, and 'Ctrl + D' to delete a note." },
        { pattern: /share note/, response: "Currently, this app doesn't support direct note sharing. You can export and send the JSON file manually." },
        { pattern: /cloud|sync/, response: "We don't have cloud syncing at the moment, but it's a feature we're considering for future versions." },
        { pattern: /security|privacy/, response: "Your notes are stored locally on your device. We don't access or store them on any external servers." },
        { pattern: /can i customize/, response: "At the moment, customization is limited to dark and light themes. We're working on more personalization features!" },
        { pattern: /feedback|suggestion/, response: "We appreciate feedback and suggestions! There's a 'Feedback' button in the settings where you can submit yours." },
        { pattern: /language|translate/, response: "Currently, the app is in English only, but multi-language support is in our roadmap." },
        { pattern: /update|new version/, response: "Keep an eye on the 'Updates' section in settings for any new versions or features." },
        { pattern: /bug|issue/, response: "Sorry for the inconvenience. Please report any bugs through the 'Feedback' section so we can address them." },
        { pattern: /cost|price/, response: "The basic version of the app is free, but there might be premium features available for purchase in the future." },
        { pattern: /tutorial|guide/, response: "There's a 'Help' section in the app that provides a step-by-step guide on how to use the various features." },
        { pattern: /favorite note|bookmark/, response: "You can 'star' or mark your favorite notes to easily find them later in the 'Favorites' section." },
        { pattern: /search notes/, response: "You can use the search bar at the top to quickly find any note by its content or title." },
        { pattern: /collaborate|team/, response: "The current version doesn't support real-time collaboration. It's a feature we might consider in the future." },
        { pattern: /notification|alert/, response: "You can set reminders for your notes. Once set, you'll receive notifications at the specified time." },
        { pattern: /due date|reminder/, response: "You can set reminders for your notes. Once set, you'll receive notifications at the specified time." },
        { pattern: /calendar/, response: "The app doesn't have a calendar view at the moment, but it's a feature we're considering for future versions." },
        { pattern: /archive|archive note/, response: "You can archive notes that you don't need anymore. They'll be hidden from the main view but can be accessed later." },
        { pattern: /favorite|favorite note/, response: "You can 'star' or mark your favorite notes to easily find them later in the 'Favorites' section." },
        { pattern: /voice|voice note/, response: "You can record voice notes instead of typing. Just click on the 'Record' button to start recording." },
        { pattern: /voice command|voice activation/, response: "Voice commands are not supported currently, but it's an interesting idea for future versions!" },
        { pattern: /offline/, response: "Yes, the app works offline. Any changes you make will be synced when you go online next." },
        { pattern: /backup/, response: "It's a good practice to regularly export and back up your notes. This ensures you don't lose any important information." },
        { pattern: /limit|maximum notes/, response: "There's no set limit to the number of notes you can create. However, device storage can be a limiting factor." },
        { pattern: /tags|categories/, response: "Yes, you can categorize your notes using tags. This helps in organizing and quickly accessing related notes." },
        { pattern: /mobile|tablet/, response: "The app is optimized for both desktop and mobile devices. You'll have a seamless experience across all devices." },
        { pattern: /attachment|image/, response: "You can attach images or files to your notes. Just click on the 'Add Attachment' button when editing a note." },
        { pattern: /lost notes|recovery/, response: "If you've exported and backed up your notes, you can easily recover them using the import function." },
        { pattern: /fonts|text style/, response: "While the current version offers a standard font, we're considering font customization options in the future." },
        { pattern: /printing/, response: "Yes, you can print your notes directly from the app. Just open the note and click on the 'Print' option." },
        { pattern: /create note titled (.*) with content (.*)/, response: "Creating note titled '{title}' with content '{content}'..." },
        { pattern: /create note titled (.*)/, response: "Creating note titled '{title}'..." },
        { pattern: /goals|goal/, response: "You can set goals for yourself and track your progress. Just click on the 'Goals' button in the settings." },
        { pattern: /settings/, response: "You can access the app settings by clicking on the 'Settings' button in the top-right corner." },
        { pattern: /help|guide/, response: "You can access the app guide by clicking on the 'Help' button in the top-right corner." },
        { pattern: /reminders|notifications/, response: "You can set reminders for your notes. Once set, you'll receive notifications at the specified time." },
        { pattern: /archive|archive note/, response: "You can archive notes that you don't need anymore. They'll be hidden from the main view but can be accessed later." },
        { pattern: /mood|emoji/, response: "You can add emojis to your notes. Just click on the 'Add Emoji' button when editing a note." },
        { pattern: /favorite|favorite note/, response: "You can 'star' or mark your favorite notes to easily find them later in the 'Favorites' section." },
        { pattern: /recommended|suggested/, response: "You can access recommended notes in the 'Recommended' section. These are notes that you might find useful." },
        { pattern: /voice|voice note/, response: "You can record voice notes instead of typing. Just click on the 'Record' button to start recording." },
        { pattern: /.*/, response: "I'm not sure about that. Can you be more specific or ask another question?" }
    ];
    for (let i = 0; i < responses.length; i++) {
        let match = question.match(responses[i].pattern);
        if (match) {
            if (responses[i].action) responses[i].action(...match.slice(1));
            return responses[i].response.replace('{title}', match[1]).replace('{content}', match[2]).replace('{query}', match[1]).replace('{mode}', match[1]);
        }
    }
    return "Sorry, I didn't get that. Could you please rephrase or ask another question?";
}

const toggleButton = document.createElement("button");
toggleButton.innerText = "-";
toggleButton.className = "toggle-chat";
toggleButton.title="Minimize/Maximize Chatbot";

let isChatbotFirstOpened = true;

toggleButton.onclick = function() {
    const chatMessagesElem = document.querySelector(".chat-messages");
    const chatInputElem = document.querySelector(".chat-input");

    if (chatMessagesElem.style.display === "none") {
        chatMessagesElem.style.display = "";
        chatInputElem.style.display = "";
        toggleButton.innerText = "-";

        if (isChatbotFirstOpened) {
            sendInstructionalMessage();
            isChatbotFirstOpened = false;
        }
    }
    else {
        chatMessagesElem.style.display = "none";
        chatInputElem.style.display = "none";
        toggleButton.innerText = "+";
    }
};

function sendInstructionalMessage() {
    const instructions = `
        Welcome to the StickyNotes Assistant! Here's how you can use me: 
        To add a note, type: "Add note titled 'Your Title' with content 'Your Content'", 
        to delete a note, type: "Delete note titled 'Your Title'", 
        to search for a note, type: "Search for 'Your Keyword'", 
        to toggle dark mode, type: "Toggle dark mode" or "Toggle light mode", 
        and there are so many other things that you can use me for! 
        Enjoy managing your notes more efficiently!
    `;

    const instructionalMsgElem = document.createElement("div");
    instructionalMsgElem.innerHTML = `Assistant: ${instructions}`;
    chatMessages.appendChild(instructionalMsgElem);
}

const chatHeaderElem = document.querySelector(".chat-header");
chatHeaderElem.appendChild(toggleButton);
const chatMessagesElem = document.querySelector(".chat-messages");
const chatInputElem = document.querySelector(".chat-input");
chatMessagesElem.style.display = "none";
chatInputElem.style.display = "none";

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
        timerBtn.style.display = 'block';
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
    } else {
        feedbackForm.style.display = 'block';
        feedbackBtn.style.display = 'none';
    }
}

let countdownInterval;
let defaultTimeInSeconds = 1500;
let totalTimeInSeconds = defaultTimeInSeconds;
let isTimerPaused = false;

function startTimer() {
    if (!countdownInterval && totalTimeInSeconds > 0) {
        updateCountdownDisplay();
        countdownInterval = setInterval(updateCountdownDisplay, 1000);
        document.getElementById('startTimerBtn').style.display = 'none';
        document.getElementById('pauseTimerBtn').style.display = 'inline';
        document.getElementById('stopTimerBtn').style.display = 'inline';
        isTimerPaused = false;
    }
}

function pauseTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        document.getElementById('startTimerBtn').style.display = 'inline';
        document.getElementById('pauseTimerBtn').style.display = 'none';
        isTimerPaused = true;
    }
}

function stopTimer() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    document.getElementById('startTimerBtn').style.display = 'inline';
    document.getElementById('pauseTimerBtn').style.display = 'none';
    document.getElementById('stopTimerBtn').style.display = 'none';
    isTimerPaused = false;
}

function resetTimer() {
    totalTimeInSeconds = defaultTimeInSeconds;
    updateTimerDisplay();
    stopTimer();
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
    const timeInput = prompt("Set timer (in seconds)", "1800");
    if (timeInput && !isNaN(timeInput) && Number(timeInput) >= 0) {
        totalTimeInSeconds = Number(timeInput);
        updateTimerDisplay();
    }
    else {
        alert("Invalid input. Please enter the time in seconds.");
    }
}

function updateCountdownDisplay() {
    if (totalTimeInSeconds <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        notifyTimerComplete();
        resetTimer();
        return;
    }
    updateTimerDisplay();
    if (!isTimerPaused) {
        totalTimeInSeconds--;
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
const apiKey = '593309284d3eb093ee96647eb294905b';

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
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
    weatherDisplay.innerHTML = "<p>Loading Weather...</p>";
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
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherDisplay.innerHTML = '<p>Error loading weather data</p>';
        });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeoLocation, (error) => {
        if (error.code == error.PERMISSION_DENIED) {
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
    timerBtn.style.display = 'block';
    moodForm.style.display = moodForm.style.display === 'block' ? 'none' : 'block';
}

function toggleRecommendedNoteForm() {
    const recommendedNoteForm = document.getElementById('recommendedNoteForm');
    closeAllFormsExcept(recommendedNoteForm);
    const timerBtn = document.querySelector('.timer-toggle-btn');
    timerBtn.style.display = 'block';
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

function updateSignInStatus(isSignedInNow) {
    isSignedIn = isSignedInNow;
    updateSignInButton();
}

function updateSignInButton() {
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    signInOutText.textContent = isSignedIn ? 'Sign Out' : 'Sign In';
    signInOutButton.querySelector('i').className = isSignedIn ? 'fas fa-sign-out-alt' : 'fas fa-user-alt';
}

function initClient() {
    gapi.client.init({
        clientId: '979580896903-hllisv9ev8pgn302e2959o7mlgkp2k9s',
        scope: 'email',
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

gapi.load('client:auth2', initClient);

let isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
updateSignInButton();

function handleSignInOut() {
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    const signInOutIcon = signInOutButton.querySelector('i');

    if (!isSignedIn) {
        signInOutText.textContent = 'Sign Out';
        signInOutIcon.className = 'fas fa-sign-out-alt';
        gapi.auth2.getAuthInstance().signIn().catch(error => {
            console.error("Error during sign-in: ", error);
        });
    }
    else {
        signInOutText.textContent = 'Sign In';
        signInOutIcon.className = 'fas fa-user-alt';
        gapi.auth2.getAuthInstance().signOut().catch(error => {
            console.error("Error during sign-out: ", error);
        });
    }

    isSignedIn = !isSignedIn;
    localStorage.setItem('isSignedIn', isSignedIn);
}

function checkAndDisplayEmptyNotesMessage() {
    let notesContainer = document.querySelector(".notes-container");
    let emptyMessage = document.querySelector("#emptyNotesMessage");

    if (!emptyMessage) {
        emptyMessage = document.createElement("div");
        emptyMessage.id = "emptyNotesMessage";
        emptyMessage.textContent = "No notes added yet";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.marginTop = "20px";
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
