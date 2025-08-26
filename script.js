console.log("Welcome to Spotify");
// Initialize the variables
let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let songItems = document.querySelectorAll('.songItem');
let songItemPlay = document.querySelectorAll('.songItemPlay');
let masterSongName = document.getElementById('masterSongName');
let forward = document.querySelector('.fa-forward-step');
let backward = document.querySelector('.fa-backward-step');
let volumeControl = document.getElementById('volumeControl');
let currentTimeDisplay = document.querySelector('.currentTime');
let searchInput = document.getElementById('searchInput');
let searchButton = document.getElementById('searchButton');
let searchResults = document.getElementById('searchResults');
let userProfileElement = document.getElementById('user-profile');

// API URL - change this to your server address when deployed
const API_URL = 'http://localhost:3000/api';

// Songs array to store data from API
let songs = [];

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return false;
    }
    
    // Update UI with user info
    updateUserProfile(JSON.parse(user));
    return true;
}

// Update user profile in the UI
function updateUserProfile(user) {
    if (userProfileElement) {
        userProfileElement.innerHTML = `
            <i class="fa-solid fa-user"></i>
            <span>${user.username}</span>
            <button id="logout-button">Logout</button>
        `;
        
        // Add logout event listener
        document.getElementById('logout-button').addEventListener('click', logout);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// This function is no longer needed since we're using server data

// Initialize like buttons with saved state
function initializeLikeButtonsState() {
    console.log('Initializing like buttons state');
    const likeButtons = document.querySelectorAll('.like-button');
    const likedSongs = getLikedSongs();
    
    console.log(`Found ${likeButtons.length} like buttons and ${likedSongs.length} liked songs`);
    
    likeButtons.forEach((button, index) => {
        // First, reset the button to unliked state
        button.classList.remove('liked');
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            icon.style.color = ''; // Reset to default
        }
        
        // Then, if the song is liked, update the button
        if (likedSongs.includes(index)) {
            console.log(`Song ${index} is liked`);
            button.classList.add('liked');
            if (icon) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#1DB954'; // Spotify green
            }
        }
    }); 
}

// Update song list in the UI
function updateSongList() {
    console.log(`Updating song list with ${songs.length} songs`);
    
    // Get the songList container
    const songListContainer = document.querySelector('.songList');
    
    // Store the heading
    const heading = songListContainer.querySelector('h1');
    
    // Clear existing song items
    songListContainer.innerHTML = '';
    
    // Add back the heading
    songListContainer.appendChild(heading);
    
    // Create a new songItemContainer
    const songItemContainer = document.createElement('div');
    songItemContainer.className = 'songItemContainer';
    songListContainer.appendChild(songItemContainer);
    
    // Create and append song items for each song
    songs.forEach((song, index) => {
        // Create wrapper div
        const wrapper = document.createElement('div');
        
        // Create song item
        const songItem = document.createElement('div');
        songItem.className = 'songItem';
        
        // Create song item content
        songItem.innerHTML = `
            <img src="${song.coverPath}" alt="${song.title}">
            <span class="songName">${song.artist ? `${song.artist} - ` : ''}${song.title}</span>
            <span class="songDuration">${formatTime(song.duration)}</span>
            <span class="songListPlay"> <i id="${index}" class="fa-regular songItemPlay fa-circle-play fa-2x" style="color: #ffffff;"></i></span>
            <span class="like-button"><i class="fa-regular fa-heart fa-lg"></i></span>
        `;
        
        // Append song item to wrapper
        wrapper.appendChild(songItem);
        
        // Append wrapper to container
        songItemContainer.appendChild(wrapper);
    });
    
    // Re-select all song items and play buttons after updating the DOM
    songItems = document.querySelectorAll('.songItem');
    songItemPlay = document.querySelectorAll('.songItemPlay');
    
    // Add event listeners to the new song items
    addSongItemEventListeners();
    
    // Add like buttons to all song items
    addLikeButtonsToAllSongs();
    
    // Dispatch a custom event to notify that songs have been updated
    document.dispatchEvent(new CustomEvent('songsUpdated'));
    
    console.log(`Song list updated with ${songs.length} songs`);
}

