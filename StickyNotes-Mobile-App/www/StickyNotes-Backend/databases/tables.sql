CREATE TABLE Users (
                       user_id INT PRIMARY KEY AUTO_INCREMENT,
                       username VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notes (
                       note_id INT PRIMARY KEY AUTO_INCREMENT,
                       user_id INT,
                       title VARCHAR(255) NOT NULL,
                       content TEXT,
                       color VARCHAR(7),
                       due_date DATE,
                       is_pinned BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Tasks (
                       task_id INT PRIMARY KEY AUTO_INCREMENT,
                       user_id INT,
                       title VARCHAR(255) NOT NULL,
                       content TEXT,
                       due_date DATE,
                       is_completed BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Weather (
                         weather_id INT PRIMARY KEY AUTO_INCREMENT,
                         user_id INT,
                         city VARCHAR(255) NOT NULL,
                         temperature INT,
                         description VARCHAR(255),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE ChatbotMessages (
                                 message_id INT PRIMARY KEY AUTO_INCREMENT,
                                 user_id INT,
                                 message TEXT,
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
