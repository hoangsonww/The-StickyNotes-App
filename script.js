// Creating a container for the notes
const notesContainer = document.createElement("div");
notesContainer.classList.add("notes-container");
document.body.appendChild(notesContainer);

// Existing code for handling notes
const addBtn = document.getElementById("add");
const notes = JSON.parse(localStorage.getItem("notes"));

if (notes) {
    notes.forEach((note) => {
        addNewNote(note.text, note.color, note.tag, note.dueDate, note.voiceNote);
    });
    sortNotesByDueDate();
}

addBtn.addEventListener("click", () => {
    addNewNote();
});

function addNewNote(text = "", color = "#ffffff", tag = "", dueDate = "", voiceNote = "") {
    const note = document.createElement("div");
    note.classList.add("note");
    note.style.backgroundColor = color;
    let today = new Date().toISOString().split('T')[0];

    note.innerHTML = `
        <div class="notes">
            <div class="tools">
                <input type="date" class="due-date" min="${today}" value="${dueDate}">
                <input type="text" class="tag" placeholder="Add tag..."/>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="mic"><i class="fas fa-microphone"></i></button>
                <audio class="voice-note" controls></audio>
                <button class="delete"><i class="fas fa-trash-alt"></i></button>
                <input type="color" class="color-picker" value="${color}">
            </div>
            <div class="main ${text ? "" : "hidden"}"></div>
            <textarea class="${text ? "hidden" : ""}"></textarea>
        </div>
    `;

    const editBtn = note.querySelector(".edit");
    const deleteBtn = note.querySelector(".delete");
    const colorPicker = note.querySelector(".color-picker");

    const main = note.querySelector(".main");
    const textArea = note.querySelector("textarea");

    textArea.value = text;
    main.innerHTML = marked(text);

    editBtn.addEventListener("click", () => {
        main.classList.toggle("hidden");
        textArea.classList.toggle("hidden");
    });

    deleteBtn.addEventListener("click", () => {
        note.remove();
        updateLS();
    });

    colorPicker.addEventListener("input", (e) => {
        note.style.backgroundColor = e.target.value;
        updateLS();
    });

    textArea.addEventListener("input", (e) => {
        const { value } = e.target;
        main.innerHTML = marked(value);
        updateLS();
    });

    const tagInput = note.querySelector(".tag");
    tagInput.value = tag;

    const dueDatePicker = note.querySelector(".due-date");
    dueDatePicker.addEventListener("change", () => {
        sortNotesByDueDate();
        updateLS();
    });

    const micBtn = note.querySelector(".mic");
    const voiceNotePlayer = note.querySelector(".voice-note");

    let mediaRecorder;
    let audioChunks = [];

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
                        voiceNotePlayer.src = audioUrl;
                        updateLS();
                    };

                    audioChunks = [];
                    mediaRecorder.start();
                    micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>'; // Update icon to indicate recording
                });
            recordingStatus.style.display = "block";
        }
        else if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>'; // Reset icon after recording
            recordingStatus.style.display = "none";
        }
    });

    // Create tooltips for both elements
    const micTooltip = document.createElement("span");
    micTooltip.classList.add("tooltip");
    micTooltip.innerText = "Record a quick voice note instead of typing!";
    micBtn.style.position = "relative"; // to position tooltip correctly
    micBtn.appendChild(micTooltip);

    const playbackTooltip = document.createElement("span");
    playbackTooltip.classList.add("tooltip");
    playbackTooltip.innerText = "Listen to your voice note!";
    voiceNotePlayer.style.position = "relative"; // to position tooltip correctly
    voiceNotePlayer.parentNode.insertBefore(playbackTooltip, voiceNotePlayer.nextSibling); // placing tooltip next to voiceNotePlayer

    // Add event listeners to mic button
    micBtn.addEventListener("mouseenter", () => {
        micTooltip.classList.add("visible");
    });

    micBtn.addEventListener("mouseleave", () => {
        micTooltip.classList.remove("visible");
    });

    // Add event listeners to voice note player
    voiceNotePlayer.addEventListener("mouseenter", () => {
        playbackTooltip.classList.add("visible");
    });

    voiceNotePlayer.addEventListener("mouseleave", () => {
        playbackTooltip.classList.remove("visible");
    });

    const moveUpButton = document.createElement('button');
    moveUpButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    moveUpButton.className = 'move-up';
    moveUpButton.addEventListener('click', () => moveUp(note));
    note.querySelector('.tools').appendChild(moveUpButton);

    const moveDownButton = document.createElement('button');
    moveDownButton.innerHTML = '<i class="fas fa-arrow-down"></i>';
    moveDownButton.className = 'move-down';
    moveDownButton.addEventListener('click', () => moveDown(note));
    note.querySelector('.tools').appendChild(moveDownButton);

    // Drag and Drop
    note.draggable = true;
    note.addEventListener('dragstart', handleDragStart);
    note.addEventListener('dragend', handleDragEnd);

    notesContainer.addEventListener('dragover', handleDragOver);
    notesContainer.addEventListener('drop', handleDrop);

    notesContainer.appendChild(note);
}