// Add event listeners to song items
function addSongItemEventListeners() {
    console.log('Adding event listeners to song items');
    
    // Re-select all song items and play buttons to ensure we have the latest
    songItems = document.querySelectorAll('.songItem');
    songItemPlay = document.querySelectorAll('.songItemPlay');
    
    console.log(`Found ${songItems.length} song items and ${songItemPlay.length} play buttons`);
    
    // Add click event listeners to each song item play button
    songItemPlay.forEach((element, i) => {
        // Remove existing event listeners by cloning and replacing
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        newElement.addEventListener('click', function(e) {
            console.log('Play button clicked for song', i);
            e.stopPropagation(); // Prevent triggering the parent click event
            
            if (songIndex === i && !audioElement.paused) {
                // If clicking on currently playing song, pause it
                audioElement.pause();
                this.classList.remove('fa-circle-pause');
                this.classList.add('fa-circle-play');
                masterPlay.classList.remove('fa-circle-pause');
                masterPlay.classList.add('fa-circle-play');
                gif.style.opacity = 0;
            } else {
                // Otherwise, play the clicked song
                makeAllPlays();
                songIndex = i;
                this.classList.remove('fa-circle-play');
                this.classList.add('fa-circle-pause');
                loadSong(songIndex);
            }
        });
    });

    // Make entire song item clickable
    songItems.forEach((item, i) => {
        // Remove existing event listeners by cloning and replacing
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', function(e) {
            console.log('Song item clicked', i);
            // Only trigger if not clicking on the play button or like button
            if (!e.target.closest('.songListPlay') && !e.target.closest('.like-button')) {
                makeAllPlays();
                songIndex = i;
                
                // Re-select play buttons after DOM changes
                const updatedPlayButtons = document.querySelectorAll('.songItemPlay');
                if (updatedPlayButtons[i]) {
                    updatedPlayButtons[i].classList.remove('fa-circle-play');
                    updatedPlayButtons[i].classList.add('fa-circle-pause');
                }
                
                loadSong(songIndex);
            }
        });
    });
    
    // Update global references
    songItems = document.querySelectorAll('.songItem');
    songItemPlay = document.querySelectorAll('.songItemPlay');
    
    console.log('Event listeners added successfully');
}

// Function to format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to update all play buttons to play icon except the current one
const makeAllPlays = () => {
    songItemPlay.forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
}

// Function to highlight the currently playing song
const highlightCurrentSong = (index) => {
    // First reset all song items
    songItems.forEach((item) => {
        item.style.backgroundColor = 'rgba(40, 40, 60, 0.7)';
        item.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        item.style.boxShadow = 'none';
    });
    
    // Then highlight the current song
    if (songItems[index]) {
        songItems[index].style.backgroundColor = 'rgba(29, 185, 84, 0.5)';
        songItems[index].style.borderColor = 'rgba(29, 185, 84, 0.7)';
        songItems[index].style.boxShadow = '0 0 15px rgba(29, 185, 84, 0.4)';
        
        // Scroll to the currently playing song if it's not visible
        songItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Prepare audio element with song data
function prepareAudio(song) {
    audioElement.src = song.filePath;
    masterSongName.textContent = `${song.artist} - ${song.title}`;
}

// Handle play/pause click for the main player
masterPlay.addEventListener('click', () => {
    console.log('Master play button clicked');
    
    if(audioElement.paused || audioElement.currentTime <= 0) {
        console.log('Playing audio');
        audioElement.play()
            .then(() => {
                masterPlay.classList.remove('fa-circle-play');
                masterPlay.classList.add('fa-circle-pause');
                gif.style.opacity = 1;
                
                // Update the song item play button
                const currentPlayButtons = document.querySelectorAll('.songItemPlay');
                if (currentPlayButtons[songIndex]) {
                    currentPlayButtons[songIndex].classList.remove('fa-circle-play');
                    currentPlayButtons[songIndex].classList.add('fa-circle-pause');
                }
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }
    else {
        console.log('Pausing audio');
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        gif.style.opacity = 0;
        
        // Update the song item play button
        const currentPlayButtons = document.querySelectorAll('.songItemPlay');
        if (currentPlayButtons[songIndex]) {
            currentPlayButtons[songIndex].classList.remove('fa-circle-pause');
            currentPlayButtons[songIndex].classList.add('fa-circle-play');
        }
    }
});

// Listen to Events for progress bar and time update
audioElement.addEventListener('timeupdate', () => {
    // Update seek bar
    if (audioElement.duration) {
        const progress = parseInt((audioElement.currentTime/audioElement.duration) * 100);
        myProgressBar.value = progress;
        updateProgressBarStyle(progress);
        
        // Update time display
        currentTimeDisplay.textContent = `${formatTime(audioElement.currentTime)} / ${formatTime(audioElement.duration)}`;
    }
    
    // If song ends, play next song
    if(audioElement.ended) {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songIndex);
    }
});

// Change song position when progress bar is clicked or dragged
myProgressBar.addEventListener('input', () => {
    if (audioElement.duration) {
        audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
    }
});

// added newly to update the progress bar when the song is played
function updateProgressBarStyle(value) {
    myProgressBar.style.background = `linear-gradient(to right, #1DB954 0%, #1DB954 ${value}%, #e9e3e3 ${value}%, #e9e3e3 100%)`;
}


// Volume control
volumeControl.addEventListener('input', () => {
    audioElement.volume = volumeControl.value / 100;
});

// Function to load a song
const loadSong = (index) => {
    if (index < 0 || index >= songs.length) {
        console.error('Invalid song index:', index);
        return;
    }
    
    songIndex = index;
    const song = songs[index];
    
    if (!song) {
        console.error('No song found at index', index);
        return;
    }
    
    console.log('Loading song:', song.title);
    prepareAudio(song);
    audioElement.currentTime = 0;
    
    // Play the song
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Playing song:', song.title);
                masterPlay.classList.remove('fa-circle-play');
                masterPlay.classList.add('fa-circle-pause');
                gif.style.opacity = 1;
                
                // Update all play buttons first
                makeAllPlays();
                
                // Then set the current song's play button to pause
                const allPlayButtons = document.querySelectorAll('.songItemPlay');
                if (allPlayButtons[index]) {
                    allPlayButtons[index].classList.remove('fa-circle-play');
                    allPlayButtons[index].classList.add('fa-circle-pause');
                }
                
                highlightCurrentSong(index);
            })
            .catch(error => {
                console.error('Error playing song:', error);
                // Reset UI if playback fails
                masterPlay.classList.remove('fa-circle-pause');
                masterPlay.classList.add('fa-circle-play');
                gif.style.opacity = 0;
            });
    }
}

