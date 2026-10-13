# remotion2Filmora 🎬⚡

> **Bridge Programmatic Motion Graphics in Remotion (React) to Native Wondershare Filmora (`.wfp`) Timeline Projects with Transparent GIF/Asset Generation.**

[![Remotion](https://img.shields.io/badge/Remotion-v4.0-blue?logo=react)](https://remotion.dev)
[![Filmora](https://img.shields.io/badge/Filmora-v14%20%7C%20v15-00D4AA?logo=wondershare)](https://filmora.wondershare.com)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 💡 The Core Idea

### Why Code-to-NLE?
Video creation has long suffered from a divide between two worlds:
1. **Programmatic Motion Graphics (Remotion / React)**: Perfect for complex mathematical animations, procedural physics, dynamic typography, 3D card flips, SVG path morphs, and data-driven graphics. However, fine-tuning sound sync, color grading, cutting B-roll footage, and adjusting narrative pacing is rigid in code.
2. **Non-Linear Video Editors (Filmora / Premiere)**: Intuitive for pacing, audio layering, B-roll cutting, and color grading, but building advanced, procedural, micro-animated motion graphics natively inside the NLE is tedious, limited, or impossible without cumbersome keyframing.

### The Solution: Generate Isolated Elements & Assemble the Project
**`remotion2Filmora`** bridges this gap:
- Every graphic element (headers, badges, 3D card flips, animated avatars, stickers, typography cards) is designed as a standalone, modular Remotion `<Composition>`.
- The pipeline batch-renders every element into an **isolated, high-framerate transparent GIF** (or transparent video).
- A Python automation engine reverse-engineers the Wondershare Filmora `.wfp` project structure, calculating exact track positions, layer order, scale, and microsecond timings.
- It automatically builds a **ready-to-open multi-track `.wfp` project**, placing every motion graphic element on its precise timeline track with zero manual dragging or alignment required!

---

## 🏗️ Architecture & How It Works

```
┌────────────────────────────────────────────────────────┐
│ 1. Remotion (React) Compositions                       │
│    • TopHeader, ArabicHook, AstronautAvatar, etc.      │
└──────────────────────────┬─────────────────────────────┘
                           │ npm run render:elements
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Isolated Element Generation                         │
│    • 14 Transparent GIFs / Video clips (`elements/`)   │
│    • Exact resolutions, frame counts & alpha channels  │
└──────────────────────────┬─────────────────────────────┘
                           │ python create_filmora_wfp.py
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Reverse-Engineered Filmora WFP Generator            │
│    • 100ns tick time conversion (1s = 10,000,000 units)│
│    • Native `timeline.wesproj` JSON & GUID synthesis    │
│    • Multi-track video layering (Tracks 0 to 6)        │
│    • Synchronized audio track mapping                  │
│    • Package into uncompressed TAR/WFP archive         │
└──────────────────────────┬─────────────────────────────┘
                           │ Output: project.wfp
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Wondershare Filmora (v13 / v14 / v15+)              │
│    • Open project directly                             │
│    • Edit text, re-time clips, mix audio, color grade  │
└────────────────────────────────────────────────────────┘
```

---

## 🔬 Deep Dive: The Filmora `.wfp` Format

Wondershare Filmora projects (`.wfp`) are **TAR archives** containing an internal folder hierarchy:

```
project.wfp (TAR archive)
└── ProjectFolder/
    ├── project_info.json           # Metadata, timeline GUID reference, version info
    └── Medias/
        └── {TIMELINE-GUID}/
            └── timeline.wesproj    # Core timeline definition (tracks, clips, effects)
```

### Time Representation
Filmora represents time using **100-nanosecond ticks** (10 million units per second):
```python
TIME_SCALE = 10_000_000 # 1 second = 10,000,000 units

def to_filmora_units(seconds: float) -> int:
    return int(round(seconds * TIME_SCALE))
```

### Timeline Structure (`timeline.wesproj`)
Each clip entry in `trackInfos` defines:
- `tlBegin` and `tlEnd`: In/out points on the global timeline.
- `srcBegin` and `srcEnd`: In/out points of the source file.
- `sourceGuid`: Unique 38-character GUID registered in the media pool.
- `trackType`: `1` for Video/Graphics, `2` for Audio.
- Spatial transform: `pos_x`, `pos_y`, and `scale`.

---

## 🎛️ Timeline Track Mapping

The generated Filmora project organizes elements cleanly across synchronized tracks:

| Track # | Track Type | Content | Timing |
|---|---|---|---|
| **Track 5** | Video (Top) | Section Heading (`ICONIC FILMS`) & Ending Tagline | 04.53s - 09.25s |
| **Track 4** | Video | 3D Movie Cards Flip (Interstellar, Inception, Odyssey) | 02.88s - 08.60s |
| **Track 3** | Video | Christopher Nolan Polaroid Card | 01.40s - 02.32s |
| **Track 2** | Video | Neon Astronaut Avatar Entrance & Walk | 00.10s - 02.18s |
| **Track 1** | Video | Arabic Question Hook (`فلم ؟`) & Top Header Banner | 00.10s - 08.00s |
| **Track 0** | Video (Base) | Looping Cinematic Starfield Background | 00.00s - 33.72s |
| **Audio 1** | Audio | Prestige Soundtrack (`prestige-1.wav`) | 00.00s - 33.72s |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** 18+ & **npm**
- **Python** 3.9+
- **Wondershare Filmora** (v13, v14, or v15)

### 2. Installation
```bash
git clone https://github.com/tarek99allam/remotion2Filmora.git
cd remotion2Filmora
npm install
```

### 3. Preview Elements in Remotion Studio
```bash
npm run studio
```
Open [http://localhost:3000](http://localhost:3000) to inspect and edit every element composition visually.

### 4. Batch Render All Elements to Transparent GIF
```bash
npm run render:elements
```
Renders all 14 visual elements into the `elements/` directory with optimized transparency and frame rates.

### 5. Build the Native Filmora Project (`.wfp`)
```bash
npm run build:wfp
```
Generates `nolan_prestige_motion_graphics.wfp` ready to open in Filmora.

### 6. One-Command Pipeline
```bash
npm run pipeline
```

---

## 📂 Project Structure

```
remotion2Filmora/
├── elements/                          # Rendered transparent GIF assets
│   ├── 01_top_header.gif
│   ├── 02_arabic_hook.gif
│   ├── 03_avatar_astronaut_walk_loop.gif
│   ├── 04_avatar_astronaut_entrance_exit.gif
│   ├── 05_nolan_polaroid_card.gif
│   ├── 06_iconic_films_heading.gif
│   ├── 07_card_interstellar_flip.gif
│   ├── 08_card_inception_flip.gif
│   ├── 09_card_the_odyssey_flip.gif
│   ├── 10_movie_cards_trio.gif
│   ├── 11_ending_tagline.gif
│   └── 12_starfield_background_loop.gif
├── public/                            # Source textures, audio & posters
│   └── assets/
│       ├── audio/
│       ├── avatar_frames/
│       ├── inserts/
│       └── posters/
├── scripts/
│   ├── create_filmora_wfp.py          # Native Filmora WFP generator
│   ├── build_from_dump.py             # Advanced template-based builder
│   ├── render-all-elements.mjs        # Batch Remotion element renderer
│   └── verify_project.cjs             # Timeline integrity validator
├── src/
│   ├── ElementsCompositions.tsx       # Standalone Remotion element compositions
│   ├── Root.tsx                       # Remotion Root registering compositions
│   ├── index.ts                       # Entry point
│   ├── motion.ts                      # Spring & easing utilities
│   ├── config.ts                      # Dimension & project config
│   ├── transitionConfig.ts            # Transition settings schema
│   └── transitionMotion.ts            # Motion transition math
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Adapting to Your Own Project

To create a Filmora project for your own Remotion animations:

1. **Define your Compositions** in `src/ElementsCompositions.tsx`:
   ```tsx
   <Composition
     id="MyCustomBanner"
     component={MyCustomBanner}
     width={1080}
     height={200}
     fps={30}
     durationInFrames={90}
   />
   ```

2. **Add metadata** to `scripts/render-all-elements.mjs`:
   ```javascript
   {
     id: 'MyCustomBanner',
     filename: 'custom_banner.gif',
     title: 'Custom Animated Banner',
     fps: 30
   }
   ```

3. **Configure timing & track in `scripts/create_filmora_wfp.py`**:
   ```python
   {
       'file': 'custom_banner.gif',
       'name': 'Custom Animated Banner',
       'width': 1080,
       'height': 200,
       'start_sec': 1.5,
       'duration_sec': 3.0,
       'track': 2,
       'pos_x': 0.5,
       'pos_y': 0.15,
       'scale': 100.0,
   }
   ```

4. Run `npm run pipeline` and open the resulting `.wfp` in Wondershare Filmora!

---

## 📜 License

MIT License © 2026 Tarek Allam. Free to use in personal and commercial motion design projects.