let autoScrollInterval;

function handleWindowDragOver(e) {
    const cursorY = e.clientY;
    const triggerDistance = 50; // The distance from the edge at which scrolling should start

    if (cursorY < triggerDistance) {
        // Cursor is near the top of the viewport
        startAutoScrolling(-5); // Negative for scrolling up
    } else if (window.innerHeight - cursorY < triggerDistance) {
        // Cursor is near the bottom of the viewport
        startAutoScrolling(5); // Positive for scrolling down
    } else {
        stopAutoScrolling(); // Cursor is no longer near the top or bottom
    }
}

function startAutoScrolling(amount) {
    if (autoScrollInterval) return; // Already autoscrolling

    autoScrollInterval = setInterval(() => {
        window.scrollBy(0, amount);
    }, 50); // Adjust the interval for faster or slower scrolling
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
    } else {
        notesContainer.insertBefore(draggable, afterElement);
    }
    draggable.classList.remove('dragging');
}

function handleDragEnter(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(notesContainer, e.clientY);
    if (afterElement) {
        afterElement.style.borderTop = '2px dashed #666';
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(notesContainer, e.clientY);
    if (afterElement) {
        afterElement.style.borderTop = 'none';
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
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

        // Remove the shake-it class after the animation ends to avoid unwanted repetitions
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

const recordingStatus = document.createElement("div");
recordingStatus.innerText = "Recording...";
recordingStatus.style.display = "none";
document.body.appendChild(recordingStatus);

function sortNotesByDueDate() {
    const notesArray = Array.from(document.querySelectorAll('.note'));
    notesArray.sort((a, b) => {
        let dateA = new Date(a.querySelector(".due-date").value);
        let dateB = new Date(b.querySelector(".due-date").value);
        return dateA - dateB;
    });

    notesArray.forEach(note => notesContainer.appendChild(note));
}

function updateLS() {
    const notesArr = [];
    document.querySelectorAll(".note").forEach((note) => {
        notesArr.push({
            text: note.querySelector("textarea").value,
            color: note.style.backgroundColor,
            tag: note.querySelector(".tag").value,
            dueDate: note.querySelector(".due-date").value,
            voiceNote: note.querySelector(".voice-note").src
        });
    });

    localStorage.setItem("notes", JSON.stringify(notesArr));
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
        } else {
            note.style.display = "none";
        }
    });
}

const themeToggleButton = document.createElement("button");
themeToggleButton.innerText = "Toggle Dark Mode";
themeToggleButton.id = "themeToggle";
document.body.appendChild(themeToggleButton);
themeToggleButton.className = "button";

themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark-mode");
    } else {
        localStorage.removeItem("theme");
    }
});

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
exportButton.className = "sticky-button"; // Add this line
document.body.appendChild(exportButton);
exportButton.addEventListener("click", exportNotes);
exportButton.className = "button";

// Create a label for the input for better styling
const importLabel = document.createElement("label");
importLabel.innerText = "Import Notes";
importLabel.setAttribute("for", "import-input");
importLabel.className = "sticky-button"; // Using the same class for consistency
document.body.appendChild(importLabel);
importLabel.style.transition = "all 0.3s ease-in-out"; // Add a transition for the hover effect
importLabel.addEventListener("mouseenter", () => {
    importLabel.style.transform = "scale(1.1)"; // Scale up on hover
});
importLabel.addEventListener("mouseleave", () => {
    importLabel.style.transform = "scale(1)"; // Scale back to normal on exit
});

const importInput = document.createElement("input");
importInput.type = "file";
importInput.id = "import-input"; // ID added for the label to recognize it
document.body.appendChild(importInput);
importInput.addEventListener("change", importNotes);
importInput.className = "button";

// Chat interaction with delay
const chatInput = document.querySelector(".chat-input");
const chatMessages = document.querySelector(".chat-messages");

// Create the chatbot title
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
            elizaMsgElem.innerText = `Eliza: ${response}`;
            chatMessages.appendChild(elizaMsgElem);
        }, 1000); // 1-second delay

        e.target.value = '';
    }
});