// Handle next button click
forward.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
});

// Handle previous button click
backward.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
});

// Search functionality
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Show search results when input is focused if there's a value
searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim() !== '' && searchResults.children.length > 0) {
        searchResults.style.display = 'block';
    }
});

// Search as user types (with debounce)
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (searchInput.value.trim() !== '') {
            performSearch();
        } else {
            searchResults.style.display = 'none';
        }
    }, 300); // 300ms debounce
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        searchResults.style.display = 'none';
    }
});

async function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === '') {
        searchResults.style.display = 'none';
        return;
    }
    
    // Add visual feedback that search is being performed
    searchButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    try {
        // First try to search using the API
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (response.ok) {
            const results = await response.json();
            
            if (results.length > 0) {
                displaySearchResults(results);
                // Reset search button
                searchButton.innerHTML = '<i class="fa-solid fa-search"></i>';
                return;
            }
        }
        
        // If API search fails or returns no results, fall back to local search
        performLocalSearch(searchTerm);
        
    } catch (error) {
        console.error('Error searching songs via API:', error);
        // Fall back to local search if API fails
        performLocalSearch(searchTerm);
    }
}

// Function to search songs locally (without API)
function performLocalSearch(searchTerm) {
    console.log('Performing local search for:', searchTerm);
    
    // Search in the local songs array
    const results = songs.filter(song => {
        const songTitle = song.title ? song.title.toLowerCase() : '';
        const songArtist = song.artist ? song.artist.toLowerCase() : '';
        return songTitle.includes(searchTerm) || songArtist.includes(searchTerm);
    });
    
    // Reset search button
    searchButton.innerHTML = '<i class="fa-solid fa-search"></i>';
    
    // Display results
    displaySearchResults(results);
}

// Function to display search results
function displaySearchResults(results) {
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No songs found matching your search.</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    // Create result items
    results.forEach(song => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-results-item';
        resultItem.innerHTML = `
            <img src="${song.coverPath}" alt="${song.title}">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${formatTime(song.duration)}</div>
        `;
        
        // Add click event to play the song
        resultItem.addEventListener('click', () => {
            // Find the index of the song in the songs array
            const songIndex = songs.findIndex(s => 
                s.title === song.title && s.artist === song.artist
            );
            
            if (songIndex !== -1) {
                // Play the song
                loadSong(songIndex);
                // Scroll to the song in the list
                songItems[songIndex].scrollIntoView({ behavior: 'smooth' });
                // Hide search results
                searchResults.style.display = 'none';
            }
        });
        
        searchResults.appendChild(resultItem);
    });
    
    // Show results
    searchResults.style.display = 'block';
}

