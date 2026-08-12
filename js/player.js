/* ============================================
   PLAYER.JS — Live YouTube Playlist API & Sync Director
   Haryana Roadways · Liquid Glass
   ============================================
   Loads the official YouTube IFrame API to play
   the playlist PLDI-IQJQj21fKB3w8PvA4AqWiyetbg8Mi.
   Fetches and cleans track titles, singers, and
   cover art dynamically from the live YouTube
   playlist feed using CORS metadata APIs.
   ============================================ */

(function () {
  'use strict';

  const playlistId = 'PLDI-IQJQj21fKB3w8PvA4AqWiyetbg8Mi';

  // Seed playlist (used as initial placeholders and local fallbacks)
  const haryanviTracks = [
    { title: 'तू चीज़ लाजवाब', subtitle: 'Tu Cheez Lajwaab • Raju Punjabi', singer: 'Raju Punjabi', year: '2017', id: 'ldlMb2ZT9mg' },
    { title: 'सॉलिड बॉडी', subtitle: 'Solid Body • Sonotek', singer: 'Raju Punjabi', year: '2015', id: 'kYJ_U4yH7Fk' },
    { title: 'लाड पिया के', subtitle: 'Laad Piya Ke • Mor Music', singer: 'Raju Punjabi', year: '2016', id: 'q64Y1Fh0w4M' },
    { title: 'देसी देसी ना बोल्या कर', subtitle: 'Desi Desi Na Bolya Kar • Sonotek', singer: 'Raju Punjabi', year: '2018', id: 'gS6S7G8aV70' },
    { title: 'सैंडल', subtitle: 'Sandal • Voice of Heart', singer: 'Raju Punjabi', year: '2016', id: 'VnJ-M6n33sY' },
    { title: 'गजबन पानी ने चाली', subtitle: 'Gajban Pani Ne Chali • Sapna', singer: 'Vishvjeet Chaudhary', year: '2019', id: 'yY1p_u131uM' },
    { title: 'तेरी आख्या का यो काजल', subtitle: 'Teri Aakhya Ka Yo Kajal • Sapna', singer: 'Raju Punjabi', year: '2018', id: 'A395yV1Vq5M' },
    { title: '५२ गज का दामन', subtitle: '52 Gaj Ka Daman • Renuka Panwar', singer: 'Renuka Panwar', year: '2020', id: 'CZt-rVn2BJs' },
    { title: 'ज़िगाने', subtitle: 'Zigane • Dhanda Nyoliwala', singer: 'Dhanda Nyoliwala', year: '2026', id: 'bUk1YcCPfpQ' }
  ];

  let player = null;
  let isPlaying = false;
  let isMuted = false;
  let volume = 70;
  let updateInterval = null;

  // Get UI elements
  const playBtn = document.getElementById('player-play');
  const playIcon = document.getElementById('custom-play-icon');
  const pauseIcon = document.getElementById('custom-pause-icon');
  const prevBtn = document.getElementById('player-prev');
  const nextBtn = document.getElementById('player-next');
  const muteBtn = document.getElementById('player-mute');
  const volumeIcon = document.getElementById('custom-volume-icon');
  const muteIcon = document.getElementById('custom-mute-icon');
  const volumeSlider = document.getElementById('player-volume');
  const progressSlider = document.getElementById('player-progress');
  const timeEl = document.getElementById('player-time');
  const titleEl = document.getElementById('player-title');
  const artistEl = document.getElementById('player-artist');
  const artEl = document.getElementById('player-art');
  const songsListContainer = document.getElementById('songs-list-container');

  if (!playBtn) return; // Guard for page safety

  // Escape HTML helper to prevent DOM XSS from third-party video metadata feeds
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ── Helper to Clean YouTube Titles ──────── */
  function getCleanTitle(rawTitle) {
    let clean = rawTitle
      .replace(/\[.*?\]/g, "") // Remove bracket contents e.g. [Official Video]
      .replace(/\(.*?\)/g, "") // Remove parentheses e.g. (Audio Video)
      .replace(/official/gi, "")
      .replace(/music video/gi, "")
      .replace(/video/gi, "")
      .replace(/song/gi, "")
      .replace(/haryanvi/gi, "")
      .replace(/latest/gi, "")
      .replace(/new/gi, "")
      .replace(/hd/gi, "")
      .replace(/4k/gi, "")
      .replace(/\|.*/, "") // Remove trailing detail pipes
      .replace(/\s-\s.*/, "") // Remove trailing detail dashes
      .trim();
    return clean || rawTitle;
  }

  function getCleanSinger(rawAuthor) {
    let clean = rawAuthor
      .replace(/official/gi, "")
      .replace(/records/gi, "")
      .replace(/music/gi, "")
      .replace(/sonotek/gi, "")
      .replace(/haryana/gi, "")
      .trim();
    return clean || "Haryanvi Artist";
  }

  // ── Render Songs Directory Row Elements ────── */
  function renderSongsList() {
    if (!songsListContainer) return;
    
    // Update heading count tag dynamically
    const countTag = document.querySelector('[data-section-id="songs"] .type-label');
    if (countTag) {
      countTag.textContent = `${haryanviTracks.length} RECORDS`;
    }

    songsListContainer.innerHTML = haryanviTracks.map((track, index) => {
      const displayIndex = (index + 1).toString().padStart(3, '0');
      const cleanTitle = escapeHTML(getCleanTitle(track.title));
      const cleanSinger = escapeHTML(getCleanSinger(track.singer));

      return `
        <div class="song-row" data-track-index="${index}" data-track-id="${track.id}">
          <div class="song-row__left">
            <span class="song-row__number">${displayIndex}</span>
            <div class="song-meta-block">
              <span class="song-row__title">${cleanTitle}</span>
              <span class="song-row__subtitle">${cleanSinger} • Roadways Radio</span>
            </div>
          </div>
          <div class="song-row__right">
            <span class="song-row__singer">${cleanSinger}</span>
            <span class="song-row__year">${track.year}</span>
          </div>
        </div>
      `;
    }).join('');

    // Re-highlight active song after re-rendering
    if (player && typeof player.getVideoData === 'function') {
      const data = player.getVideoData();
      if (data && data.video_id) {
        updateActiveSongRow(data.video_id);
      }
    }
  }

  // Render placeholders immediately
  renderSongsList();

  // Helper to dynamically style range slider tracks with colored fill
  function updateSliderBg(slider, val) {
    if (slider) {
      slider.style.background = `linear-gradient(to right, var(--green-muted) 0%, var(--green-muted) ${val}%, rgba(255, 255, 255, 0.15) ${val}%, rgba(255, 255, 255, 0.15) 100%)`;
    }
  }

  // Helper to highlight currently active song in the directory
  function updateActiveSongRow(videoId) {
    document.querySelectorAll('.song-row').forEach(row => {
      if (row.getAttribute('data-track-id') === videoId) {
        row.classList.add('song-row--active');
      } else {
        row.classList.remove('song-row--active');
      }
    });
  }

  // ── Fetch metadata from YouTube oEmbed/NoEmbed API ── */
  async function fetchTrackDetails(videoId) {
    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const data = await response.json();
      return {
        title: data.title || "Haryanvi Song",
        singer: data.author_name || "Roadways Radio",
        year: '2022',
        id: videoId
      };
    } catch (e) {
      return {
        title: "Haryanvi Song",
        singer: "Roadways Radio",
        year: '2022',
        id: videoId
      };
    }
  }

  // Fetch details for all video IDs in the loaded playlist
  async function fetchPlaylistMetadata(videoIds) {
    console.log("[Player] Loading dynamic metadata for", videoIds.length, "tracks...");
    
    // Fetch details in parallel
    const promises = videoIds.map(id => fetchTrackDetails(id));
    const results = await Promise.all(promises);
    
    // Clear initial seeds and add new live playlist data
    haryanviTracks.length = 0;
    results.forEach(track => {
      haryanviTracks.push(track);
    });
    
    // Re-render display list with dynamic YouTube data
    renderSongsList();
    console.log("[Player] Dynamic playlist rendering complete.");
  }

  // ── Load YouTube IFrame API Script ───────── */
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Global callback executed when the API has loaded
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('youtube-player', {
      height: '1',
      width: '1',
      playerVars: {
        'listType': 'playlist',
        'list': playlistId,
        'index': 0,
        'suggestedQuality': 'small',
        'playsinline': 1,
        'controls': 0,
        'disablekb': 1,
        'rel': 0,
        'autoplay': 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });
  };

  function onPlayerReady(event) {
    player.setVolume(volume);
    
    if (typeof player.setShuffle === 'function') {
      player.setShuffle(true);
    }
    
    // Read queue list of video IDs loaded by YouTube API
    let videoIds = [];
    if (typeof player.getPlaylist === 'function') {
      videoIds = player.getPlaylist();
    }
    
    // If playlist loaded successfully, fetch dynamic titles
    if (videoIds && videoIds.length > 0) {
      fetchPlaylistMetadata(videoIds);
    }
    
    updateDisplay();
    updateSliderBg(volumeSlider, volume);
    updateSliderBg(progressSlider, 0);
  }

  function onPlayerError(event) {
    // If a track fails (e.g. embedding restricted), auto-advance to keep music streaming
    if (event.data === 101 || event.data === 150 || event.data === 100 || event.data === 2) {
      console.log("[Player] Track restricted (code " + event.data + "). Skipping...");
      setTimeout(() => {
        if (player && typeof player.nextVideo === 'function') {
          player.nextVideo();
        }
      }, 800);
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Extract track information from YouTube feed
  function updateDisplay() {
    if (player && typeof player.getVideoData === 'function') {
      const data = player.getVideoData();
      if (data && data.title) {
        const curated = haryanviTracks.find(t => t.id === data.video_id);
        if (curated) {
          titleEl.textContent = getCleanTitle(curated.title);
          artistEl.textContent = getCleanSinger(curated.singer);
        } else {
          titleEl.textContent = getCleanTitle(data.title);
          artistEl.textContent = getCleanSinger(data.author || "Roadways Radio");
        }
        
        if (data.video_id) {
          artEl.src = `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg`;
          updateActiveSongRow(data.video_id);
        }
      }
    }
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      isPlaying = true;
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      updateDisplay();
      startProgressLoop();
    } else {
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      stopProgressLoop();
      
      // Auto-advance radio when a song finishes
      if (event.data === YT.PlayerState.ENDED) {
        if (player && typeof player.nextVideo === 'function') {
          player.nextVideo();
        }
      }
    }
  }

  function startProgressLoop() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
      if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0) {
          const pct = (currentTime / duration) * 100;
          progressSlider.value = pct;
          updateSliderBg(progressSlider, pct);
          timeEl.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
      }
    }, 250);
  }

  function stopProgressLoop() {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  }

  // Play/Pause Click
  playBtn.addEventListener('click', () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  // Next Track
  nextBtn.addEventListener('click', () => {
    if (player && typeof player.nextVideo === 'function') {
      progressSlider.value = 0;
      updateSliderBg(progressSlider, 0);
      player.nextVideo();
    }
  });

  // Previous Track
  prevBtn.addEventListener('click', () => {
    if (player && typeof player.previousVideo === 'function') {
      progressSlider.value = 0;
      updateSliderBg(progressSlider, 0);
      player.previousVideo();
    }
  });

  // Song Directory Row Clicks
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.song-row');
    if (row && player) {
      const id = row.getAttribute('data-track-id');
      const idx = parseInt(row.getAttribute('data-track-index'), 10);
      
      // Load and play the clicked video by ID
      player.loadVideoById(id);
      isPlaying = true;
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      
      // Highlight row instantly
      updateActiveSongRow(id);
      
      // Set UI text instantly
      const track = haryanviTracks[idx];
      titleEl.textContent = getCleanTitle(track.title);
      artistEl.textContent = getCleanSinger(track.singer);
      artEl.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      progressSlider.value = 0;
      updateSliderBg(progressSlider, 0);
    }
  });

  // Volume Slider Drag
  volumeSlider.addEventListener('input', (e) => {
    volume = e.target.value;
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(volume);
    }
    isMuted = (volume == 0);
    updateVolumeIcon();
    updateSliderBg(volumeSlider, volume);
  });

  // Mute Toggle Click
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      if (player && typeof player.mute === 'function') player.mute();
      volumeSlider.value = 0;
      updateSliderBg(volumeSlider, 0);
    } else {
      if (player && typeof player.unMute === 'function') player.unMute();
      volumeSlider.value = volume;
      updateSliderBg(volumeSlider, volume);
    }
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    if (isMuted) {
      volumeIcon.style.display = 'none';
      muteIcon.style.display = 'block';
    } else {
      volumeIcon.style.display = 'block';
      muteIcon.style.display = 'none';
    }
  }

  // Progress Seek Slider Drag
  progressSlider.addEventListener('input', (e) => {
    if (player && typeof player.getDuration === 'function') {
      const duration = player.getDuration();
      if (duration > 0) {
        const targetTime = (e.target.value / 100) * duration;
        player.seekTo(targetTime, true);
        updateSliderBg(progressSlider, e.target.value);
      }
    }
  });

})();
