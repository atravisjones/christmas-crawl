// Map Data
const stops = [
    {
        name: "Noelle Carpenter",
        address: "7817 E Wilshire Dr",
        coords: [33.4761344, -111.9113435]
    },
    {
        name: "Lindsey Gray",
        address: "7817 E Harvard St",
        coords: [33.4732633, -111.9120828]
    },
    {
        name: "David",
        address: "7712 E Harvard St",
        coords: [33.4736116, -111.9136824]
    },
    {
        name: "Christine / Travis",
        address: "2523 N Miller Rd",
        coords: [33.4755768, -111.9163615]
    },
    {
        name: "Rachel",
        address: "7536 E Virginia Ave",
        coords: [33.4769513, -111.9180545]
    }
];

// Initialize Map
const map = L.map('map').setView([33.475, -111.915], 15);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Custom Icon
const christmasIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Add Markers and Populate List
const listContainer = document.getElementById('stop-list');
const markers = [];

stops.forEach((stop, index) => {
    // Add Marker
    const marker = L.marker(stop.coords, { icon: christmasIcon }).addTo(map);

    const popupContent = `
        <div class="popup-title">${stop.name}</div>
        <div>${stop.address}</div>
    `;

    marker.bindPopup(popupContent);
    markers.push(marker);

    // Add to Sidebar List
    const listItem = document.createElement('li');
    listItem.className = 'stop-item';
    listItem.innerHTML = `
        <span class="stop-name">${index + 1}. ${stop.name}</span>
        <span class="stop-address">${stop.address}</span>
    `;

    listItem.addEventListener('click', () => {
        map.flyTo(stop.coords, 18);
        marker.openPopup();
    });

    listContainer.appendChild(listItem);
});

// Fit bounds to show all markers with tight padding
const group = new L.featureGroup(markers);
map.fitBounds(group.getBounds().pad(0.05));


// Snow Effect
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'; // 2-5 seconds
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';

    document.getElementById('snow-container').appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

setInterval(createSnowflake, 100);

// --- Tier 1 Features ---

// 1. Drunken Sleigh Mode
const drunkenBtn = document.getElementById('drunken-mode-btn');
const mapElement = document.getElementById('map');
let isDrunken = false;

drunkenBtn.addEventListener('click', () => {
    isDrunken = !isDrunken;
    if (isDrunken) {
        mapElement.classList.add('drunken-mode');
        drunkenBtn.textContent = "🥴 Sober Up!";
    } else {
        mapElement.classList.remove('drunken-mode');
        drunkenBtn.textContent = "🥴 Drunken Sleigh";
    }
});

// 2. Spin-the-Snow-Globe Challenge
const challengeBtn = document.getElementById('challenge-btn');
const challengeModal = document.getElementById('challenge-modal');
const spinBtn = document.getElementById('spin-btn');
const wheel = document.getElementById('wheel');
const challengeText = document.getElementById('challenge-text');
const closeModals = document.querySelectorAll('.close-modal');

const challenges = [
    "🎶 Carol-Off: Sing 'Jingle Bells' loudly!",
    "🎅 Santa Says: Do 5 jumping jacks!",
    "🦵 Candy Cane Limbo: How low can you go?",
    "🧠 Grinch Trivia: Name all of Santa's reindeer!",
    "📸 Elfie Selfie: Take a group photo now!",
    "🤫 Silent Night: No talking for 2 minutes!",
    "🥂 Toast Master: Give a holiday toast!",
    "🍪 Cookie Monster: Eat a cookie without using hands!",
    "🎁 Wrap Battle: Wrap a 'gift' (phone) in 30s!",
    "🦌 Reindeer Prance: Skip to the next stop!",
    "❄️ Snowball Fight: Air snowball fight for 1 min!",
    "🎭 Charades: Act out 'Home Alone'!",
    "🧣 Scarf Style: Wear a scarf as a hat!",
    "🎄 Tree Pose: Hold yoga tree pose for 1 min!",
    "🔔 Jingle Shake: Shake like a bowl full of jelly!",
    "🧤 Mitten Text: Send a text wearing mittens/gloves!",
    "🥛 Milk Chug: Drink your drink in one go!"
];

