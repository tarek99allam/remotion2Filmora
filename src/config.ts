import { z } from 'zod';
import {transitionDefaults, transitionSchema} from './transitionConfig';

// Remotion Studio exposes every zod value in the Props editor.
// All *_At values and duration values are in SECONDS (not frames).
const reveal = z.object({
  enterAt: z.number().min(0).max(60).step(0.01),
  enterDuration: z.number().min(0.01).max(10).step(0.01),
});

const filmCard = reveal.extend({
  enabled: z.boolean(),
  flipAt: z.number().min(0).max(60).step(0.01),
  flipDuration: z.number().min(0.05).max(10).step(0.01),
  labelAt: z.number().min(0).max(60).step(0.01),
  exitAt: z.number().min(0).max(60).step(0.01).default(8.0),
  exitDuration: z.number().min(0.01).max(10).step(0.01).default(0.25),
});

export const projectSchema = z.object({
  transition: transitionSchema,
  durationSeconds: z.number().min(1).max(120).step(0.01),
  previewGuides: z.boolean(),
  typography: z.object({
    seriesTitle: z.string(),
    seriesLabel: z.string(),
    hookText: z.string(),
    directorName: z.string(),
    filmsHeading: z.string(),
    endingTagline: z.string(),
  }),
  background: z.object({
    enabled: z.boolean(),
    opacity: z.number().min(0).max(1).step(0.01),
  }),
  topHeader: reveal.extend({
    enabled: z.boolean(),
  }),
  hook: reveal.extend({
    enabled: z.boolean(),
    exitAt: z.number().min(0).max(60).step(0.01),
    exitDuration: z.number().min(0.01).max(10).step(0.01),
  }),
  character: reveal.extend({
    enabled: z.boolean(),
    exitAt: z.number().min(0).max(60).step(0.01),
    exitDuration: z.number().min(0.01).max(10).step(0.01),
    playbackSpeed: z.number().min(0.1).max(5).step(0.05),
  }),
  director: reveal.extend({
    enabled: z.boolean(),
    repositionAt: z.number().min(0).max(60).step(0.01),
    repositionDuration: z.number().min(0.01).max(10).step(0.01),
  }),
  firstFilm: filmCard,
  secondFilm: filmCard,
  thirdFilm: filmCard,
  sectionHeading: reveal.extend({
    enabled: z.boolean(),
  }),
  finalTagline: reveal.extend({
    enabled: z.boolean(),
    yPosition: z.number().min(0).max(1920).step(1).default(1648),
    exitAt: z.number().min(0).max(60).step(0.01).default(8.0),
    exitDuration: z.number().min(0.01).max(10).step(0.01).default(0.25),
  }),
  soundtrack: z.object({
    enabled: z.boolean(),
    startAt: z.number().min(0).max(60).step(0.01),
    volume: z.number().min(0).max(1).step(0.05),
  }),
});

export type ProjectProps = z.infer<typeof projectSchema>;

// Closely follows the 8.23s user-supplied motion reference.
// To edit in Studio: Composition > Props > expand the relevant element.
export const defaultProps: ProjectProps = {
  transition: transitionDefaults,
  durationSeconds: 33.72,
  previewGuides: false,
  typography: {
    seriesTitle: 'MOVIES YOU HAVE TO WATCH BEFORE YOU DIE!',
    seriesLabel: 'THE SPECIAL CONTENT',
    hookText: 'فلم ؟',
    directorName: 'CHRISTOPHER NOLAN',
    filmsHeading: 'ICONIC FILMS',
    endingTagline: 'MANY STORIES. ONE VISION.',
  },
  background: { enabled: true, opacity: 1 },
  topHeader: { enabled: true, enterAt: 0, enterDuration: 0.18 },
  hook: { enabled: true, enterAt: 0.48, enterDuration: 0.16, exitAt: 2.34, exitDuration: 0.19 },
  character: { enabled: true, enterAt: 0.7, enterDuration: 0.64, exitAt: 2.29, exitDuration: 0.44, playbackSpeed: 1 },
  director: { enabled: true, enterAt: 1.4, enterDuration: 0.69, repositionAt: 2.32, repositionDuration: 0.55 },
  firstFilm: { enabled: true, enterAt: 2.88, enterDuration: 0.60, flipAt: 3.82, flipDuration: 0.60, labelAt: 4.22, exitAt: 8.0, exitDuration: 0.25 },
  secondFilm: { enabled: true, enterAt: 3.0, enterDuration: 0.61, flipAt: 4.45, flipDuration: 0.52, labelAt: 4.79, exitAt: 8.0, exitDuration: 0.25 },
  thirdFilm: { enabled: true, enterAt: 3.12, enterDuration: 0.61, flipAt: 7.32, flipDuration: 0.50, labelAt: 7.66, exitAt: 8.0, exitDuration: 0.25 },
  sectionHeading: { enabled: true, enterAt: 4.53, enterDuration: 0.31 },
  finalTagline: { enabled: true, enterAt: 7.35, enterDuration: 0.36, yPosition: 1648, exitAt: 8.0, exitDuration: 0.25 },
  soundtrack: { enabled: true, startAt: 0, volume: 0.8 },
};
