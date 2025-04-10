<script>
	import { getContext } from 'svelte';
	import Text from '$lib/Text.svelte';
	const svedit = getContext('svedit');

	let { path } = $props();

	let block = $derived(svedit.entry_session.get(path));
	import { getLightbox } from '$lib/js/Lightbox.svelte';
	import { page } from '$app/stores';
	// import Youtube from './components/Youtube.svelte';
	import { Youtube } from 'svelte-youtube-lite';

	const lightbox = getLightbox();

	function play(id) {
		lightbox.launchVideo(id);
	}
	let player;
	let playerState = $state();
	let isPlayerReady = $state();
	$inspect(player);
	$effect(() => {
		if (isPlayerReady) {
			player.play();
		}
	});
</script>

<div
	class="story-block layout-{block.layout} {block.classes} container mx-auto w-full"
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
>
	<div class=" w-full overflow-hidden md:w-[320px] lg:w-[640px]" contenteditable="false">
		<!-- svelte-ignore a11y_img_redundant_alt -->

		<!-- <div
        class="absolute flex h-full w-full items-center justify-center bg-black text-white opacity-70"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-20"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
          />
        </svg>
      </div>
      <img
        class="h-full w-full object-cover"
        src={block.image}
        alt={svedit.entry_session.get([...path, 'title'])[0]}
      /> -->
		<Youtube showTitle={false} thumbnail="hqdefault" id={block.video} />
	</div>
	<div class="caption">
		<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
		<Text class="heading2 text-[#60A886]" path={[...path, 'title']} editable={block.editable} />
		<Text class="body text-white" path={[...path, 'description']} editable={block.editable} />
	</div>
</div>

<style>
	@reference '../app.css';

	.story-block {
		container-type: inline-size;
		display: grid;
		grid-template-columns: 1fr;
		/* Apply padding on the sides of the block, but only on devices that need it, e.g. iPhone with notch */
		/* Learn more about this technique here: https://kulturbanause.de/blog/websites-fuer-das-iphone-x-optimieren-weisse-balken-entfernen-viewport-anpassen-safe-area-festlegen/ */
		/* padding-inline-start: max(var(--s-10), env(safe-area-inset-left, 0px));
    padding-inline-end: max(var(--s-10), env(safe-area-inset-right, 0px)); */
		padding-block-start: max(var(--s-10), env(safe-area-inset-top, 0px));
		padding-block-end: max(var(--s-10), env(safe-area-inset-bottom, 0px));
		@media (min-width: 768px) {
			grid-template-columns: 1fr 1fr;
		}
		gap: var(--s-10);
	}
	.story-block img {
		width: 100%;
		height: auto;
	}
	/* Don't crop SVGs */
	.story-block img[src*='.svg'] {
		object-fit: contain;
		object-position: center;
	}

	.non-text-content {
		/* for now ignore clicks on the image, until we have non-text selections */
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 340px;
		@media (max-width: 768px) {
			min-width: 100%;
		}
	}

	/* Layout styles */
	.story-block.layout-2,
	.story-block.layout-1 {
		align-items: center;
	}

	@container (min-width: 768px) {
		/* on mobile display image on top of text */
		.story-block.layout-2 > div:first-child {
			order: 2;
		}
		.story-block.layout-2 > div:last-child {
			order: 1;
		}
	}

	.story-block.layout-3 > div:first-child {
		grid-column: 1 / 3;
		grid-row: 1 / 2;
	}

	.story-block.layout-3 > div:last-child {
		grid-column: 1 / 3;
		grid-row: 2 / 3;
	}

	.accented {
		@apply bg-primary py-10 pr-6 pl-6 md:py-0 md:pr-0 md:pl-20;
	}
</style>
