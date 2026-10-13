import {Easing, interpolate} from 'remotion';
export const secToFrame = (sec: number, fps: number) => Math.round(sec * fps);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeFlip = Easing.bezier(0.65, 0.02, 0.22, 1);
export const progress = (frame: number, from: number, duration: number, fps: number, easing = ease) =>
  interpolate(frame, [secToFrame(from, fps), secToFrame(from + Math.max(0.034, duration), fps)], [0, 1], {...clamp, easing});
export const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
export const trackOpacity = (frame: number, fps: number, entryDuration: number, exitAtLocal: number, exitDuration: number) => {
  const appear = progress(frame, 0, entryDuration, fps);
  const disappear = progress(frame, exitAtLocal, exitDuration, fps);
  return appear * (1 - disappear);
};
