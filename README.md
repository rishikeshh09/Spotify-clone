# Spotify Clone with Database and Authentication

This is a Spotify clone that uses a Node.js server with a database to serve songs instead of accessing them directly from local files. It also includes user authentication with registration and login functionality.

## Project Structure

- `index.html`, `style.css`, `script.js`: Frontend client files for the main application
- `login.html`, `register.html`, `auth-styles.css`, `auth.js`: Frontend files for authentication
- `server/`: Backend server files
  - `server.js`: Main server file
  - `models/User.js`: User model for authentication
  - `routes/auth.js`: Authentication routes
  - `package.json`: Server dependencies

## Setup Instructions

### Prerequisites

- Node.js installed on your computer
- npm (Node Package Manager)

### Installing Dependencies

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

### Running the Server

1. Start the server:
   ```
   npm start
   ```
   
   This will start the server on port 3000.

### Accessing the Application

1. Open `login.html` in your browser to register or log in.
2. After logging in, you'll be redirected to the main application.

## Features

- User authentication (registration and login)
- Fetches songs from a server API instead of using local files
- Search functionality that queries the server
- Play, pause, skip, and volume control
- Responsive design
- Keyboard shortcuts

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/auth/users`: Get all users (for testing)

### Songs
- `GET /api/songs`: Get all songs
- `GET /api/songs/:id`: Get a specific song by ID
- `GET /api/search?q=query`: Search for songs by title or artist

## Future Improvements

- Add user authentication with JWT tokens for better security
- Implement playlists that are saved to user accounts
- Add song upload functionality
- Implement a real database like MongoDB
- Add more advanced search filters
- Add password hashing for better security 