function getElizaResponse(question) {
    question = question.toLowerCase();

    const responses = [
        { pattern: /hello|hi|hey/, response: "Hello! How can I assist you today?" },
        { pattern: /how does this app work/, response: "This app allows you to create, edit, and manage sticky notes." },
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

        // Default response
        { pattern: /.*/, response: "I'm not sure about that. Can you be more specific or ask another question?" }
    ];

    for (let i = 0; i < responses.length; i++) {
        let match = question.match(responses[i].pattern);
        if (match) {
            if (match[1] && match[2]) {
                // Handle creation of a new note if the pattern matches
                addNewNote(match[2]); // Add the note with the captured content
                return responses[i].response.replace('{title}', match[1]).replace('{content}', match[2]);
            }
            return responses[i].response;
        }
    }
    return "Sorry, I didn't get that. Could you please rephrase or ask another question?";
}

// Creating the chatbot's maximize/minimize button
const toggleButton = document.createElement("button");
toggleButton.innerText = "-";
toggleButton.className = "toggle-chat";
toggleButton.title="Minimize/Maximize Chatbot";
toggleButton.onclick = function() {
    const chatMessagesElem = document.querySelector(".chat-messages");
    const chatInputElem = document.querySelector(".chat-input");

    if (chatMessagesElem.style.display === "none") {
        chatMessagesElem.style.display = "";
        chatInputElem.style.display = "";
        toggleButton.innerText = "-";
    } else {
        chatMessagesElem.style.display = "none";
        chatInputElem.style.display = "none";
        toggleButton.innerText = "+";
    }
};

const chatHeaderElem = document.querySelector(".chat-header");
chatHeaderElem.appendChild(toggleButton);

// Initially showing only header
const chatMessagesElem = document.querySelector(".chat-messages");
const chatInputElem = document.querySelector(".chat-input");
chatMessagesElem.style.display = "none";
chatInputElem.style.display = "none";

// Function to enable or disable typing in the calculator screen
function toggleTyping(enable) {
    let screen = document.getElementById('calcScreen');
    screen.disabled = !enable; // Enable or disable based on the parameter
    if (enable) {
        screen.focus(); // Focus on the screen if typing is enabled
    }
}

// Call this function with 'true' to enable typing when the screen is clicked
document.getElementById('calcScreen').addEventListener('click', function() {
    toggleTyping(true);
});

// Call this function with 'false' to disable typing when focus is lost
document.getElementById('calcScreen').addEventListener('blur', function() {
    toggleTyping(false);
});

// Function to enable typing in the calculator screen
function enableScreen() {
    const screen = document.getElementById('calcScreen');
    screen.disabled = false; // Make sure the screen is enabled
    screen.focus(); // Focus on the screen for immediate typing
}

// Function to clear the calculator screen
function clearScreen() {
    document.getElementById('calcScreen').value = '';
}

// Function to append the pressed number or operator to the calculator screen
function press(num) {
    const screen = document.getElementById('calcScreen');
    if (num === '%') {
        screen.value = (eval(screen.value) / 100).toString();
    } else {
        screen.value += num;
    }
}

// Function to calculate the result
function calculate() {
    try {
        const expression = document.getElementById('calcScreen').value;
        const result = expression.includes('**') ? eval(expression) : eval(expression.replace('^', '**'));
        document.getElementById('calcScreen').value = result;
    } catch (e) {
        document.getElementById('calcScreen').value = 'Error';
    }
}

// Event listener for the Enter key to calculate the result
document.getElementById('calcScreen').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault(); // Prevent the default action of the Enter key
        calculate();
    }
});

// Event listener to enable the screen when it is clicked
document.getElementById('calcScreen').addEventListener('click', enableScreen);

// Event listener to filter out invalid characters
document.getElementById('calcScreen').addEventListener('input', function(event) {
    const allowedCharacters = /[0-9+\-*/.]/;
    let value = event.target.value;
    let newValue = value.split('').filter(char => allowedCharacters.test(char)).join('');
    event.target.value = newValue;
});

// Function to toggle calculator visibility
function toggleCalculator() {
    const calcBody = document.querySelector('.calc-body');
    const toggleCalcButton = document.getElementById('toggleCalc');

    if (calcBody.style.display === 'none') {
        calcBody.style.display = 'block';
        toggleCalcButton.innerText = '-';
        enableScreen(); // Enable the screen after showing the calculator
    }
    else {
        calcBody.style.display = 'none';
        toggleCalcButton.innerText = '+';
    }
}

// Event listener for the toggle calculator button
document.getElementById('toggleCalc').addEventListener('click', toggleCalculator);

// Initial call to enable screen when the page loads
enableScreen();

// Always enable the screen when the calculator is clicked
document.getElementById('calculator').addEventListener('click', enableScreen);

// Operation function for square root and power
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