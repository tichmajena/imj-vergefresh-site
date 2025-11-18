<script>
	import { getContext } from 'svelte';
	import Text from '$lib/Text.svelte';
	import ListItemBlock from './ListItemBlock.svelte';
	import Container from './Container.svelte';

	const svedit = getContext('svedit');

	let { path, editable = true, cloudfront } = $props();

	let block = $derived(svedit.entry_session.get(path));
	let list_style = $derived(block.list_style);

	import Icon from '$lib/IconHandler.svelte';
</script>

<div
	class="story-block layout-{block.layout} {block.classes} container mx-auto w-full"
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
>
	<div class=" mx-auto flex w-full max-w-screen-md">
		<div class="relative flex w-20 justify-center">
			<div id="line" class="bg-primary line h-full w-2"></div>
			<div class="bg-primary"></div>
			<div
				class="bg-primary icon-circle absolute mt-2 flex size-6 items-center justify-center rounded-full"
			>
				<span class="icon-image text-white">
					<Icon class="w-8" />
				</span>
			</div>
		</div>

		<div class="caption w-10/12 pr-6 pb-6">
			<!--<Icon class="mb-4 w-12"></Icon>-->
			<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
			<Text
				class="text-primary font-barmeno-bold text-xl font-medium md:text-2xl"
				path={[...path, 'title']}
				{editable}
			/>
			{#if block.description[0].trim() !== ''}
				<Text class="body" path={[...path, 'description']} {editable} />
			{/if}
		</div>
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

	.icon-image {
		@apply hidden;
	}

	.section {
		@apply mt-10;
	}

	.section .icon-circle {
		@apply -mt-1 size-14;
	}
	.section .icon-image {
		@apply flex;
	}
</style>