// Initialize with default volume
audioElement.volume = volumeControl.value / 100;

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Skip keyboard shortcuts if search input is focused
    if (document.activeElement === searchInput) {
        return;
    }
    
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        if (audioElement.paused) {
            audioElement.play();
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
            gif.style.opacity = 1;
            songItemPlay[songIndex].classList.remove('fa-circle-play');
            songItemPlay[songIndex].classList.add('fa-circle-pause');
        } else {
            audioElement.pause();
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
            gif.style.opacity = 0;
            makeAllPlays();
        }
    } else if (e.code === 'ArrowRight') {
        // Skip forward 5 seconds
        audioElement.currentTime = Math.min(audioElement.currentTime + 5, audioElement.duration);
    } else if (e.code === 'ArrowLeft') {
        // Skip backward 5 seconds
        audioElement.currentTime = Math.max(audioElement.currentTime - 5, 0);
    } else if (e.code === 'ArrowUp') {
        // Increase volume
        volumeControl.value = Math.min(parseInt(volumeControl.value) + 10, 100);
        audioElement.volume = volumeControl.value / 100;
    } else if (e.code === 'ArrowDown') {
        // Decrease volume
        volumeControl.value = Math.max(parseInt(volumeControl.value) - 10, 0);
        audioElement.volume = volumeControl.value / 100;
    }
});

// Get liked songs from localStorage
function getLikedSongs() {
    const likedSongs = localStorage.getItem('likedSongs');
    return likedSongs ? JSON.parse(likedSongs) : [];
}

// Add a song to liked songs in localStorage
function addLikedSong(index) {
    const likedSongs = getLikedSongs();
    if (!likedSongs.includes(index)) {
        likedSongs.push(index);
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }
}

// Remove a song from liked songs in localStorage
function removeLikedSong(index) {
    let likedSongs = getLikedSongs();
    likedSongs = likedSongs.filter(songIndex => songIndex !== index);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
}

// Function to add like buttons to all song items that don't have them
function addLikeButtonsToAllSongs() {
    console.log('Adding like buttons to all song items');
    const songItems = document.querySelectorAll('.songItem');
    
    songItems.forEach((item, index) => {
        // Get the existing like button
        let likeButton = item.querySelector('.like-button');
        
        if (!likeButton) {
            // Create a new like button if it doesn't exist
            likeButton = document.createElement('span');
            likeButton.className = 'like-button';
            likeButton.innerHTML = '<i class="fa-regular fa-heart fa-lg"></i>';
            item.appendChild(likeButton);
            console.log(`Created new like button for song ${index}`);
        } else {
            // Remove existing event listeners by cloning
            const oldButton = likeButton;
            likeButton = oldButton.cloneNode(true);
            oldButton.parentNode.replaceChild(likeButton, oldButton);
            console.log(`Replaced existing like button for song ${index}`);
        }
        
        // Add event listener to the like button
        likeButton.addEventListener('click', function(e) {
            console.log('Like button clicked for song', index);
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Prevent triggering song play
            
            // Toggle liked state
            this.classList.toggle('liked');
            
            const icon = this.querySelector('i');
            if (this.classList.contains('liked')) {
                // Change to solid heart and green color
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#1DB954'; // Spotify green
                // Add to liked songs
                addLikedSong(index);
                console.log(`Song ${index} added to liked songs`);
            } else {
                // Change back to regular heart
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = ''; // Reset to default
                // Remove from liked songs
                removeLikedSong(index);
                console.log(`Song ${index} removed from liked songs`);
            }
        });
    });
    
    // Initialize like buttons with saved state
    initializeLikeButtonsState();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    
    // Check if user is logged in
    if (checkAuth()) {
        // Fetch songs from server
        fetchSongsFromServer();
    } else {
        // If not logged in, redirect to login
        window.location.href = 'login.html';
    }
    
    // Set initial volume
    audioElement.volume = volumeControl.value / 100;
    
    console.log('Initialization complete');
});

// Fetch songs from server
async function fetchSongsFromServer() {
    try {
        console.log('Fetching songs from server...');
        const response = await fetch(`${API_URL}/songs`);
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        
        const fetchedSongs = await response.json();
        console.log(`Fetched ${fetchedSongs.length} songs from server`);
        
        // Update the songs array with all fetched songs
        songs = fetchedSongs;
        
        // Update UI with songs
        updateSongList();
        
        // Initialize with first song
        if (songs.length > 0) {
            prepareAudio(songs[0]);
        }
        
        // Add event listeners to song items
        addSongItemEventListeners();
        
        // Add like buttons to all song items
        addLikeButtonsToAllSongs();
        
    } catch (error) {
        console.error('Error fetching songs:', error);
        showError('Failed to load songs. Please refresh the page.');
    }
}

// Function to show an error message
function showError(message) {
    alert(message);
}
