import {Easing} from 'remotion';
import {mix, progress, secToFrame} from './motion';
import type {TransitionSettings} from './transitionConfig';

export type DirectorPose = {x: number; y: number; scale: number; rotate: number};
export const PORTRAIT = {sourceWidth: 510, sourceHeight: 555, left: 18, top: 18, width: 339, height: 333, positionY: 0.46};

// Replicates CSS object-fit: cover / object-position: 50% 46% exactly.
export const portraitHead = (settings: TransitionSettings) => {
  const fit = Math.max(PORTRAIT.width / PORTRAIT.sourceWidth, PORTRAIT.height / PORTRAIT.sourceHeight);
  return {
    x: PORTRAIT.left + settings.headX * PORTRAIT.sourceWidth * fit + (PORTRAIT.width - PORTRAIT.sourceWidth * fit) * 0.5,
    y: PORTRAIT.top + settings.headY * PORTRAIT.sourceHeight * fit + (PORTRAIT.height - PORTRAIT.sourceHeight * fit) * PORTRAIT.positionY,
  };
};

export const headInFrame = (pose: DirectorPose, head: {x: number; y: number}) => {
  const radians = pose.rotate * Math.PI / 180;
  const dx = (head.x - 375 / 2) * pose.scale;
  const dy = (head.y - 480 / 2) * pose.scale;
  return {x: pose.x + dx * Math.cos(radians) - dy * Math.sin(radians), y: pose.y + dx * Math.sin(radians) + dy * Math.cos(radians)};
};

export const directorCamera = (frame: number, fps: number, width: number, height: number, original: DirectorPose, settings: TransitionSettings) => {
  const prepare = progress(frame, settings.prepareAt, Math.max(1 / fps, settings.zoomAt - settings.prepareAt), fps, Easing.inOut(Easing.cubic));
  const pose = {...original, x: mix(original.x, width / 2, prepare), y: mix(original.y, height * 0.45, prepare), scale: mix(original.scale, 1.5, prepare), rotate: mix(original.rotate, 0, prepare)};
  const head = portraitHead(settings);
  const anchor = headInFrame(pose, head);
  const zoomProgress = progress(frame, settings.zoomAt, settings.zoomDuration, fps, Easing.linear);
  const zoom = (at: number) => Math.exp(Math.log(settings.zoomScale) * Math.pow(progress(at, settings.zoomAt, settings.zoomDuration, fps, Easing.linear), settings.acceleration));
  const scale = zoom(frame);
  const align = progress(frame, settings.zoomAt, settings.zoomDuration * 0.55, fps, Easing.inOut(Easing.cubic));
  const focal = {x: mix(anchor.x, width / 2, align), y: mix(anchor.y, height / 2, align)};
  // F + S * (point - head). At S=1 / alignment=0 this is identity.
  // Translation compensates for the cropped portrait and the card's rotation.
  const translate = {x: focal.x - scale * anchor.x, y: focal.y - scale * anchor.y};
  const velocity = Math.max(0, Math.log(scale / zoom(frame - 1)));
  const blur = Math.min(settings.motionBlur, velocity * settings.motionBlur * 3);
  return {pose, head, focal, scale, translate, blur, zoomProgress, active: frame >= secToFrame(settings.prepareAt, fps)};
};
