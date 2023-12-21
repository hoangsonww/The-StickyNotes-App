import datetime
import random

# --- Model for a Note ---

class Note:
    def __init__(self, title, content):
        self.id = self.generate_unique_id()
        self.title = title
        self.content = content
        self.created_at = self.current_time()
        self.updated_at = self.created_at

    @staticmethod
    def current_time():
        """Returns the current time."""
        return datetime.datetime.now()

    @staticmethod
    def generate_unique_id():
        """Generates a unique identifier for a note."""
        return random.randint(1000, 9999)

    def update(self, new_content):
        """Updates the content of the note."""
        self.content = new_content
        self.updated_at = self.current_time()

    def to_dict(self):
        """Converts the note object to a dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def __repr__(self):
        """Returns a string representation of the note."""
        return f'<Note {self.id}>'

    def __str__(self):
        """Returns a string representation of the note."""
        return f'Note {self.id}: {self.title}'

    def __eq__(self, other):
        """Checks if two notes are equal."""
        if isinstance(other, Note):
            return self.id == other.id
        return False

    def __ne__(self, other):
        """Checks if two notes are not equal."""
        return not self.__eq__(other)

    def __hash__(self):
        """Returns a hash value for the note."""
        return hash(self.id)

    def __lt__(self, other):
        """Checks if a note is less than another note."""
        if isinstance(other, Note):
            return self.id < other.id
        return False

    def __gt__(self, other):
        """Checks if a note is greater than another note."""
        if isinstance(other, Note):
            return self.id > other.id
        return False

    def __le__(self, other):
        """Checks if a note is less than or equal to another note."""
        if isinstance(other, Note):
            return self.id <= other.id
        return False

    def __ge__(self, other):
        """Checks if a note is greater than or equal to another note."""
        if isinstance(other, Note):
            return self.id >= other.id
        return False

    def __len__(self):
        """Returns the length of the note."""
        return len(self.content)

    def __contains__(self, item):
        """Checks if a note contains a specific item."""
        return item in self.content

# --- Backend Logic ---

class StickyNotesApp:
    def __init__(self):
        self.notes = []

    def create_note(self, title, content):
        """Creates a new note and adds it to the notes list."""
        new_note = Note(title, content)
        self.notes.append(new_note)
        return new_note

    def get_all_notes(self):
        """Returns all notes."""
        return [note.to_dict() for note in self.notes]

    def get_note_by_id(self, note_id):
        """Retrieves a single note by its ID."""
        for note in self.notes:
            if note.id == note_id:
                return note.to_dict()
        return None

    def update_note(self, note_id, new_content):
        """Updates the content of an existing note."""
        for note in self.notes:
            if note.id == note_id:
                note.update(new_content)
                return note.to_dict()
        return None

    def delete_note(self, note_id):
        """Deletes a note."""
        self.notes = [note for note in self.notes if note.id != note_id]

    def delete_all_notes(self):
        """Deletes all notes."""
        self.notes = []

    def get_all_notes(self):
        """Returns all notes."""
        return [note.to_dict() for note in self.notes]

    def __repr__(self):
        """Returns a string representation of the app."""
        return f'<StickyNotesApp {self.notes}>'

# --- Main Execution (for testing) ---

if __name__ == '__main__':
    app = StickyNotesApp()

    # Creating a new note
    new_note = app.create_note('To Do', 'Finish Python script')
    print(new_note.to_dict())

    # Updating a note
    updated_note = app.update_note(new_note.id, 'New content for the note')
    if updated_note:
        print(updated_note)

    # Fetching all notes
    notes = app.get_all_notes()
    print('All notes:', notes)

    # Fetching a specific note
    specific_note = app.get_note_by_id(new_note.id)
    if specific_note:
        print('Specific note:', specific_note)
    else:
        print('Note not found.')

    # Deleting a note
    app.delete_note(new_note.id)
    print('All notes after deletion:', app.get_all_notes())

    # Deleting all notes
    app.delete_all_notes()

    # Fetching all notes
    notes = app.get_all_notes()

    # Printing all notes
    print('All notes:', notes)

# --- End of app.py ---