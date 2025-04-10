import { getContext, onDestroy, setContext } from 'svelte';

export class Lightbox {
  items: any[] = $state([]);
  show = $state(false);
  showVideo = $state(false);
  startAt = $state(0);
  current = $state(this.startAt);
  selected = $state(-1);
  player: any = $state(undefined);
  playerState: any = $state(undefined);
  video = $state('');

  sliderOrder = $derived.by(() => {
    let slides = $state.snapshot(this.items);
    const traverse = slides.splice(0, this.current);
    slides?.push(...traverse);
    return slides;
  });

  slider: any[] = $state([]);

  constructor() {
    onDestroy(() => {});
  }

  launch(startAt: number, slides: any[]) {
    this.current = startAt;
    this.items = slides;
    this.show = true;
    this.slider = $state.snapshot(this.sliderOrder);
    this.selected = startAt;
  }
  showLightbox(value: boolean = true) {
    this.show = value;
  }

  next() {
    const s = this.slider.shift();
    this.slider.push(s);
  }

  previous() {
    const s = this.slider.pop();
    this.slider.unshift(s);
  }
  close() {
    this.current = -1;
    this.items = [];
    this.show = false;
    this.showVideo = false;
    this.video = '';
    this.player = undefined;
    this.playerState = undefined;
    this.selected = -1;
  }
  getSlider() {
    return this.slider;
  }
  launchVideo(id: string) {
    this.video = id;
    this.showVideo = true;
    console.log({ video: this.video, show: this.showVideo });
  }
  playVideo() {
    console.log(this.player);

    if (this.player) this.player.play();
  }
}

const LIGHTBOX_KEY = Symbol('LIGHTBOX');

export function setLightbox() {
  return setContext(LIGHTBOX_KEY, new Lightbox());
}

export function getLightbox() {
  return getContext<ReturnType<typeof setLightbox>>(LIGHTBOX_KEY);
}
