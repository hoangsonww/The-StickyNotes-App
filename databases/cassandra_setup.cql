-- Creating a keyspace
CREATE KEYSPACE IF NOT EXISTS StickyNotes WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

-- Creating table for notes
USE StickyNotes;

CREATE TABLE IF NOT EXISTS notes (
                                     note_id UUID PRIMARY KEY,
                                     user_id UUID,
                                     title TEXT,
                                     content TEXT,
                                     color TEXT,
                                     due_date TIMESTAMP,
                                     is_pinned BOOLEAN,
                                     created_at TIMESTAMP,
                                     updated_at TIMESTAMP
);

-- Creating table for users
CREATE TABLE IF NOT EXISTS users (
                                     user_id UUID PRIMARY KEY,
                                     username TEXT,
                                     password TEXT,
                                     email TEXT,
                                     created_at TIMESTAMP,
                                     updated_at TIMESTAMP
);

-- Creating table for user notes
CREATE TABLE IF NOT EXISTS user_notes (
                                     user_id UUID,
                                     note_id UUID,
                                     PRIMARY KEY (user_id, note_id)
);

-- Creating table for user labels
CREATE TABLE IF NOT EXISTS user_labels (
                                     user_id UUID,
                                     label_id UUID,
                                     PRIMARY KEY (user_id, label_id)
);

-- Creating table for labels
CREATE TABLE IF NOT EXISTS labels (
                                     label_id UUID PRIMARY KEY,
                                     name TEXT,
                                     color TEXT,
                                     created_at TIMESTAMP,
                                     updated_at TIMESTAMP
);

-- Creating table for note labels
CREATE TABLE IF NOT EXISTS note_labels (
                                     note_id UUID,
                                     label_id UUID,
                                     PRIMARY KEY (note_id, label_id)
);

-- Creating table for note images
CREATE TABLE IF NOT EXISTS note_images (
                                     note_id UUID,
                                     image_id UUID,
                                     PRIMARY KEY (note_id, image_id)
);
