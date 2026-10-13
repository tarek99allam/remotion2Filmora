import React from 'react';
import { Composition } from 'remotion';
import {
  TopHeaderElement,
  ArabicHookElement,
  AvatarLoopElement,
  AvatarMotionElement,
  NolanPolaroidElement,
  SectionHeadingElement,
  MovieCardElement,
  MovieCardsTrioElement,
  EndingTaglineElement,
  StarfieldElement,
  CinematicInsertElement,
} from './ElementsCompositions';

export const RemotionRoot: React.FC = () => (
  <>
    {/* 01. Top Header Banner */}
    <Composition
      id="Element-01-TopHeader"
      component={TopHeaderElement}
      width={1080}
      height={140}
      fps={30}
      durationInFrames={90}
    />

    {/* 02. Arabic Hook ("فلم ؟") */}
    <Composition
      id="Element-02-ArabicHook"
      component={ArabicHookElement}
      width={400}
      height={240}
      fps={30}
      durationInFrames={75}
    />

    {/* 03. Avatar Astronaut Walking Cycle (Loop) */}
    <Composition
      id="Element-03-Avatar-WalkLoop"
      component={AvatarLoopElement}
      width={640}
      height={850}
      fps={30}
      durationInFrames={60}
    />

    {/* 04. Avatar Astronaut Entrance & Exit */}
    <Composition
      id="Element-04-Avatar-Motion"
      component={AvatarMotionElement}
      width={960}
      height={960}
      fps={30}
      durationInFrames={84}
    />

    {/* 05. Christopher Nolan Polaroid Card */}
    <Composition
      id="Element-05-NolanPolaroid"
      component={NolanPolaroidElement}
      width={500}
      height={620}
      fps={30}
      durationInFrames={75}
    />

    {/* 06. Section Heading ("ICONIC FILMS") */}
    <Composition
      id="Element-06-IconicFilmsHeading"
      component={SectionHeadingElement}
      width={960}
      height={140}
      fps={30}
      durationInFrames={105}
    />

    {/* 07. Movie Card: Interstellar 3D Flip */}
    <Composition
      id="Element-07-MovieCard-Interstellar"
      component={() => (
        <MovieCardElement
          sourceName="interstellar"
          filmName="INTERSTELLAR"
          year="2014"
          yearColor="#ffffff"
          drift={-1.8}
          enterDuration={0.6}
          flipAt={0.6}
          flipDuration={0.6}
          labelAt={0.8}
          exitAt={4.2}
          exitDuration={0.8}
        />
      )}
      width={360}
      height={600}
      fps={30}
      durationInFrames={165}
    />

    {/* 08. Movie Card: Inception 3D Flip */}
    <Composition
      id="Element-08-MovieCard-Inception"
      component={() => (
        <MovieCardElement
          sourceName="inception"
          filmName="INCEPTION"
          year="2010"
          yearColor="#ef526b"
          drift={0.5}
          enterDuration={0.6}
          flipAt={0.6}
          flipDuration={0.55}
          labelAt={0.8}
          exitAt={4.2}
          exitDuration={0.8}
        />
      )}
      width={360}
      height={600}
      fps={30}
      durationInFrames={165}
    />

    {/* 09. Movie Card: The Odyssey 3D Flip */}
    <Composition
      id="Element-09-MovieCard-TheOdyssey"
      component={() => (
        <MovieCardElement
          sourceName="odyssey"
          filmName="THE ODYSSEY"
          year="2026"
          yearColor="#97d9f0"
          drift={1.9}
          enterDuration={0.6}
          flipAt={0.6}
          flipDuration={0.55}
          labelAt={0.8}
          exitAt={4.2}
          exitDuration={0.8}
        />
      )}
      width={360}
      height={600}
      fps={30}
      durationInFrames={165}
    />

    {/* 10. All 3 Movie Cards Trio */}
    <Composition
      id="Element-10-MovieCardsTrio"
      component={MovieCardsTrioElement}
      width={1040}
      height={620}
      fps={30}
      durationInFrames={180}
    />

    {/* 11. Ending Tagline ("MANY STORIES. ONE VISION.") */}
    <Composition
      id="Element-11-EndingTagline"
      component={EndingTaglineElement}
      width={1040}
      height={180}
      fps={30}
      durationInFrames={105}
    />

    {/* 12. Starfield Background Loop */}
    <Composition
      id="Element-12-StarfieldLoop"
      component={StarfieldElement}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={72}
    />

    {/* 13. Cinematic Insert Shot 1 (Black Hole) */}
    <Composition
      id="Element-13-Insert-BlackHole"
      component={() => (
        <CinematicInsertElement
          mediaSrc="assets/inserts/shot-01-black-hole.jpg"
          badgeFilm="INTERSTELLAR"
          badgeSub="GARGANTUA - 2014"
          glowColor="rgba(255, 175, 75, 0.45)"
          direction={1}
        />
      )}
      width={960}
      height={660}
      fps={30}
      durationInFrames={36}
    />

    {/* 14. Cinematic Insert Shot 2 (Folding City) */}
    <Composition
      id="Element-14-Insert-FoldingCity"
      component={() => (
        <CinematicInsertElement
          mediaSrc="assets/inserts/shot-02-folding-city.jpg"
          badgeFilm="INCEPTION"
          badgeSub="PARIS FOLD - 2010"
          glowColor="rgba(95, 205, 255, 0.45)"
          direction={-1}
        />
      )}
      width={960}
      height={660}
      fps={30}
      durationInFrames={36}
    />
  </>
);
