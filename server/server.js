const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'songs' directory
app.use('/songs', express.static(path.join(__dirname, '../songs')));

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, '../images')));

// Songs database - single source of truth
const songsDatabase = [
  {
    id: 1,
    title: "Let Me Love You",
    artist: "DJ Snake ft. Justin Bieber",
    duration: 206,
    filePath: "/songs/letMeLoveYou.mp3",
    coverPath: "/images/song1.jpg"
  },
  {
    id: 2,
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    duration: 281,
    filePath: "/songs/despacito.mp3",
    coverPath: "/images/despacito.png"
  },
  {
    id: 3,
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    duration: 238,
    filePath: "/songs/seeYouAgain.mp3",
    coverPath: "/images/seeyouagain.jpg"
  },
  {
    id: 4,
    title: "Uptown Funk",
    artist: "Mark Ronson",
    duration: 270,
    filePath: "/songs/upTown.mp3",
    coverPath: "/images/uptown.jpg"
  },
  {
    id: 5,
    title: "GANGNAM STYLE(강남스타일)",
    artist: "PSY",
    duration: 253,
    filePath: "/songs/gangnam.mp3",
    coverPath: "/images/gangam.jpg"
  },
  {
    id: 6,
    title: "Sugar",
    artist: "Maroon 5",
    duration: 301,
    filePath: "/songs/sugar.mp3",
    coverPath: "/images/sugar.jpg"
  },
  {
    id: 7,
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: 263,
    filePath: "/songs/perfect.mp3",
    coverPath: "/images/perfect.jpg"
  },
  {
    id: 8,
    title: "We Don't Talk Anymore",
    artist: "Charlie Puth",
    duration: 230,
    filePath: "/songs/weDon'tTalkAnymore.mp3",
    coverPath: "/images/wedonttalkanymore.jpg"
  },
  {
    id: 9,
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    duration: 274,
    filePath: "/songs/starboy.mp3",
    coverPath: "/images/starboy.jpg"
  },
  {
    id: 10,
    title: "Dil Ko Karaar Aaya",
    artist: "Neha Kakkar",
    duration: 255,
    filePath: "/songs/dilKoKaraarAaya.mp3",
    coverPath: "/images/dilKoKaraarAaya.jpg"
  },
  {
    id: 11,
    title: "Jhoom",
    artist: "Ali Zafar",
    duration: 288,
    filePath: "/songs/jhoom.mp3",
    coverPath: "/images/jhoom.jpg"
  },
  {
    id: 12,
    title: "Play Date",
    artist: "Melanie Martinez",
    duration: 182,
    filePath: "/songs/playDate.mp3",
    coverPath: "/images/playDate.jpg"
  },
  {
    id: 13,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    duration: 174,
    filePath: "/songs/watermelonSugar.mp3",
    coverPath: "/images/watermelonSugar.jpg"
  },
  {
    id: 14,
    title: "Chuttamalle",
    artist: "Sid Sriram",
    duration: 222,
    filePath: "/songs/chuttamalle.mp3",
    coverPath: "/images/chuttamalle.jpg"
  },
  {
    id: 15,
    title: "Zara Zara",
    artist: "Bombay Jayashri",
    duration: 215,
    filePath: "/songs/zaraZaraFemale.mp3",
    coverPath: "/images/zaraZaraFemale.jpg"
  },
  {
    id: 16,
    title: "Zara Zara (Male Version)",
    artist: "Bombay Jayashri",
    duration: 218,
    filePath: "/songs/zaraZaraMale.mp3",
    coverPath: "/images/zaraZaraMale.jpg"
  },
  {
    id: 17,
    title: "Ride It",
    artist: "Jay Sean",
    duration: 195,
    filePath: "/songs/rideIt.mp3",
    coverPath: "/images/rideIt.jpg"
  },
  {
    id: 18,
    title: "Salvatore",
    artist: "Lana Del Rey",
    duration: 282,
    filePath: "/songs/salvatore.mp3",
    coverPath: "/images/salvatore.jpg"
  },
  {
    id: 19,
    title: "Good Looking",
    artist: "Suki Waterhouse",
    duration: 145,
    filePath: "/songs/goodLooking.mp3",
    coverPath: "/images/goodLooking.jpg"
  },
  {
    id: 20,
    title: "Callin U",
    artist: "Outlandish",
    duration: 120,
    filePath: "/songs/callinU.mp3",
    coverPath: "/images/callinU.jpg"
  }
];

// API Routes
app.use('/api/auth', authRoutes);

app.get('/api/songs', (req, res) => {
  res.json(songsDatabase);
});

app.get('/api/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const song = songsDatabase.find(song => song.id === songId);
  
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }
  
  res.json(song);
});

app.get('/api/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  const results = songsDatabase.filter(song => 
    song.title.toLowerCase().includes(query) || 
    song.artist.toLowerCase().includes(query)
  );
  
  res.json(results);
});

// Serve static files from the root directory for other assets
app.use(express.static(path.join(__dirname, '..')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Loaded ${songsDatabase.length} songs`);
}); 