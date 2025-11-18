<script>
	import { getContext } from 'svelte';

	let { path, editable = true, cloudfront } = $props();
	import Text from '$lib/Text.svelte';
	import Field from './components/Field.svelte';
	import TextArea from './components/TextArea.svelte';
	const svedit = getContext('svedit');
	let block = $derived(svedit.entry_session.get(path));
</script>

{#if block.type === 'sign_up' || block.type === 'make_enquiry'}
	<div
		class="story-block layout-{block.layout} {block.classes} container mx-auto w-full"
		data-path={path.join('.')}
	>
		{#if block.type === 'make_enquiry'}
			<div class="w-full">
				<!--  -->
				<form action="" class="bg-inherit">
					<Field
						--label-light="#010827"
						--label-dark="#ffffff"
						--label-bg-dark="#243378"
						--label-bg-light="#E6E6E6"
						name="name"
						label="Name"
					/>
					<Field --label-bg-dark="#243378" --label-bg-light="#E6E6E6" name="email" label="Email" />
					<Field
						--label-light="#010827"
						--label-dark="#ffffff"
						--label-bg-dark="#243378"
						--label-bg-light="#E6E6E6"
						name="subject"
						label="Subject"
					/>
					<TextArea
						--label-light="#010827"
						--label-dark="#ffffff"
						--label-bg-dark="#243378"
						--label-bg-light="#E6E6E6"
						name="message"
						label="Message"
					/>
					<button class="dark-btn btn btn-primary">Send</button>
				</form>
			</div>
		{:else}
			<div class="non-text-content overflow-hidden rounded-xl" contenteditable="false">
				<!-- svelte-ignore a11y_img_redundant_alt -->
				<img
					src="{cloudfront}/fit-in/800x600/{block.image}"
					alt={svedit.entry_session.get([...path, 'title'])[0]}
				/>
			</div>
		{/if}
		<div>
			<div class="caption">
				<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
				<Text class="heading2" path={[...path, 'title']} {editable} />
				<Text class="body" path={[...path, 'description']} {editable} />
			</div>
			{#if block.type === 'sign_up'}
				<form action="" class="mt-4 bg-inherit">
					<Field
						--label-light="#010827"
						--label-dark="#ffffff"
						--label-bg-dark="#010827"
						--label-bg-light="#ffffff"
						name="name"
						label="Name"
					/>
					<Field --label-bg-dark="#010827" --label-bg-light="#ffffff" name="email" label="Email" />
					<Field
						--label-light="#010827"
						--label-dark="#ffffff"
						--label-bg-dark="#010827"
						--label-bg-light="#ffffff"
						name="phone"
						label="Phone"
					/>

					<button class="btn btn-primary">Send</button>
				</form>
			{/if}
		</div>
	</div>
{:else if block.type === 'story_stats'}
	<div
		class:hidden={block.classes.includes('icon')}
		class:grid={!block.classes.includes('icon')}
		class="story-block layout-2 {block.classes} border-y-primary container mx-auto mt-20 w-full border-y-2 px-6"
		data-path={path.join('.')}
		data-type="block"
		data-index={path.at(-1)}
		style="anchor-name: --{path.join('-')};"
	>
		<div class="non-text-content overflow-hidden" contenteditable="false">
			<div class="grid w-full grid-cols-2">
				{#each block.images as stat}
					<div class="flex flex-col space-y-2 pb-10">
						<div class="text-7xl text-[--primary-to-light]">
							{stat.title}
						</div>
						<div class="text-sm font-bold text-[--primary-to-light]">
							{stat.description}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="caption">
			<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
			<Text class="heading2" path={[...path, 'title']} {editable} />
			<Text class="body" path={[...path, 'description']} {editable} />
		</div>
	</div>
{:else}
	<div data-path={path.join('.')} data-type="block">
		Unknown block type {block.type}
	</div>
{/if}

<!-- <div
    class="story-block layout-{block.layout} {block.classes} container mx-auto w-full"
    data-path={path.join('.')}
    data-type="block"
    data-index={path.at(-1)}
    style="anchor-name: --{path.join('-')};"
  >

</div> -->

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
		@apply bg-[--accented] px-8;
	}
	.accented2 {
		@apply bg-[--accented2] px-8;
	}

	:global(.drawer[data-theme='dark']) .dark-btn {
		background-color: var(--dark);
	}
</style>
