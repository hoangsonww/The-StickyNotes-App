-- Inserting a new note
INSERT INTO StickyNotes.notes (note_id, user_id, title, content, color, created_at, updated_at)
VALUES (uuid(), uuid(), 'My First Cassandra Note', 'Content of the note', '#FF5733', toTimestamp(now()), toTimestamp(now()));

-- Retrieving a note by id
SELECT * FROM StickyNotes.notes WHERE note_id = uuid_of_the_note;

-- Updating a note
UPDATE StickyNotes.notes SET content = 'Updated Cassandra note content', color = '#3355FF', updated_at = toTimestamp(now()) WHERE note_id = uuid_of_the_note;

-- Deleting a note
DELETE FROM StickyNotes.notes WHERE note_id = uuid_of_the_note;

-- Retrieving all notes of a user
SELECT * FROM StickyNotes.notes WHERE user_id = uuid_of_the_user;

-- Retrieving all notes of a user with a specific color
SELECT * FROM StickyNotes.notes WHERE user_id = uuid_of_the_user AND color = '#FF5733';

-- Retrieving images of a note
SELECT * FROM StickyNotes.images WHERE note_id = uuid_of_the_note;

-- Retrieving all images of a user
SELECT * FROM StickyNotes.images WHERE user_id = uuid_of_the_user;
