import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ELEMENTS_DIR = path.resolve('elements');
if (!fs.existsSync(ELEMENTS_DIR)) {
  fs.mkdirSync(ELEMENTS_DIR, { recursive: true });
}

const elements = [
  {
    id: 'Element-01-TopHeader',
    filename: '01_top_header.gif',
    title: 'Top Header Banner (MOVIES YOU HAVE TO WATCH BEFORE YOU DIE!)',
    description: 'Header text with pink divider line and THE SPECIAL CONTENT badge',
    resolution: '1080x140',
    duration: '3.0s (90 frames)',
    fps: 30,
  },
  {
    id: 'Element-02-ArabicHook',
    filename: '02_arabic_hook.gif',
    title: 'Arabic Question Hook (فلم ؟)',
    description: 'Calligraphy text entrance with scale drop, hold, and smooth exit',
    resolution: '400x240',
    duration: '2.5s (75 frames)',
    fps: 30,
  },
  {
    id: 'Element-03-Avatar-WalkLoop',
    filename: '03_avatar_astronaut_walk_loop.gif',
    title: 'Neon Astronaut Guide - Looping Walk Cycle',
    description: 'Seamless loopable walking cycle with neon cyan glow and transparency',
    resolution: '640x850',
    duration: '2.0s (60 frames)',
    fps: 30,
  },
  {
    id: 'Element-04-Avatar-Motion',
    filename: '04_avatar_astronaut_entrance_exit.gif',
    title: 'Neon Astronaut Guide - Full Motion Sequence',
    description: 'Slides in from bottom-left, walks, then exits with motion blur',
    resolution: '960x960',
    duration: '2.8s (84 frames)',
    fps: 30,
  },
  {
    id: 'Element-05-NolanPolaroid',
    filename: '05_nolan_polaroid_card.gif',
    title: 'Christopher Nolan Polaroid Card',
    description: 'Vintage cream polaroid card with pink tape and bold name label',
    resolution: '500x620',
    duration: '2.5s (75 frames)',
    fps: 30,
  },
  {
    id: 'Element-06-IconicFilmsHeading',
    filename: '06_iconic_films_heading.gif',
    title: 'Section Heading (ICONIC FILMS)',
    description: 'Bold cinema typography entrance with slide and shadow',
    resolution: '960x140',
    duration: '3.5s (105 frames)',
    fps: 30,
  },
  {
    id: 'Element-07-MovieCard-Interstellar',
    filename: '07_card_interstellar_flip.gif',
    title: 'Movie Card 1 - Interstellar (2014) 3D Flip',
    description: 'Card back rotating 180° in 3D to reveal Interstellar poster + year label',
    resolution: '360x600',
    duration: '5.5s (165 frames)',
    fps: 30,
  },
  {
    id: 'Element-08-MovieCard-Inception',
    filename: '08_card_inception_flip.gif',
    title: 'Movie Card 2 - Inception (2010) 3D Flip',
    description: 'Card back rotating 180° in 3D to reveal Inception poster + red year label',
    resolution: '360x600',
    duration: '5.5s (165 frames)',
    fps: 30,
  },
  {
    id: 'Element-09-MovieCard-TheOdyssey',
    filename: '09_card_the_odyssey_flip.gif',
    title: 'Movie Card 3 - The Odyssey (2026) 3D Flip',
    description: 'Card back rotating 180° in 3D to reveal Odyssey poster + cyan year label',
    resolution: '360x600',
    duration: '5.5s (165 frames)',
    fps: 30,
  },
  {
    id: 'Element-10-MovieCardsTrio',
    filename: '10_movie_cards_trio.gif',
    title: 'All 3 Movie Cards Trio (Side-by-Side Flip)',
    description: 'Full 3-card lineup performing staggered 3D flips and exits',
    resolution: '1040x620',
    duration: '6.0s (180 frames)',
    fps: 30,
  },
  {
    id: 'Element-11-EndingTagline',
    filename: '11_ending_tagline.gif',
    title: 'Closing Tagline (MANY STORIES. ONE VISION.)',
    description: 'White divider bar and cinematic tagline slide entrance and hold',
    resolution: '1040x180',
    duration: '3.5s (105 frames)',
    fps: 30,
  },
  {
    id: 'Element-12-StarfieldLoop',
    filename: '12_starfield_background_loop.gif',
    title: 'Space Starfield Loop',
    description: 'Deep cosmic starfield moving loop background',
    resolution: '1080x1920',
    duration: '2.4s (72 frames)',
    fps: 30,
  },
  {
    id: 'Element-13-Insert-BlackHole',
    filename: '13_cinematic_insert_blackhole.gif',
    title: 'Cinematic Insert 1 - Gargantua Black Hole',
    description: 'Rounded IMAX insert card with anamorphic light streak and badge',
    resolution: '960x660',
    duration: '1.2s (36 frames)',
    fps: 30,
  },
  {
    id: 'Element-14-Insert-FoldingCity',
    filename: '14_cinematic_insert_folding_city.gif',
    title: 'Cinematic Insert 2 - Inception Paris Folding City',
    description: 'Rounded IMAX insert card with anamorphic flare and badge',
    resolution: '960x660',
    duration: '1.2s (36 frames)',
    fps: 30,
  },
];

console.log(`Starting render of ${elements.length} motion graphic elements to /elements...\n`);

for (let i = 0; i < elements.length; i++) {
  const el = elements[i];
  const outPath = path.join('elements', el.filename);
  console.log(`[${i + 1}/${elements.length}] Rendering: ${el.title} -> ${outPath}`);

  const cmd = `npx remotion render src/index.ts "${el.id}" "${outPath}" --image-format=png --concurrency=2 --overwrite`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✔ Finished: ${el.filename}\n`);
  } catch (err) {
    console.error(`✖ Error rendering ${el.id}:`, err.message);
  }
}

// Generate FILMORA_GUIDE.md in elements directory
const guideContent = `# Filmora Motion Graphic Elements Pack

This folder contains all individual motion graphic elements exported as transparent animated GIFs for your **Wondershare Filmora** project.

## How to Use in Filmora

1. **Import Files**:
   - Open Wondershare Filmora.
   - Click **Import Media Files** and select the GIFs from this folder (\`elements/\`).
2. **Add to Timeline**:
   - Drag and drop any element GIF directly onto a video track **above** your background or video clips (e.g. Track 2 or Track 3).
   - Because they have **transparent alpha channels**, they will overlay seamlessly over your footage with no background block.
3. **Reposition & Scale**:
   - Click the clip in the timeline or preview window to resize, move, or rotate the element anywhere on the screen.
4. **Looping**:
   - For looping elements (like \`03_avatar_astronaut_walk_loop.gif\` or \`12_starfield_background_loop.gif\`), you can copy & paste the clip on the timeline consecutively to loop it for as long as needed.

---

## Elements Inventory

| # | Filename | Description | Resolution | Duration |
|---|---|---|---|---|
${elements
  .map(
    (el, idx) =>
      `| ${String(idx + 1).padStart(2, '0')} | \`${el.filename}\` | ${el.description} | ${el.resolution} | ${el.duration} |`
  )
  .join('\n')}

---

*Generated programmatically with Remotion & React for Filmora editing.*
`;

fs.writeFileSync(path.join(ELEMENTS_DIR, 'FILMORA_GUIDE.md'), guideContent, 'utf-8');
console.log('✔ Generated elements/FILMORA_GUIDE.md!');
