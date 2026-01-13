# Blindfold Walk Timer & Scorekeeper App

A mobile-first Progressive Web App (PWA) for managing the "Blindfold Walk" team challenge game.

## Features

### Core Functionality
- **Countdown Timer**: 3-minute countdown timer with visual feedback
- **Timer Controls**: Start, pause, resume, and reset functionality
- **Cone Hit Counters**: Separate counters for two blindfolded players
- **Automatic Penalties**: +5 second penalty per cone hit, automatically calculated
- **Final Score**: Raw time + (total cone hits × 5 seconds)

### Team Management
- Add and manage multiple teams
- Team selection for each game
- Delete teams when no longer needed
- Persistent storage using browser local storage

### Digital Signature
- Canvas-based signature capture for rotation sign-off
- Touch and mouse support
- Save signatures with game results

### Leaderboard
- Automatically sorted by fastest adjusted time
- Display raw time, penalty count, and final adjusted time
- Rank display with medal indicators (gold, silver, bronze)
- Export results to CSV format
- Clear all results option

### UI/UX Features
- **Mobile-First Design**: Optimized for touch devices
- **Large Touch Buttons**: Easy to tap during live gameplay
- **Visual Alerts**: Color-coded timer warnings (yellow at 30s, red at 10s)
- **Audio Alerts**: Beep sound when 3-minute limit is reached
- **Full-Screen Alert**: Red overlay when time expires
- **Responsive Design**: Works on all screen sizes
- **Progressive Web App**: Can be installed on mobile devices for offline use

## Installation

### As a Web App
1. Open the app in a mobile browser
2. Add to Home Screen (iOS Safari) or Install App (Android Chrome)
3. Launch from your home screen like a native app

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. Or serve with a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

## Usage

### Setting Up Teams
1. Navigate to the "Teams" tab
2. Enter team names and click "Add Team"
3. Teams are saved automatically

### Running a Game
1. Go to the "Timer" tab
2. Select a team from the dropdown
3. Click "START" to begin the 3-minute countdown
4. Tap "+5 SEC PENALTY" buttons when players hit cones
5. Click "FINISH & RECORD TIME" when complete
6. Sign the digital signature pad
7. Click "Save Result" to record the score

### Viewing Results
1. Navigate to the "Leaderboard" tab
2. View ranked teams by final time
3. Export results to CSV for sharing
4. Clear results to start a new competition

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup with Canvas API for signatures
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Object-oriented programming with classes
- **Web APIs**:
  - Local Storage for data persistence
  - Web Audio API for sound alerts
  - Service Worker API for offline functionality
  - Canvas API for signature capture

### Browser Compatibility
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- iOS Safari 13+
- Android Chrome 80+

### Data Storage
All data is stored locally in the browser using `localStorage`:
- **Teams**: List of team names
- **Results**: Game results with timestamps and signatures

### File Structure
```
├── index.html          # Main HTML structure
├── style.css           # Styles and responsive design
├── script.js           # Application logic
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
└── README.md           # Documentation
```

## Features in Detail

### Timer System
- Starts at 3:00 minutes
- Counts down to 0:00
- Tracks elapsed time for final scoring
- Color changes based on remaining time
- Automatic alert at time expiration

### Penalty System
- Each cone hit = +5 seconds to final time
- Real-time penalty calculation
- Visual feedback on button press
- Total penalties displayed

### Score Calculation
```
Final Time = Elapsed Time + (Cone Hits × 5 seconds)
```

### Signature Capture
- Touch-enabled drawing canvas
- Supports mouse and touch input
- Clear signature option
- Saved as base64 image data

### Export Format
CSV format with columns:
- Rank
- Team Name
- Raw Time
- Cone Hits
- Penalty Time
- Final Time
- Timestamp

## Future Enhancements
- Multi-language support
- Dark mode theme
- Sound customization
- Photo capture for teams
- Cloud sync across devices
- Detailed statistics and analytics
- Print-friendly score sheets

## License
MIT License - Feel free to use and modify for your events!

## Support
For issues or questions, please open an issue on the repository.

---

**Built for team challenges and competitive fun!** 🏃‍♂️🏃‍♀️
