// Blindfold Walk Timer & Scorekeeper App
// Main Application Logic

class BlindFoldWalkApp {
    constructor() {
        // Timer state
        this.timerInterval = null;
        this.timeRemaining = 180; // 3 minutes in seconds
        this.startTime = 180;
        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;

        // Counters
        this.player1Hits = 0;
        this.player2Hits = 0;

        // Player finish times
        this.player1FinishTime = null;
        this.player2FinishTime = null;

        // Current team
        this.currentTeam = null;

        // Data storage
        this.teams = this.loadTeams();
        this.results = this.loadResults();

        // Signature
        this.signatureCanvas = null;
        this.signatureContext = null;
        this.isDrawing = false;
        this.currentResult = null;

        // Audio context for alerts
        this.audioContext = null;

        this.init();
    }

    init() {
        // Initialize views
        this.initNavigation();

        // Initialize timer controls
        this.initTimerControls();

        // Initialize counters
        this.initCounters();

        // Initialize team management
        this.initTeamManagement();

        // Initialize leaderboard
        this.initLeaderboard();

        // Initialize signature canvas
        this.initSignatureCanvas();

        // Load initial data
        this.updateTeamSelect();
        this.renderTeamsList();
        this.renderLeaderboard();
    }

    // Navigation
    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetView = btn.dataset.view;
                this.switchView(targetView);

                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchView(viewName) {
        const views = document.querySelectorAll('.view');
        views.forEach(view => view.classList.remove('active'));

        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }
    }

    // Timer Controls
    initTimerControls() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const finishBtn = document.getElementById('finish-btn');

        startBtn.addEventListener('click', () => this.startTimer());
        pauseBtn.addEventListener('click', () => this.pauseTimer());
        resetBtn.addEventListener('click', () => this.resetTimer());
        finishBtn.addEventListener('click', () => this.finishGame());
    }

    startTimer() {
        const teamSelect = document.getElementById('current-team-select');
        const selectedTeam = teamSelect.value;

        if (!selectedTeam) {
            alert('Please select a team first!');
            return;
        }

        this.currentTeam = selectedTeam;
        this.isRunning = true;
        this.isPaused = false;

        // Update button states
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
        document.getElementById('finish-btn').disabled = false;
        document.getElementById('current-team-select').disabled = true;
        document.getElementById('player1-finish-btn').disabled = false;
        document.getElementById('player2-finish-btn').disabled = false;

        // Update status
        document.getElementById('timer-status').textContent = 'Running...';

        // Start timer interval
        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            clearInterval(this.timerInterval);

            // Update button states
            document.getElementById('start-btn').disabled = false;
            document.getElementById('start-btn').textContent = 'RESUME';
            document.getElementById('pause-btn').disabled = true;

            // Update status
            document.getElementById('timer-status').textContent = 'Paused';
        }
    }

    resetTimer() {
        // Confirm reset if game in progress
        if (this.isRunning || this.isPaused) {
            if (!confirm('Are you sure you want to reset? Current progress will be lost.')) {
                return;
            }
        }

        // Clear interval
        clearInterval(this.timerInterval);

        // Reset timer state
        this.timeRemaining = this.startTime;
        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;
        this.player1Hits = 0;
        this.player2Hits = 0;
        this.player1FinishTime = null;
        this.player2FinishTime = null;
        this.currentTeam = null;

        // Update button states
        document.getElementById('start-btn').disabled = false;
        document.getElementById('start-btn').textContent = 'START';
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('finish-btn').disabled = true;
        document.getElementById('current-team-select').disabled = false;
        document.getElementById('player1-finish-btn').disabled = true;
        document.getElementById('player2-finish-btn').disabled = true;

        // Update displays
        this.updateTimerDisplay();
        this.updateCounters();
        document.getElementById('timer-status').textContent = 'Ready to Start';
        document.getElementById('player1-finish-time').textContent = '';
        document.getElementById('player2-finish-time').textContent = '';

        // Hide alert overlay
        document.getElementById('alert-overlay').classList.add('hidden');
    }

    tick() {
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
            this.elapsedTime++;
        } else {
            // Time's up!
            this.handleTimeUp();
        }

        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        display.textContent = formatted;

        // Color coding
        display.classList.remove('warning', 'danger');
        if (this.timeRemaining <= 10) {
            display.classList.add('danger');
        } else if (this.timeRemaining <= 30) {
            display.classList.add('warning');
        }
    }

    handleTimeUp() {
        clearInterval(this.timerInterval);
        this.isRunning = false;

        // Show alert overlay
        const alertOverlay = document.getElementById('alert-overlay');
        alertOverlay.classList.remove('hidden');

        // Play alert sound
        this.playAlertSound();

        // Auto-hide alert after 3 seconds
        setTimeout(() => {
            alertOverlay.classList.add('hidden');
        }, 3000);

        // Update status
        document.getElementById('timer-status').textContent = 'Time Limit Reached!';
    }

    playAlertSound() {
        try {
            // Create audio context if not exists
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Create oscillator for beep sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = 800; // Hz
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);

            // Play 3 beeps
            setTimeout(() => {
                const osc2 = this.audioContext.createOscillator();
                const gain2 = this.audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(this.audioContext.destination);
                osc2.frequency.value = 800;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                osc2.start();
                osc2.stop(this.audioContext.currentTime + 0.5);
            }, 600);

            setTimeout(() => {
                const osc3 = this.audioContext.createOscillator();
                const gain3 = this.audioContext.createGain();
                osc3.connect(gain3);
                gain3.connect(this.audioContext.destination);
                osc3.frequency.value = 800;
                osc3.type = 'sine';
                gain3.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gain3.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                osc3.start();
                osc3.stop(this.audioContext.currentTime + 0.5);
            }, 1200);
        } catch (error) {
            console.error('Error playing alert sound:', error);
        }
    }

    // Counters
    initCounters() {
        const player1PenaltyBtn = document.getElementById('player1-penalty-btn');
        const player2PenaltyBtn = document.getElementById('player2-penalty-btn');
        const player1FinishBtn = document.getElementById('player1-finish-btn');
        const player2FinishBtn = document.getElementById('player2-finish-btn');

        player1PenaltyBtn.addEventListener('click', () => this.addPenalty(1));
        player2PenaltyBtn.addEventListener('click', () => this.addPenalty(2));
        player1FinishBtn.addEventListener('click', () => this.playerFinished(1));
        player2FinishBtn.addEventListener('click', () => this.playerFinished(2));
    }

    playerFinished(player) {
        if (!this.isRunning && !this.isPaused) {
            alert('Please start the timer first!');
            return;
        }

        const finishTime = this.elapsedTime;
        const formattedTime = this.formatTime(finishTime);

        if (player === 1) {
            if (this.player1FinishTime !== null) {
                if (!confirm('Player 1 finish time already recorded. Overwrite?')) {
                    return;
                }
            }
            this.player1FinishTime = finishTime;
            document.getElementById('player1-finish-time').textContent = `Finished: ${formattedTime}`;
            document.getElementById('player1-finish-btn').disabled = true;
        } else {
            if (this.player2FinishTime !== null) {
                if (!confirm('Player 2 finish time already recorded. Overwrite?')) {
                    return;
                }
            }
            this.player2FinishTime = finishTime;
            document.getElementById('player2-finish-time').textContent = `Finished: ${formattedTime}`;
            document.getElementById('player2-finish-btn').disabled = true;
        }

        // Visual feedback
        const btn = document.getElementById(`player${player}-finish-btn`);
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    }

    addPenalty(player) {
        if (!this.isRunning && !this.isPaused) {
            alert('Please start the timer first!');
            return;
        }

        if (player === 1) {
            this.player1Hits++;
        } else {
            this.player2Hits++;
        }

        this.updateCounters();

        // Visual feedback
        const btn = document.getElementById(`player${player}-btn`);
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    }

    updateCounters() {
        document.getElementById('player1-counter').textContent = this.player1Hits;
        document.getElementById('player2-counter').textContent = this.player2Hits;

        const totalCones = this.player1Hits + this.player2Hits;
        const totalPenalty = totalCones * 5;

        document.getElementById('total-cones').textContent = totalCones;
        document.getElementById('total-penalty').textContent = `${totalPenalty} sec`;
    }

    // Finish Game
    finishGame() {
        if (!this.currentTeam) {
            alert('No team selected!');
            return;
        }

        // Stop timer
        clearInterval(this.timerInterval);
        this.isRunning = false;

        // Calculate results
        const rawTime = this.elapsedTime;
        const totalConeHits = this.player1Hits + this.player2Hits;
        const penaltyTime = totalConeHits * 5;
        const finalTime = rawTime + penaltyTime;

        // Store current result
        this.currentResult = {
            team: this.currentTeam,
            rawTime: rawTime,
            coneHits: totalConeHits,
            penaltyTime: penaltyTime,
            finalTime: finalTime,
            timestamp: new Date().toISOString()
        };

        // Show signature modal
        this.showSignatureModal();
    }

    // Signature Modal
    initSignatureCanvas() {
        this.signatureCanvas = document.getElementById('signature-canvas');
        this.signatureContext = this.signatureCanvas.getContext('2d');

        // Set canvas size
        const resizeCanvas = () => {
            const rect = this.signatureCanvas.getBoundingClientRect();
            this.signatureCanvas.width = rect.width * window.devicePixelRatio;
            this.signatureCanvas.height = rect.height * window.devicePixelRatio;
            this.signatureContext.scale(window.devicePixelRatio, window.devicePixelRatio);
            this.signatureContext.lineWidth = 2;
            this.signatureContext.lineCap = 'round';
            this.signatureContext.strokeStyle = '#2c3e50';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Drawing events
        const startDrawing = (e) => {
            this.isDrawing = true;
            const pos = this.getPosition(e);
            this.signatureContext.beginPath();
            this.signatureContext.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if (!this.isDrawing) return;
            e.preventDefault();
            const pos = this.getPosition(e);
            this.signatureContext.lineTo(pos.x, pos.y);
            this.signatureContext.stroke();
        };

        const stopDrawing = () => {
            this.isDrawing = false;
        };

        // Mouse events
        this.signatureCanvas.addEventListener('mousedown', startDrawing);
        this.signatureCanvas.addEventListener('mousemove', draw);
        this.signatureCanvas.addEventListener('mouseup', stopDrawing);
        this.signatureCanvas.addEventListener('mouseleave', stopDrawing);

        // Touch events
        this.signatureCanvas.addEventListener('touchstart', startDrawing);
        this.signatureCanvas.addEventListener('touchmove', draw);
        this.signatureCanvas.addEventListener('touchend', stopDrawing);

        // Modal controls
        document.getElementById('clear-signature-btn').addEventListener('click', () => {
            this.clearSignature();
        });

        document.getElementById('close-signature-modal').addEventListener('click', () => {
            this.closeSignatureModal();
        });

        document.getElementById('cancel-signature-btn').addEventListener('click', () => {
            this.closeSignatureModal();
        });

        document.getElementById('save-signature-btn').addEventListener('click', () => {
            this.saveResult();
        });
    }

    getPosition(e) {
        const rect = this.signatureCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        return { x, y };
    }

    showSignatureModal() {
        const modal = document.getElementById('signature-modal');

        // Update result summary
        document.getElementById('signature-team-name').textContent = this.currentResult.team;
        document.getElementById('result-raw-time').textContent = this.formatTime(this.currentResult.rawTime);
        document.getElementById('result-cone-hits').textContent = this.currentResult.coneHits;
        document.getElementById('result-penalty-time').textContent = `${this.currentResult.penaltyTime} sec`;
        document.getElementById('result-final-time').textContent = this.formatTime(this.currentResult.finalTime);

        // Clear signature
        this.clearSignature();

        // Show modal
        modal.classList.add('active');
    }

    closeSignatureModal() {
        const modal = document.getElementById('signature-modal');
        modal.classList.remove('active');

        // Reset timer (user cancelled)
        this.resetTimer();
    }

    clearSignature() {
        const rect = this.signatureCanvas.getBoundingClientRect();
        this.signatureContext.clearRect(0, 0, rect.width, rect.height);
    }

    saveResult() {
        // Get signature data
        const signatureData = this.signatureCanvas.toDataURL();
        this.currentResult.signature = signatureData;

        // Save to results
        this.results.push(this.currentResult);
        this.saveResults();

        // Close modal
        document.getElementById('signature-modal').classList.remove('active');

        // Reset timer
        this.resetTimer();

        // Update leaderboard
        this.renderLeaderboard();

        // Show success message
        alert(`Result saved for ${this.currentResult.team}!\nFinal Time: ${this.formatTime(this.currentResult.finalTime)}`);

        // Switch to leaderboard view
        this.switchView('leaderboard');
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === 'leaderboard') {
                btn.classList.add('active');
            }
        });
    }

    // Team Management
    initTeamManagement() {
        const addTeamBtn = document.getElementById('add-team-btn');
        const teamNameInput = document.getElementById('team-name-input');

        addTeamBtn.addEventListener('click', () => this.addTeam());

        teamNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTeam();
            }
        });
    }

    addTeam() {
        const input = document.getElementById('team-name-input');
        const teamName = input.value.trim();

        if (!teamName) {
            alert('Please enter a team name!');
            return;
        }

        if (this.teams.includes(teamName)) {
            alert('This team name already exists!');
            return;
        }

        this.teams.push(teamName);
        this.saveTeams();

        input.value = '';

        this.renderTeamsList();
        this.updateTeamSelect();

        // Show success feedback
        const btn = document.getElementById('add-team-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Added!';
        btn.style.background = '#2ecc71';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1000);
    }

    deleteTeam(teamName) {
        if (!confirm(`Are you sure you want to delete "${teamName}"?`)) {
            return;
        }

        this.teams = this.teams.filter(t => t !== teamName);
        this.saveTeams();

        this.renderTeamsList();
        this.updateTeamSelect();
    }

    renderTeamsList() {
        const teamsList = document.getElementById('teams-list');

        if (this.teams.length === 0) {
            teamsList.innerHTML = '<p class="empty-message">No teams added yet. Add your first team above!</p>';
            return;
        }

        teamsList.innerHTML = this.teams.map(team => `
            <div class="team-item">
                <span class="team-item-name">${this.escapeHtml(team)}</span>
                <div class="team-item-actions">
                    <button class="btn btn-danger btn-small" onclick="app.deleteTeam('${this.escapeHtml(team)}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateTeamSelect() {
        const select = document.getElementById('current-team-select');
        const currentValue = select.value;

        select.innerHTML = '<option value="">Select a team...</option>' +
            this.teams.map(team =>
                `<option value="${this.escapeHtml(team)}">${this.escapeHtml(team)}</option>`
            ).join('');

        // Restore selection if still exists
        if (this.teams.includes(currentValue)) {
            select.value = currentValue;
        }
    }

    // Leaderboard
    initLeaderboard() {
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportResults();
        });

        document.getElementById('clear-results-btn').addEventListener('click', () => {
            this.clearResults();
        });
    }

    renderLeaderboard() {
        const leaderboardBody = document.getElementById('leaderboard-body');

        if (this.results.length === 0) {
            leaderboardBody.innerHTML = '<p class="empty-message">No results yet. Complete a game to see results here!</p>';
            return;
        }

        // Sort by final time (ascending)
        const sortedResults = [...this.results].sort((a, b) => a.finalTime - b.finalTime);

        leaderboardBody.innerHTML = sortedResults.map((result, index) => `
            <div class="table-row rank-${index + 1}">
                <div class="rank-col">${index + 1}</div>
                <div class="team-col">${this.escapeHtml(result.team)}</div>
                <div class="time-col">${this.formatTime(result.rawTime)}</div>
                <div class="penalty-col">${result.coneHits} (${result.penaltyTime}s)</div>
                <div class="final-col">${this.formatTime(result.finalTime)}</div>
            </div>
        `).join('');
    }

    exportResults() {
        if (this.results.length === 0) {
            alert('No results to export!');
            return;
        }

        // Sort results
        const sortedResults = [...this.results].sort((a, b) => a.finalTime - b.finalTime);

        // Create CSV content
        let csv = 'Rank,Team,Raw Time,Cone Hits,Penalty Time,Final Time,Timestamp\n';

        sortedResults.forEach((result, index) => {
            csv += `${index + 1},`;
            csv += `"${result.team}",`;
            csv += `${this.formatTime(result.rawTime)},`;
            csv += `${result.coneHits},`;
            csv += `${result.penaltyTime}s,`;
            csv += `${this.formatTime(result.finalTime)},`;
            csv += `${new Date(result.timestamp).toLocaleString()}\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blindfold-walk-results-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success message
        alert('Results exported successfully!');
    }

    clearResults() {
        if (!confirm('Are you sure you want to clear all results? This cannot be undone!')) {
            return;
        }

        this.results = [];
        this.saveResults();
        this.renderLeaderboard();
    }

    // Local Storage
    saveTeams() {
        localStorage.setItem('blindfoldWalkTeams', JSON.stringify(this.teams));
    }

    loadTeams() {
        const stored = localStorage.getItem('blindfoldWalkTeams');
        if (stored) {
            return JSON.parse(stored);
        }

        // Initialize with 12 default teams
        const defaultTeams = [];
        for (let i = 1; i <= 12; i++) {
            defaultTeams.push(`Team ${i}`);
        }

        // Save default teams to localStorage
        localStorage.setItem('blindfoldWalkTeams', JSON.stringify(defaultTeams));
        return defaultTeams;
    }

    saveResults() {
        localStorage.setItem('blindfoldWalkResults', JSON.stringify(this.results));
    }

    loadResults() {
        const stored = localStorage.getItem('blindfoldWalkResults');
        return stored ? JSON.parse(stored) : [];
    }

    // Utilities
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BlindFoldWalkApp();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}
