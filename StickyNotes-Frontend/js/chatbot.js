import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

function showLoadingMessage() {
    const loadingMsgElem = document.createElement("div");
    loadingMsgElem.innerText = "Loading...";
    chatMessages.appendChild(loadingMsgElem);
}

function hideLoadingMessage() {
    const loadingMsgElem = document.querySelector(".chat-messages div:last-child");
    if (loadingMsgElem) loadingMsgElem.remove();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
        const question = e.target.value.trim();
        const userMsgElem = document.createElement("div");
        userMsgElem.innerText = `You: ${question}`;
        chatMessages.appendChild(userMsgElem);
        showLoadingMessage();

        setTimeout(async () => {
            const response = await getElizaResponse(question);
            hideLoadingMessage();
            const elizaMsgElem = document.createElement("div");
            elizaMsgElem.innerText = `Assistant: ${response}`;
            chatMessages.appendChild(elizaMsgElem);
        }, 1000);
        e.target.value = '';
    }
});

async function getElizaResponse(question) {
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
        {pattern: /hello|hi|hey/, response: "Hello! How can I assist you today?"}
    ];

    for (let i = 0; i < responses.length; i++) {
        let match = question.match(responses[i].pattern);
        if (match) {
            if (responses[i].action) responses[i].action(...match.slice(1));
            return responses[i].response.replace('{title}', match[1]).replace('{content}', match[2]).replace('{query}', match[1]).replace('{mode}', match[1]);
        }
    }

    const conversationHistory = [];
    let fullResponse = "Loading...";

    try {
        const genAI = new GoogleGenerativeAI(getAIResponse());
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are a StickyNotes Assistant. Help users manage their notes efficiently. Provide helpful responses to user queries and instructions, and any other general queries. Be friendly and professional.",
        });

        conversationHistory.push({role: "user", parts: [{text: question}]});

        const chatSession = model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain"
            },
            safetySettings: [
                {category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE},
                {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE},
                {category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE},
                {category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE}
            ],
            history: conversationHistory
        });

        const result = await chatSession.sendMessage(question);
        fullResponse = result.response.text();
        conversationHistory.push({role: "model", parts: [{text: fullResponse}]});
    }
    catch (error) {
        console.error('Error fetching response:', error.message);
        fullResponse = "An error occurred while generating the response, possibly due to high traffic or safety concerns. Please understand that I am trained by MovieVerse to provide safe and helpful responses within my limitations. I apologize for any inconvenience caused. Please try again with a different query or contact MovieVerse support for further assistance.";
    }

    return removeMarkdown(fullResponse);
}

const toggleButton = document.createElement("button");
toggleButton.innerText = "+";
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
chatMessages.style.color = "black";
const chatInputElem = document.querySelector(".chat-input");
chatMessagesElem.style.display = "none";
chatInputElem.style.display = "none";

function getAIResponse() {
    const response = 'QUl6YVN5Q1RoUWVFdmNUb01ka0NqWlM3UTNxNzZBNUNlNjVyMW9r';
    return atob(response);
}

function removeMarkdown(text) {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

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
