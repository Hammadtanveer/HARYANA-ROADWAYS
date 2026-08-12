# 🚌 HARYANA ROADWAYS — THE CINEMATIC EXPERIENCE
> **जय हरियाणा • JAI HARYANA**
> Haryanvi hip-hop, street drill, and aggressive beats playing live. Experiencing the iconic green machines of Haryana like never before.

An ultra-premium, interactive cinematic radio website designed with an **Apple-inspired Liquid Glass** glassmorphic aesthetic. It streams a curated playlist of high-energy Haryanvi songs directly in the background using the YouTube IFrame Player API.

---

## ✨ Features

- 📐 **Liquid Glass Controls:** A sleek, centered pill player controls play/pause, next, previous, volume levels, and progress seeks with custom gradient sliders.
- 🎵 **सारे गाने (All Songs) Directory:** A responsive song catalog listing all tracks in the playlist, featuring click-to-play activation and real-time active song row glowing indicators.
- 🗺️ **The Roads (Journey Map):** A visual vector route map tracking the roadways journey with scroll-spy progressive trail drawing.
- ⚡ **Dynamic Playlist Syncing:** Automatically scrapes track titles, singer metadata, and cover art thumbnails directly from the live YouTube playlist feed on load.
- 🛡️ **Fault-Tolerant Audio Stream:** Catch-and-skip error fallback handlers bypass restricted embeds or private videos to keep the audio streaming uninterrupted.

---

## 🛠️ Tech Stack

- **Core Structure:** HTML5 (Semantic elements)
- **Styling & Motion:** Vanilla CSS3 (Custom properties, HSL tailors, Backdrop Filters, Glassmorphism, Micro-interactions)
- **Audio Driver:** JavaScript & YouTube IFrame Player API
- **Dynamic Metadata:** Fetch API & oEmbed/NoEmbed APIs

---

## 🚀 How to Run Locally

Because YouTube's API blocks embeds on local file protocols (`file:///`), the website **must** be run from a local HTTP server:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hammadtanveer/HARYANA-ROADWAYS.git
   cd HARYANA-ROADWAYS
   ```
2. **Launch the Server:**
   - **Windows:** Double-click **`run.bat`** (it automatically starts Python's HTTP server on port 8000 and opens the browser).
   - **Manual:** Run `python -m http.server 8000` in the directory, then navigate to `http://localhost:8000` in your web browser.

---

## 👨‍💻 Credits & Profile
- **Developer:** Hammad Tanveer
- **Twitter/X:** [@Hammadkhan_9](https://x.com/Hammadkhan_9)
- **GitHub:** [@Hammadtanveer](https://github.com/Hammadtanveer)
- **Audio Credits:** Respective Haryanvi artists & labels. Nothing is hosted locally.
