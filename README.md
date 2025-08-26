# Spotify Clone

Spotify Clone is a full-stack web application that replicates the core functionality of Spotify's music streaming service. It features a modern, responsive user interface with authentication, a dynamic song library, and an interactive music player with features like play/pause, skip, volume control, and search functionality..

# Summary

This is a music streaming web application built with Node.js backend and vanilla JavaScript frontend. Users can register/login, browse a curated collection of 20 popular songs, play music with full player controls, search through the library, like songs, and enjoy a responsive design that mimics Spotify's aesthetic. The project demonstrates modern web development practices including API design, authentication, file serving, and dynamic UI generation.


## Project Structure

spotify/
├── server/                 # Backend server
│   ├── server.js          # Main server file with song database
│   ├── routes/
│   │   └── auth.js        # Authentication endpoints
│   ├── models/
│   │   └── User.js        # User data model
│   └── package.json       # Server dependencies
├── images/                 # Song cover art (20 images)
├── songs/                  # MP3 audio files (20 songs)
├── index.html             # Main application page
├── login.html             # User login page
├── register.html          # User registration page
├── script.js              # Main application logic
├── style.css              # Application styling
├── auth.js                # Authentication logic
├── auth-styles.css        # Auth page styling
└── package.json           # Project dependencies


## Technologies Used

### Backend:

Node.js - JavaScript runtime environment<br>
Express.js - Web application framework

CORS - Cross-origin resource sharing

File System (fs) - Local file management

### Frontend:

Vanilla JavaScript - No frameworks, pure JS

HTML5 - Semantic markup

CSS3 - Modern styling with animations

Font Awesome - Icon library


### Data Storage:

Local Storage - Client-side data persistence

In-Memory Storage - Server-side user management

File System - Audio and image storage

### Development Tools:

npm - Package management

nodemon - Development server with auto-reload


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

## Features

- User authentication (registration and login)
- Fetches songs from a server API instead of using local files
- Search functionality that queries the server
- Play, pause, skip, and volume control
- Responsive design
- Keyboard shortcuts

## API Endpoints

### Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/users - Get all users (for testing)

### Music Library:
GET /api/songs - Get all songs
GET /api/songs/:id - Get specific song by ID
GET /api/search?q=query - Search songs by title/artist

 
