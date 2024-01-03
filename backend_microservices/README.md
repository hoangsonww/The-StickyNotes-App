# StickyNotes App - Backend

## Introduction

Welcome to the backend repository of the StickyNotes App. This project utilizes a microservices architecture, combining the robustness of Django with the agility of Flask to deliver a dynamic, scalable, and efficient backend system. The StickyNotes App is designed to provide a user-friendly platform for taking, organizing, and managing notes, enhancing productivity and creativity.

## Architecture

The backend is structured around microservices, ensuring scalability and modular development. Django is used for handling more complex operations such as user authentication, data storage, and retrieval. Flask microservices are utilized for lightweight tasks, providing a fast and efficient response for real-time interactions.

## Getting Started

### Prerequisites

- Python 3
- Django
- Flask
- Database (PostgreSQL, MySQL, Apache Cassandra)
- Redis (for caching and session management)
- Docker (for containerization)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hoangsonww/The-StickyNotes-App.git
   ```

2. **Set up a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Setup:**
   Configure your database settings in `settings.py` under the Django project.

5. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```

7. **Start the Flask server:**
   Navigate to the Flask service directory and run:
   ```bash
   flask run
   ```

### Environment Variables

Ensure to set up the necessary environment variables such as `SECRET_KEY`, `DATABASE_URL`, and any other sensitive information required by the application.

## Microservices

- **User Service (Django):** Handles user registrations, authentication, and profile management.
- **Notes Service (Flask):** Manages the creation, updating, deletion, and retrieval of notes.
- **Additional Services:** Can include services like search optimization, recommendation engines, etc.

## Dockerization (Optional)

For containerization with Docker, use the provided `Dockerfile` and `docker-compose.yml` to build and run the services in an isolated environment.

## Testing

Run tests using the Django test framework for the Django services and a suitable framework for Flask.

```bash
python manage.py test
```

## Deployment

Guidelines for deployment should include steps for setting up on a cloud provider or a private server, along with the configuration of any required services like load balancers, database servers, etc.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Son Nguyen Hoang - hoangson091104@gmail.com

Project Link: https://github.com/hoangsonww/The-StickyNotes-App

---
