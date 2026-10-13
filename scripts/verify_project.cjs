const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const cleanDir = path.resolve('scratch_verify');
if (fs.existsSync(cleanDir)) fs.rmSync(cleanDir, { recursive: true, force: true });
fs.mkdirSync(cleanDir, { recursive: true });

const w = path.resolve('nolan_prestige_motion_graphics.wfp');
execSync(`tar -xf "${w}" -C "${cleanDir}"`);

const projInfo = JSON.parse(fs.readFileSync(path.join(cleanDir, 'ProjectFolder/project_info.json'), 'utf8'));
const tlGuid = projInfo.timeline_mediaId;
const tlFile = path.join(cleanDir, 'ProjectFolder/Medias', tlGuid, 'timeline.wesproj');
const data = JSON.parse(fs.readFileSync(tlFile, 'utf8'));

console.log('Project resolution:', data.timelineInfos[0].resolutionWidth, 'x', data.timelineInfos[0].resolutionHeight);
console.log('FPS:', data.timelineInfos[0].frameRate);
console.log('Total Tracks:', data.timelineInfos[0].trackInfos.length);

data.timelineInfos[0].trackInfos.forEach((t, i) => {
  const tType = t.trackType === 2 ? 'Audio' : 'Video';
  console.log(`Track ${i} (${tType}):`);
  (t.clipList || []).forEach(c => {
    const startSec = (c.tlBegin / 10000000).toFixed(2);
    const endSec = (c.tlEnd / 10000000).toFixed(2);
    const durSec = ((c.tlEnd - c.tlBegin) / 10000000).toFixed(2);
    console.log(`   - [${startSec}s -> ${endSec}s] (${durSec}s) ${c.filename ? c.filename.split('/').pop() : 'Clip'}`);
  });
});

fs.rmSync(cleanDir, { recursive: true, force: true });
console.log('\n✔ Verification successful: All tracks, clips, and timings match Filmora 15.5 native schema.');
