import React from 'react';
import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {easeFlip, mix, progress, trackOpacity} from './motion';

export const FontStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap');
    @font-face {
      font-family: 'Aref Ruqaa';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('${staticFile('assets/fonts/ArefRuqaa-Regular.ttf')}') format('truetype');
    }
    @font-face {
      font-family: 'Aref Ruqaa';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('${staticFile('assets/fonts/ArefRuqaa-Bold.ttf')}') format('truetype');
    }
  `}</style>
);

const CREAM = '#fff9e9';
const PINK = '#ff8cae';
const BOX_SHADOW = '0 14px 40px rgba(0,0,0,0.5)';

// -------------------------------------------------------------
// 1. TOP HEADER ELEMENT
// -------------------------------------------------------------
export const TopHeaderElement: React.FC<{
  seriesTitle?: string;
  seriesLabel?: string;
  enterDuration?: number;
}> = ({
  seriesTitle = 'MOVIES YOU HAVE TO WATCH BEFORE YOU DIE!',
  seriesLabel = 'THE SPECIAL CONTENT',
  enterDuration = 0.22,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, 0, enterDuration, fps, Easing.bezier(0.16, 1, 0.3, 1));

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <FontStyles />
      <div
        style={{
          width: 980,
          opacity: p,
          transform: `translateY(${mix(-20, 0, p)}px)`,
          color: '#E2507F',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 19,
          fontWeight: 900,
          letterSpacing: 1.25,
          lineHeight: 1.05,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{whiteSpace: 'nowrap', color: '#E2507F'}}>{seriesTitle}</div>
          <div style={{marginTop: 15, width: 393, height: 3, background: '#E2507F'}} />
        </div>
        <div
          style={{
            whiteSpace: 'nowrap',
            textAlign: 'right',
            letterSpacing: 2.5,
            fontWeight: 800,
            color: '#E2507F',
            flexShrink: 0,
            marginLeft: 24,
          }}
        >
          {seriesLabel}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 2. ARABIC HOOK ELEMENT ("فلم ؟")
// -------------------------------------------------------------
export const ArabicHookElement: React.FC<{
  text?: string;
  enterDuration?: number;
  exitAt?: number;
  exitDuration?: number;
}> = ({
  text = 'فلم ؟',
  enterDuration = 0.18,
  exitAt = 2.1,
  exitDuration = 0.25,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = trackOpacity(frame, fps, enterDuration, exitAt, exitDuration);
  const p = progress(frame, 0, enterDuration, fps, Easing.out(Easing.back(1.5)));

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <FontStyles />
      <div
        dir="rtl"
        style={{
          width: '100%',
          textAlign: 'center',
          fontFamily: "'Aref Ruqaa', serif",
          fontSize: 88,
          fontWeight: 700,
          color: '#E3191E',
          opacity,
          transform: `translateY(${mix(40, 0, p)}px) scale(${mix(0.75, 1, p)})`,
          textShadow: '0 5px 18px rgba(0,0,0,.45)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 3. ASTRONAUT AVATAR - LOOPING WALK CYCLE
// -------------------------------------------------------------
export const AvatarLoopElement: React.FC<{playbackSpeed?: number}> = ({playbackSpeed = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceIndex = Math.floor((frame / fps) * 25 * playbackSpeed) % 50;
  const path = `assets/avatar_frames/frame_${String(Math.max(0, sourceIndex)).padStart(3, '0')}.png`;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <Img
        src={staticFile(path)}
        style={{
          height: '92%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 18px rgba(91,225,255,0.75)) drop-shadow(0 0 40px rgba(85,208,244,0.36))',
        }}
      />
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 4. ASTRONAUT AVATAR - ENTRANCE, WALK & EXIT
// -------------------------------------------------------------
export const AvatarMotionElement: React.FC<{
  enterDuration?: number;
  exitAt?: number;
  exitDuration?: number;
}> = ({
  enterDuration = 0.65,
  exitAt = 2.1,
  exitDuration = 0.45,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = progress(frame, 0, enterDuration, fps, Easing.out(Easing.cubic));
  const exit = progress(frame, exitAt, exitDuration, fps, Easing.in(Easing.cubic));
  const sourceIndex = Math.floor((frame / fps) * 25) % 50;
  const path = `assets/avatar_frames/frame_${String(Math.max(0, sourceIndex)).padStart(3, '0')}.png`;

  const x = mix(-320, 0, entry) - 450 * exit;
  const y = mix(180, 0, entry) + 60 * exit;
  const opacity = Math.min(1, entry * 1.15) * (1 - exit);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <Img
        src={staticFile(path)}
        style={{
          height: '90%',
          objectFit: 'contain',
          transform: `translate(${x}px, ${y}px)`,
          opacity,
          filter: 'drop-shadow(0 0 18px rgba(91,225,255,0.75)) drop-shadow(0 0 40px rgba(85,208,244,0.36))',
        }}
      />
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 5. NOLAN POLAROID CARD
// -------------------------------------------------------------
export const NolanPolaroidElement: React.FC<{
  name?: string;
  enterDuration?: number;
}> = ({
  name = 'CHRISTOPHER NOLAN',
  enterDuration = 0.75,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = progress(frame, 0, enterDuration, fps, Easing.bezier(0.16, 1, 0.3, 1));
  const scale = mix(0.7, 1.0, entry);
  const rotate = mix(18, -4, entry);
  const opacity = Math.min(1, entry * 1.3);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <FontStyles />
      <div
        style={{
          position: 'relative',
          width: 375,
          height: 480,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          opacity,
          transformOrigin: 'center',
          filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.65))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            width: 115,
            height: 38,
            right: -10,
            top: -21,
            transform: 'rotate(-8deg)',
            background: PINK,
            boxShadow: '0 2px 6px rgba(0,0,0,.25)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 26,
            background: CREAM,
            padding: '18px 18px 0',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile('assets/posters/nolan_portrait_extracted.jpg')}
            style={{
              height: 333,
              width: '100%',
              objectFit: 'cover',
              objectPosition: '50% 46%',
              borderRadius: 14,
            }}
          />
          <div
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              color: '#2f2836',
              textAlign: 'center',
              fontWeight: 900,
              letterSpacing: 2.5,
              fontSize: 24,
              lineHeight: 1.2,
              marginTop: 17,
            }}
          >
            {name.split(' ').length > 1 ? (
              <>
                {name.split(' ').slice(0, -1).join(' ')}
                <br />
                <span style={{fontSize: 29}}>{name.split(' ').slice(-1)[0]}</span>
              </>
            ) : (
              name
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 6. SECTION HEADING ("ICONIC FILMS")
// -------------------------------------------------------------
export const SectionHeadingElement: React.FC<{
  text?: string;
  enterDuration?: number;
  exitAt?: number;
  exitDuration?: number;
}> = ({
  text = 'ICONIC FILMS',
  enterDuration = 0.35,
  exitAt = 3.0,
  exitDuration = 0.35,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, 0, enterDuration, fps, Easing.bezier(0.16, 1, 0.3, 1));
  const exit = progress(frame, exitAt, exitDuration, fps, Easing.bezier(0.7, 0, 0.84, 0));
  const opacity = p * (1 - exit);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          color: 'white',
          fontSize: 46,
          fontWeight: 900,
          fontFamily: 'Arial, Helvetica, sans-serif',
          letterSpacing: 5.5,
          opacity,
          transform: `translateY(${mix(32, 0, p) + 20 * exit}px)`,
          textShadow: '0 4px 12px rgba(0,0,0,.75)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 7. INDIVIDUAL MOVIE CARD (Interstellar / Inception / Odyssey)
// -------------------------------------------------------------
export const MovieCardElement: React.FC<{
  sourceName: 'interstellar' | 'inception' | 'odyssey';
  filmName: string;
  year: string;
  yearColor: string;
  drift?: number;
  enterDuration?: number;
  flipAt?: number;
  flipDuration?: number;
  labelAt?: number;
  exitAt?: number;
  exitDuration?: number;
}> = ({
  sourceName,
  filmName,
  year,
  yearColor,
  drift = 0,
  enterDuration = 0.6,
  flipAt = 0.8,
  flipDuration = 0.65,
  labelAt = 1.0,
  exitAt = 4.4,
  exitDuration = 0.65,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const intro = progress(frame, 0, enterDuration, fps, Easing.bezier(0.16, 1, 0.3, 1));
  const flip = progress(frame, flipAt, flipDuration, fps, easeFlip);
  const label = progress(frame, labelAt, 0.25, fps, Easing.out(Easing.cubic));
  const exit = progress(frame, exitAt, exitDuration, fps, Easing.bezier(0.7, 0, 0.84, 0));

  const slideY = mix(350, 0, intro) + 400 * exit;
  const turn = 180 * flip;
  const cardRotate = mix(drift * 2, drift, intro) + drift * exit;
  const opacity = intro * (1 - exit);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <div
        style={{
          width: 300,
          height: 558,
          opacity,
          transform: `translateY(${slideY}px) rotate(${cardRotate}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        <div style={{position: 'relative', width: 300, height: 449, perspective: 1400}}>
          <div
            style={{
              position: 'relative',
              height: '100%',
              width: '100%',
              transform: `rotateY(${turn}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Card Back */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                border: '4px solid rgba(235,230,238,.9)',
                borderRadius: 15,
                overflow: 'hidden',
                boxShadow: BOX_SHADOW,
                background: '#111425',
              }}
            >
              <Img
                src={staticFile('assets/posters/card_back.jpg')}
                style={{height: '100%', width: '100%', objectFit: 'cover'}}
              />
            </div>
            {/* Card Front */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                border: '4px solid rgba(235,230,238,.9)',
                borderRadius: 15,
                overflow: 'hidden',
                boxShadow: BOX_SHADOW,
                background: '#111425',
              }}
            >
              <Img
                src={staticFile(`assets/posters/${sourceName}.jpg`)}
                style={{height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center'}}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background:
                    'linear-gradient(110deg,transparent 50%, rgba(255,255,255,0.06) 75%,transparent 92%)',
                }}
              />
            </div>
          </div>
        </div>
        {/* Label */}
        <div
          style={{
            marginTop: 37,
            opacity: label,
            transform: `translateY(${mix(15, 0, label)}px)`,
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 25, fontWeight: 900, letterSpacing: 1.1, whiteSpace: 'nowrap'}}>
            {filmName}
          </div>
          <div style={{marginTop: 13, color: yearColor, fontSize: 20, fontWeight: 800, letterSpacing: 1.5}}>
            {year}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 8. MOVIE CARDS TRIO (All 3 Cards Side by Side)
// -------------------------------------------------------------
export const MovieCardsTrioElement: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 20px',
        background: 'transparent',
      }}
    >
      <div style={{width: 320, height: 560, position: 'relative'}}>
        <MovieCardElement
          sourceName="interstellar"
          filmName="INTERSTELLAR"
          year="2014"
          yearColor="#ffffff"
          drift={-1.8}
          enterDuration={0.6}
          flipAt={0.4}
          flipDuration={0.6}
          labelAt={0.6}
          exitAt={4.8}
          exitDuration={0.8}
        />
      </div>
      <div style={{width: 320, height: 560, position: 'relative'}}>
        <MovieCardElement
          sourceName="inception"
          filmName="INCEPTION"
          year="2010"
          yearColor="#ef526b"
          drift={0.5}
          enterDuration={0.6}
          flipAt={0.7}
          flipDuration={0.55}
          labelAt={0.9}
          exitAt={5.0}
          exitDuration={0.8}
        />
      </div>
      <div style={{width: 320, height: 560, position: 'relative'}}>
        <MovieCardElement
          sourceName="odyssey"
          filmName="THE ODYSSEY"
          year="2026"
          yearColor="#97d9f0"
          drift={1.9}
          enterDuration={0.6}
          flipAt={1.0}
          flipDuration={0.55}
          labelAt={1.2}
          exitAt={5.2}
          exitDuration={0.8}
        />
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 9. ENDING TAGLINE ("MANY STORIES. ONE VISION.")
// -------------------------------------------------------------
export const EndingTaglineElement: React.FC<{
  text?: string;
  enterDuration?: number;
  exitAt?: number;
  exitDuration?: number;
}> = ({
  text = 'MANY STORIES. ONE VISION.',
  enterDuration = 0.8,
  exitAt = 2.8,
  exitDuration = 0.35,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = trackOpacity(frame, fps, enterDuration, exitAt, exitDuration);
  const p = progress(frame, 0, enterDuration, fps, Easing.bezier(0.16, 1, 0.3, 1));

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: 'white',
          opacity,
          transform: `translateY(${mix(38, 0, p)}px)`,
        }}
      >
        <div style={{width: 430, height: 3, background: 'rgba(255,255,255,.85)', margin: '0 auto 20px'}} />
        <div style={{fontSize: 34, fontWeight: 900, letterSpacing: 3.3, textShadow: '0 4px 15px rgba(0,0,0,.5)'}}>
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 10. BACKGROUND STARFIELD LOOP
// -------------------------------------------------------------
export const StarfieldElement: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#030307'}}>
      <Loop durationInFrames={72}>
        <OffthreadVideo
          src={staticFile('assets/video/stars.mp4')}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </Loop>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg,rgba(2,2,6,.08) 0%,transparent 25%,transparent 72%,rgba(0,0,0,.07) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------
// 11. CINEMATIC INSERT SHOT (Black Hole / Folding City)
// -------------------------------------------------------------
export const CinematicInsertElement: React.FC<{
  mediaSrc: string;
  badgeFilm: string;
  badgeSub: string;
  glowColor: string;
  direction?: number;
}> = ({mediaSrc, badgeFilm, badgeSub, glowColor, direction = 1}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const duration = durationInFrames / fps;

  const p = progress(frame, 0, duration, fps, Easing.linear);
  const enterDuration = 0.22;
  const enter = progress(frame, 0, enterDuration, fps, Easing.bezier(0.16, 1, 0.3, 1));
  const exitDuration = 0.2;
  const exitStart = Math.max(0, duration - exitDuration);
  const exit = progress(frame, exitStart, exitDuration, fps, Easing.bezier(0.7, 0, 0.84, 0));

  const blur = (1 - enter) * 10 + exit * 8;
  const apertureY = mix(10, 0, enter) + mix(0, 10, exit);
  const apertureX = mix(6, 0, enter) + mix(0, 6, exit);
  const scalePunch = (mix(0.93, 1.0, enter) - mix(0, 0.04, exit)) * mix(1.0, 1.04, p);
  const driftX = direction * mix(14, -14, p);
  const opacity = enter * (1 - exit);
  const badgeOpacity = progress(frame, enterDuration * 0.4, 0.16, fps);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: 'transparent'}}>
      <div
        style={{
          position: 'relative',
          width: 960,
          height: 660,
          borderRadius: 22,
          overflow: 'hidden',
          opacity,
          clipPath: `inset(${apertureY}% ${apertureX}% ${apertureY}% ${apertureX}% round 22px)`,
          transform: `translateX(${driftX}px) scale(${scalePunch})`,
          filter: `blur(${blur}px)`,
          boxShadow: `0 35px 90px rgba(0,0,0,0.88), 0 0 60px ${glowColor}, inset 0 0 20px rgba(0,0,0,0.5)`,
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
        }}
      >
        <Img
          src={staticFile(mediaSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1.02 + p * 0.06})`,
          }}
        />
        {/* Vignette */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(3,3,7,0.55) 100%), linear-gradient(180deg, rgba(3,3,7,0.25) 0%, transparent 30%, transparent 70%, rgba(3,3,7,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Light streak */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${glowColor} 45%, rgba(255,255,255,0.95) 50%, ${glowColor} 55%, transparent 100%)`,
            opacity: enter * 0.9,
          }}
        />
        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '7px 16px 7px 12px',
            borderRadius: 24,
            background: 'rgba(8, 9, 20, 0.72)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            opacity: badgeOpacity,
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: glowColor,
              boxShadow: `0 0 10px ${glowColor}`,
            }}
          />
          <div style={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: '#fff',
                letterSpacing: 1.8,
                textTransform: 'uppercase',
              }}
            >
              {badgeFilm}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: 1.2,
              }}
            >
              {badgeSub}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
