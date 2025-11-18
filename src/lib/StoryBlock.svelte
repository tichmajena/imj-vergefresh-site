<script>
	import { getContext } from 'svelte';
	import Text from '$lib/Text.svelte';
	import ListItemBlock from './ListItemBlock.svelte';
	import Container from './Container.svelte';

	const svedit = getContext('svedit');

	let { path, h = 'h3', p = 'p', editable = true, cloudfront } = $props();

	let block = $derived(svedit.entry_session.get(path));
	let list_style = $derived(block.list_style);

	import Icon from '$lib/IconHandler.svelte';
	$inspect(editable);
</script>

<div
	class="story-block layout-{block.layout} {block.classes} container mx-auto grid w-full"
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
>
	<div class="non-text-content relative overflow-hidden" contenteditable="false">
		<!-- svelte-ignore a11y_img_redundant_alt -->

		<img
			class:reduce-width={block.image.indexOf('.svg') > -1}
			src="{cloudfront}/fit-in/800x600/{block.image}"
			alt={svedit.entry_session.get([...path, 'title'])[0]}
		/>
		<div class="absolute top-0 right-0 bottom-0 left-0 bg-black/30"></div>
		<div class="absolute top-0 right-0 bottom-0 left-0 opacity-40 {block.classes}"></div>
	</div>

	<div class="caption px-6 pt-6 pb-12 md:px-12">
		<!-- <Icon icon={block.icon} class="mb-4 w-12"></Icon> -->
		<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
		<Text class="heading2 text-green-800" path={[...path, 'title']} {editable} element={h} />
		<Text class="body font-light" path={[...path, 'description']} {editable} element={p} />
		<Container class="list" path={[...path, 'items']}>
			<!-- NOTE: We only allow list items inside list  -->
			{#snippet block(block, path)}
				<ListItemBlock {block} {path} {list_style} />
			{/snippet}
		</Container>
	</div>
</div>

<style>
	@reference '../app.css';

	.story-block {
		container-type: inline-size;
		grid-template-columns: 1fr;
		/* Apply padding on the sides of the block, but only on devices that need it, e.g. iPhone with notch */
		/* Learn more about this technique here: https://kulturbanause.de/blog/websites-fuer-das-iphone-x-optimieren-weisse-balken-entfernen-viewport-anpassen-safe-area-festlegen/ */
		/* padding-inline-start: max(var(--s-10), env(safe-area-inset-left, 0px));
    padding-inline-end: max(var(--s-10), env(safe-area-inset-right, 0px)); */
		/*  padding-block-start: max(var(--s-10), env(safe-area-inset-top, 0px));
		padding-block-end: max(var(--s-10), env(safe-area-inset-bottom, 0px)); */
		@media (min-width: 768px) {
			grid-template-columns: 1fr 1fr;
		}
		/* gap: var(--s-10);*/
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
		@apply bg-[--accented] px-8;
	}

	.reduce-width {
		@apply !w-1/2;
	}

	.bg-farm-green-100 {
		@apply bg-farm-green-100;
	}
	.bg-farm-green-200 {
		@apply bg-farm-green-200;
	}
	.bg-farm-green-300 {
		@apply bg-farm-green-300;
	}
	.bg-farm-green-400 {
		@apply bg-farm-green-400;
	}
	.bg-farm-brown {
		@apply bg-farm-brown;
	}
	.bg-farm-gold {
		@apply bg-farm-gold;
	}
</style>