challengeBtn.addEventListener('click', () => {
    challengeModal.classList.remove('hidden');
    challengeText.textContent = "Spin to see your fate!";
});

spinBtn.addEventListener('click', () => {
    wheel.classList.add('spinning');
    challengeText.textContent = "Spinning...";

    setTimeout(() => {
        wheel.classList.remove('spinning');
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        challengeText.textContent = randomChallenge;
    }, 2000);
});

// 3. Drink Tracker
const addDrinkBtn = document.getElementById('add-drink-btn');
const drinkCountDisplay = document.getElementById('drink-count');
const drinkTitleDisplay = document.getElementById('drink-title');
let drinkCount = 0;

const drinkTitles = [
    "Cocoa Cozy", "Tipsy Elf", "Wobbly Reindeer", "Full Santa Mode", "Grinchy", "Kringle Krushed"
];

addDrinkBtn.addEventListener('click', () => {
    drinkCount++;
    drinkCountDisplay.textContent = drinkCount;

    let titleIndex = Math.min(Math.floor(drinkCount / 2), drinkTitles.length - 1);
    drinkTitleDisplay.textContent = drinkTitles[titleIndex];
});

// 4. Countdown Timer & Reset
let departureTime = new Date();
departureTime.setMinutes(departureTime.getMinutes() + 45);

const resetTimerBtn = document.getElementById('reset-timer-btn');
resetTimerBtn.addEventListener('click', () => {
    departureTime = new Date();
    departureTime.setMinutes(departureTime.getMinutes() + 45);
    updateTimer();
    alert("Timer reset to 45 minutes!");
});

function updateTimer() {
    const now = new Date();
    const diff = departureTime - now;

    if (diff <= 0) {
        document.getElementById('countdown-timer').textContent = "DEPARTED!";
        return;
    }

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown-timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

setInterval(updateTimer, 1000);
updateTimer();

// 5. End-of-Night Report
const reportBtn = document.getElementById('report-btn');
const reportModal = document.getElementById('report-modal');
const reportDetails = document.getElementById('report-details');

reportBtn.addEventListener('click', () => {
    reportModal.classList.remove('hidden');

    const funFacts = [
        "Most likely to fall asleep first.",
        "Best holiday spirit!",
        "Ate the most cookies.",
        "Sang the loudest."
    ];
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

    reportDetails.innerHTML = `
        <p><strong>Total Drinks:</strong> ${drinkCount}</p>
        <p><strong>Title:</strong> ${drinkTitleDisplay.textContent}</p>
        <p><strong>Stops Visited:</strong> 5/5</p>
        <p><strong>Fun Fact:</strong> ${randomFact}</p>
        <p style="margin-top:20px; font-size: 1.5em;">🎅 See you next year! 🎄</p>
    `;
});

// Close Modals
closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
        challengeModal.classList.add('hidden');
        reportModal.classList.add('hidden');
    });
});

// Candy Cane Route using OSRM Routing API
async function fetchWalkingRoute(stops) {
    try {
        // Build coordinate string for OSRM API (lng,lat format)
        const coords = stops.map(stop => `${stop.coords[1]},${stop.coords[0]}`).join(';');

        // OSRM API endpoint for walking route
        const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // Extract route coordinates (they come as [lng, lat], need to flip to [lat, lng])
            const routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            return routeCoords;
        } else {
            console.error('OSRM routing failed:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
}

// Fetch and draw the route
fetchWalkingRoute(stops).then(routeCoords => {
    if (routeCoords) {
        // White Background Line
        L.polyline(routeCoords, {
            className: 'candy-cane-route'
        }).addTo(map);

        // Red Dashed Overlay
        L.polyline(routeCoords, {
            className: 'candy-cane-route-dash'
        }).addTo(map);
    } else {
        console.warn('Could not fetch GPS route, falling back to direct lines');
        // Fallback to simple direct lines
        const fallbackCoords = stops.map(stop => stop.coords);
        L.polyline(fallbackCoords, {
            className: 'candy-cane-route'
        }).addTo(map);
        L.polyline(fallbackCoords, {
            className: 'candy-cane-route-dash'
        }).addTo(map);
    }
});
