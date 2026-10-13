import {z} from 'zod';

const mediaSchema = z.object({
  // Paths are relative to public/. Remote URLs are also supported.
  src: z.string(),
  type: z.enum(['image', 'video']),
  objectPosition: z.string(),
  scale: z.number().min(1).max(5).step(0.01),
  trimBeforeSeconds: z.number().min(0).step(0.01),
  loopDurationSeconds: z.number().min(0.1).step(0.01).optional(),
  loop: z.boolean().optional(),
});

// Replace these three sources, or use transition > media in Studio's Props panel.
// Video replacements are muted: the original narration remains the audio track.
export const transitionMedia = {
  shot1: {src: 'assets/inserts/shot-01-black-hole.jpg', type: 'image' as const, objectPosition: '70% 50%', scale: 1.02, trimBeforeSeconds: 0, loopDurationSeconds: 5, loop: false},
  shot2: {src: 'assets/inserts/shot-02-folding-city.jpg', type: 'image' as const, objectPosition: '50% 50%', scale: 1.02, trimBeforeSeconds: 0, loopDurationSeconds: 5, loop: false},
  mindReveal: {src: 'assets/video/2 videos mirged.mp4', type: 'video' as const, objectPosition: '50% 50%', scale: 1, trimBeforeSeconds: 0, loopDurationSeconds: 11.36, loop: false},
};

export const transitionDefaults = {
  exitAt: 8,
  exitDuration: 0.25,
  shot1At: 8.2,
  shot2At: 8.6,
  shotDuration: 0.4,
  prepareAt: 8.65,
  zoomAt: 9,
  zoomDuration: 0.7,
  zoomScale: 96,
  acceleration: 2,
  revealAt: 9.5,
  revealDuration: 0.2,
  motionBlur: 5,
  // Measured in the actual 510 x 555 source portrait: upper face / brow.
  headX: 244 / 510,
  headY: 128 / 555,
  media: transitionMedia,
};

export const transitionSchema = z.object({
  exitAt: z.number().min(8).max(60).step(0.01),
  exitDuration: z.number().min(0.1).max(2).step(0.01),
  shot1At: z.number().min(8).max(60).step(0.01),
  shot2At: z.number().min(8).max(60).step(0.01),
  shotDuration: z.number().min(0.1).max(3).step(0.01),
  prepareAt: z.number().min(8).max(60).step(0.01),
  zoomAt: z.number().min(8.01).max(60).step(0.01),
  zoomDuration: z.number().min(0.2).max(3).step(0.01),
  zoomScale: z.number().min(16).max(120).step(1),
  acceleration: z.number().min(1).max(4).step(0.1),
  revealAt: z.number().min(8).max(60).step(0.01),
  revealDuration: z.number().min(0.1).max(2).step(0.01),
  motionBlur: z.number().min(0).max(10).step(0.1),
  headX: z.number().min(0).max(1).step(0.001),
  headY: z.number().min(0).max(1).step(0.001),
  media: z.object({shot1: mediaSchema, shot2: mediaSchema, mindReveal: mediaSchema}),
}).default(transitionDefaults);

export type TransitionSettings = z.infer<typeof transitionSchema>;
export type TransitionMedia = z.infer<typeof mediaSchema>;
