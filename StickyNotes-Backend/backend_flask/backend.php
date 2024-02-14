<?php
// This file contains functions to add and retrieve notes from the database
// Database connection details
$host = 'localhost';
$dbname = 'stickynotes_db';
$user = 'username';
$pass = 'password';

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);

    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}

// Function to add a new note
function addNote($text, $color, $tag, $dueDate, $voiceNote) {
    global $pdo;
    $sql = "INSERT INTO notes (text, color, tag, dueDate, voiceNote) VALUES (:text, :color, :tag, :dueDate, :voiceNote)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':text', $text);
        $stmt->bindParam(':color', $color);
        $stmt->bindParam(':tag', $tag);
        $stmt->bindParam(':dueDate', $dueDate);
        $stmt->bindParam(':voiceNote', $voiceNote);
        $stmt->execute();
    } catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to retrieve all notes
function getAllNotes() {
    global $pdo;
    $sql = "SELECT * FROM notes";

    try {
        $result = $pdo->query($sql);
        if($result->rowCount() > 0) {
            while($row = $result->fetch()) {
                echo "Note: " . $row['text'] . "\nColor: " . $row['color'] . "\nTag: " . $row['tag'] . "\nDue Date: " . $row['dueDate'] . "\nVoice Note: " . $row['voiceNote'] . "\n\n";
            }
            unset($result);
        } else {
            echo "No notes were found.";
        }
    } catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to retrieve notes by tag
function getNotesByTag($tag) {
    global $pdo;
    $sql = "SELECT * FROM notes WHERE tag = :tag";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':tag', $tag);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            while($row = $stmt->fetch()) {
                echo "Note: " . $row['text'] . "\nColor: " . $row['color'] . "\nTag: " . $row['tag'] . "\nDue Date: " . $row['dueDate'] . "\nVoice Note: " . $row['voiceNote'] . "\n\n";
            }
            unset($stmt);
        }
        else {
            echo "No notes were found.";
        }
    }
    catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to retrieve notes by due date
function getNotesByDueDate($dueDate) {
    global $pdo;
    $sql = "SELECT * FROM notes WHERE dueDate = :dueDate";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':dueDate', $dueDate);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            while($row = $stmt->fetch()) {
                echo "Note: " . $row['text'] . "\nColor: " . $row['color'] . "\nTag: " . $row['tag'] . "\nDue Date: " . $row['dueDate'] . "\nVoice Note: " . $row['voiceNote'] . "\n\n";
            }
            unset($stmt);
        }
        else {
            echo "No notes were found.";
        }
    }
    catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to retrieve notes by color
function getNotesByColor($color) {
    global $pdo;
    $sql = "SELECT * FROM notes WHERE color = :color";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':color', $color);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            while($row = $stmt->fetch()) {
                echo "Note: " . $row['text'] . "\nColor: " . $row['color'] . "\nTag: " . $row['tag'] . "\nDue Date: " . $row['dueDate'] . "\nVoice Note: " . $row['voiceNote'] . "\n\n";
            }
            unset($stmt);
        }
        else {
            echo "No notes were found.";
        }
    }
    catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to retrieve notes by voice note
function getNotesByVoiceNote() {
    global $pdo;
    $sql = "SELECT * FROM notes WHERE voiceNote = 1";

    try {
        $result = $pdo->query($sql);
        if($result->rowCount() > 0) {
            while($row = $result->fetch()) {
                echo "Note: " . $row['text'] . "\nColor: " . $row['color'] . "\nTag: " . $row['tag'] . "\nDue Date: " . $row['dueDate'] . "\nVoice Note: " . $row['voiceNote'] . "\n\n";
            }
            unset($result);
        } else {
            echo "No notes were found.";
        }
    } catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to retrieve notes by text
function getNotesByText($text) {
    global $pdo;
    $sql = "SELECT * FROM notes WHERE text LIKE :text";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':text', '%' . $text . '%');
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            while($row = $stmt->fetch()) {
                echo "Note: " . $row['text'] . "\nColor: " . $row['color'] . "\nTag: " . $row['tag'] . "\nDue Date: " . $row['dueDate'] . "\nVoice Note: " . $row['voiceNote'] . "\n\n";
            }
            unset($stmt);
        }
        else {
            echo "No notes were found.";
        }
    } catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to delete a note
function deleteNoteById($id) {
    global $pdo;
    $sql = "DELETE FROM notes WHERE id = :id";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        unset($stmt);
    } catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to delete all notes
function deleteAllNotes() {
    global $pdo;
    $sql = "DELETE FROM notes";

    try {
        $pdo->exec($sql);
    }
    catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Function to update a note
function updateNoteById($id, $text, $color, $tag, $dueDate, $voiceNote) {
    global $pdo;
    $sql = "UPDATE notes SET text = :text, color = :color, tag = :tag, dueDate = :dueDate, voiceNote = :voiceNote WHERE id = :id";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':text', $text);
        $stmt->bindParam(':color', $color);
        $stmt->bindParam(':tag', $tag);
        $stmt->bindParam(':dueDate', $dueDate);
        $stmt->bindParam(':voiceNote', $voiceNote);
        $stmt->execute();
        unset($stmt);
    }
    catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
}

// Close connection
unset($pdo);
?>
