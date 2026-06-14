// ============================================================
//  ADD YOUR SONGS HERE
//  Each song needs: title, artist, src (file path or URL), cover (image)
// ============================================================
const songs = [
    {
        title: "Song One",
        artist: "Artist A",
        src: "songs/song1.mp3",          // put your mp3 file in a "songs" folder
        cover: "covers/cover1.jpg"        // put your cover image in a "covers" folder
    },
    {
        title: "Song Two",
        artist: "Artist B",
        src: "songs/song2.mp3",
        cover: "covers/cover2.jpg"
    },
    {
        title: "Song Three",
        artist: "Artist C",
        src: "songs/song3.mp3",
        cover: "covers/cover3.jpg"
    },
    // To add more songs, copy one block above and change the details:
    // {
    //     title: "My New Song",
    //     artist: "Artist Name",
    //     src: "songs/mynewsong.mp3",
    //     cover: "covers/mynewcover.jpg"
    // },
];
// ============================================================

// ── Player state ──
let currentIndex = 0;
let isPlaying = false;

// ── DOM refs ──
const audio       = document.getElementById("audio");
const coverEl     = document.getElementById("cover");
const titleEl     = document.getElementById("song-title");
const artistEl    = document.getElementById("song-artist");
const playBtn     = document.getElementById("play");
const prevBtn     = document.getElementById("prev");
const nextBtn     = document.getElementById("next");
const progressEl  = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl  = document.getElementById("duration");
const playlistEl  = document.getElementById("playlist");

// ── Load a song by index ──
function loadSong(index) {
    const song = songs[index];
    titleEl.textContent  = song.title;
    artistEl.textContent = song.artist;
    coverEl.src          = song.cover || "https://via.placeholder.com/250";
    audio.src            = song.src;
    progressEl.value     = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent    = "0:00";
    highlightPlaylist(index);
}

// ── Play / pause ──
function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
    coverEl.classList.add("playing");
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
    coverEl.classList.remove("playing");
}

function togglePlay() {
    isPlaying ? pauseSong() : playSong();
}

// ── Prev / Next ──
function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
}

function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
}

// ── Progress bar ──
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressEl.value = pct;
    currentTimeEl.textContent = fmt(audio.currentTime);
    durationEl.textContent    = fmt(audio.duration);
});

progressEl.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progressEl.value / 100) * audio.duration;
});

audio.addEventListener("ended", nextSong);

function fmt(s) {
    s = Math.floor(s);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

// ── Build playlist ──
function buildPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((song, i) => {
        const item = document.createElement("div");
        item.className = "playlist-item" + (i === currentIndex ? " active" : "");
        item.innerHTML = `
            <img src="${song.cover || 'https://via.placeholder.com/38'}" alt="">
            <div class="info">
                <div class="name">${song.title}</div>
                <div class="artist">${song.artist}</div>
            </div>
            <span class="num">${i === currentIndex ? "♫" : i + 1}</span>
        `;
        item.addEventListener("click", () => {
            currentIndex = i;
            loadSong(i);
            playSong();
        });
        playlistEl.appendChild(item);
    });
}

function highlightPlaylist(index) {
    document.querySelectorAll(".playlist-item").forEach((item, i) => {
        item.classList.toggle("active", i === index);
        item.querySelector(".num").textContent = i === index ? "♫" : i + 1;
    });
}

// ── Button listeners ──
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// ── Init ──
loadSong(currentIndex);
buildPlaylist();