-- Inserting a new user
INSERT INTO Users (username, email, password_hash) VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- Adding a new note
INSERT INTO Notes (user_id, title, content, color) VALUES (1, 'My First Note', 'Content of the first note', '#FF5733');

-- Retrieving all notes for a user
SELECT * FROM Notes WHERE user_id = 1;

-- Updating a note
UPDATE Notes SET content = 'Updated content', color = '#3355FF' WHERE note_id = 1;

-- Deleting a note
DELETE FROM Notes WHERE note_id = 1;

-- Retrieving all notes for a user
SELECT * FROM Notes WHERE user_id = 1;

-- Retrieving all notes for a user, ordered by creation date
SELECT * FROM Notes WHERE user_id = 1 ORDER BY created_at DESC;

-- Retrieving all notes for a user, ordered by creation date, with a limit of 10
SELECT * FROM Notes WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10;

-- Retrieving all notes for a user, ordered by creation date, with a limit of 10, skipping the first 10
SELECT * FROM Notes WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10 OFFSET 10;

-- Retrieving all notes for a user, ordered by creation date, with a limit of 10, skipping the first 10, with a search term
SELECT * FROM Notes WHERE user_id = 1 AND title LIKE '%first%' ORDER BY created_at DESC LIMIT 10 OFFSET 10;

-- Retrieving all notes for a user, ordered by creation date, with a limit of 10, skipping the first 10, with a search term, with a color
SELECT * FROM Notes WHERE user_id = 1 AND title LIKE '%first%' AND color = '#FF5733' ORDER BY created_at DESC LIMIT 10 OFFSET 10;

-- Retrieving all notes for a user, ordered by creation date, with a limit of 10, skipping the first 10, with a search term, with a color, with a pinned status
SELECT * FROM Notes WHERE user_id = 1 AND title LIKE '%first%' AND color = '#FF5733' AND is_pinned = TRUE ORDER BY created_at DESC LIMIT 10 OFFSET 10;

-- Retrieving tasks for a user
SELECT * FROM Tasks WHERE user_id = 1;

-- Retrieving tasks for a user, ordered by creation date
SELECT * FROM Tasks WHERE user_id = 1 ORDER BY created_at DESC;

-- Retrieving tasks for a user, ordered by creation date, with a limit of 10
SELECT * FROM Tasks WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10;

-- Retrieving tasks for a user, ordered by creation date, with a limit of 10, skipping the first 10
SELECT * FROM Tasks WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10 OFFSET 10;

-- Retrieving tasks for a user, ordered by creation date, with a limit of 10, skipping the first 10, with a search term
SELECT * FROM Tasks WHERE user_id = 1 AND title LIKE '%first%' ORDER BY created_at DESC LIMIT 10 OFFSET 10;

-- Retrieving weather data for a user
SELECT * FROM Weather WHERE user_id = 1;

-- Retrieving chatbot messages for a user
SELECT * FROM ChatbotMessages WHERE user_id = 1;

-- Retrieving chatbot messages for a user, ordered by creation date
SELECT * FROM ChatbotMessages WHERE user_id = 1 ORDER BY created_at DESC;

-- Retrieving chatbot messages for a user, ordered by creation date, with a limit of 10
SELECT * FROM ChatbotMessages WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10;

-- Retrieving about data for a user
SELECT * FROM About WHERE user_id = 1;

-- Retrieving about data for a user, ordered by creation date
SELECT * FROM About WHERE user_id = 1 ORDER BY created_at DESC;
