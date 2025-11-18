<script>
	import { fly, slide } from 'svelte/transition';
	import Icon from '$lib/Icon.svelte';
	import ArtworkImage from './components/ArtworkImage.svelte';
	import Gallery from './components/Gallery.svelte';
	import { page } from '$app/stores';
	import { stopPropagation } from 'svelte/legacy';

	let { entry_session } = $props();

	const layout_options = [
		{ value: 1, label: 'Image left', icon: 'image-left' },
		{ value: 2, label: 'Image right', icon: 'image-right' },
		{ value: 3, label: 'Image top', icon: 'image-at-top' }
	];

	const list_style_options = [
		{ value: 'square', label: 'Square', icon: 'square' },
		{ value: 'disc', label: 'Disc', icon: 'disc' },
		{
			value: 'decimal-leading-zero',
			label: 'Decimal leading zero',
			icon: 'list-decimal-leading-zero'
		},
		// { value: 'decimal', label: 'Decimal', icon: 'list-decimal' },
		{ value: 'lower-latin', label: 'Lower latin', icon: 'list-lower-latin' },
		// { value: 'lower-roman', label: 'Lower roman', icon: 'list-lower-roman' },
		// { value: 'upper-latin', label: 'Upper latin', icon: 'list-upper-latin' },
		{ value: 'upper-roman', label: 'Upper roman', icon: 'list-upper-roman' }
	];
	const s = $derived(entry_session.selection?.type);
	const b = $derived(entry_session.selected_block?.type);
	let modals = $state(false);
	let row = $state(true);
	let blockTypes = $state(false);
	let lightboxEditor = $state(false);
	let imageGrid = $state([]);
	let imageUri = $state('');
	let slideTitle = $state('');
	let slideDescription = $state('');
	let slideAlt = $state('');
	let selectedBlockType = $state('');
	let brandName = $state('');
	let imageUrl = $state('');
	let galleryTab = $state('aws');
	let Uploader;
	let currentImage = $state('');
	let saving = $state(false);
	let saved = $state(false);
	let savedError = $state(false);
	let post = $state({ _id: 'x' });

	function handle_layout_change(layout_index) {
		const selected_block_path = entry_session.selected_block_path;

		if (selected_block_path) {
			entry_session.set([...selected_block_path, 'layout'], layout_index);
		}
	}

	function handle_class_change(classes) {
		const selected_block_path = entry_session.selected_block_path;
		console.log(selected_block_path);

		if (selected_block_path) {
			entry_session.set([...selected_block_path, 'classes'], classes);
		}
	}

	function handle_type_change(type, append) {
		const selected_block_path = entry_session.selected_block_path;
		console.log(selected_block_path);

		if (selected_block_path) {
			entry_session.set([...selected_block_path, 'type'], type);
			entry_session.set([...selected_block_path, 'classes'], '');
			if (type === 'brand') {
				entry_session.set([...selected_block_path, 'image'], imageUrl);
				entry_session.set([...selected_block_path, 'brand'], brandName);
				entry_session.set([...selected_block_path, 'layout'], 2);
			} else if (type === 'lightbox_grid') {
				const block = entry_session.get_selected_block();
				entry_session.set([...selected_block_path, 'layout'], 1);
				if (!block?.images) {
					entry_session.set([...selected_block_path, 'images'], []);
				}
			} else if (type === 'story_list' || type === 'list') {
				const block = entry_session.get_selected_block();
				entry_session.set([...selected_block_path, 'layout'], 1);
				if (!block?.items) {
					entry_session.set(
						[...selected_block_path, 'items'],
						[
							{
								type: 'list_item',
								description: ['Edit list item', []]
							}
						]
					);
				}
				if (!block?.list_style) {
					entry_session.set([...selected_block_path, 'list_style'], 'decimal-leading-zero');
				}
			} else if (type === 'list') {
				//
			}
		}
	}

	function handle_save_grid(grid) {
		const selected_block_path = entry_session.selected_block_path;
		console.log(selected_block_path);

		if (selected_block_path) {
			entry_session.set([...selected_block_path, 'images'], grid);
		}
	}

	// console.log($page);

	function handle_image_change(imageKey, size = '800x600') {
		const selected_block_path = entry_session.selected_block_path;
		//const imageUrl = `${$page.data.cloudfront}/fit-in/${size}/${imageKey}`;
		const imageUrl = `${imageKey}`;
		if (selected_block_path) {
			entry_session.set([...selected_block_path, 'image'], imageUrl);
		}
	}
	function handle_image_uri(imageKey) {
		const selected_block_path = entry_session.selected_block_path;
		const imageUrl = `${imageKey}`;

		if (selected_block_path) {
			entry_session.set([...selected_block_path, 'image'], imageUrl);
		}
	}

	function handle_list_style_change(list_style) {
		const block = entry_session.selected_block;
		if (block) {
			block.list_style = list_style;
		}
	}

	function insert_link() {
		// if the user cancels the prompt it will use the previous link
		const current_link =
			entry_session.active_annotation()?.[2] === 'link'
				? entry_session.active_annotation()[3].href
				: '';

		const new_url = window.prompt('Enter the URL', current_link);

		// Update if the user didn't cancel the prompt
		if (new_url !== null) {
			entry_session.annotate_text('link', {
				href: new_url // Pass the new_url directly, even if it's an empty string
			});
		}
	}

	async function handle_save_session() {
		saving = true;
		const id = entry_session.entry.id;
		const session = JSON.stringify(entry_session.entry);
		console.log({ id, session });
		const res = await fetch(`/api/pages/?route=${$page.url.pathname.replaceAll('/', '_-_')}`, {
			method: 'PUT',
			body: session
		});
		const op = await res.json();
		saving = false;
		if (op.success) {
			saved = true;
		} else {
			savedError = true;
		}
	}

	function lightboxEditorInit() {
		const block = entry_session.get_selected_block();

		imageGrid = block?.images || [];
	}

	// $inspect(modals);
	// $inspect(row);
</script>

<div
	class="editor-toolbar max-h-[95vh] p-1"
	in:fly={{ duration: 100, y: 5 }}
	out:fly={{ duration: 100, y: 5 }}
>
	{#if s === 'container'}
		<button
			title="Move up"
			onclick={() => entry_session.move_up()}
			disabled={entry_session.selection.anchor_offset === 0}
		>
			<Icon name="arrow-up-tail" />
		</button>
		<button
			title="Move down"
			onclick={() => entry_session.move_down()}
			disabled={Math.max(
				entry_session.selection.anchor_offset,
				entry_session.selection.focus_offset
			) === entry_session.get(entry_session.selection.path).length}
		>
			<Icon name="arrow-down-tail" />
		</button>
	{/if}
	<!-- Swap -->
	{#if s === 'container'}
		<div class:dropdown-open={blockTypes} class="dropdown dropdown-right">
			<div
				onclick={() => (blockTypes = !blockTypes)}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						blockTypes = !blockTypes;
					}
				}}
				tabindex="0"
				role="button"
				class="btn btn-circle btn-ghost btn-sm"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
					/>
				</svg>
			</div>
			<div
				tabindex="-1"
				class=" dropdown-content rounded-box bg-base-content text-base-100 z-[1] mb-2 ml-4 w-52 p-2 shadow"
			>
				<div>
					<button onclick={() => (selectedBlockType = 'brand')} class="btn btn-ghost btn-xs"
						>Brand</button
					>
					{#if selectedBlockType === 'brand'}
						<div class="flex w-full flex-col space-y-1">
							<input
								bind:value={brandName}
								type="text"
								onkeydown={(e) => {
									e.stopPropagation();
								}}
								class="input input-xs bg-gray-200"
								placeholder="brand"
							/>
							<input
								bind:value={imageUrl}
								type="text"
								class="input input-xs bg-gray-200"
								onkeydown={(e) => {
									e.stopPropagation();
								}}
								placeholder="image url"
							/>
							<button
								onclick={(e) => {
									handle_type_change('brand', { image: imageUrl, brand: brandName, classes: '' });
									imageUrl = '';
									brandName = '';
									selectedBlockType = '';
									blockTypes = false;
									//e.stopPropagation();
								}}
								disabled={!brandName || !imageUrl}
								class="btn btn-xs bg-blue-900">Save</button
							>
						</div>
					{/if}
				</div>
				<div>
					<button
						onclick={() => {
							handle_type_change('lightbox_grid');
						}}
						class="btn btn-ghost btn-xs">Lightbox Grid</button
					>
				</div>
				<div>
					<button
						onclick={() => {
							handle_type_change('image');
						}}
						class="btn btn-ghost btn-xs">Image Only</button
					>
				</div>
				<div>
					<button
						onclick={() => {
							handle_type_change('text');
						}}
						class="btn btn-ghost btn-xs">Text Only</button
					>
				</div>
				<div>
					<button
						onclick={() => {
							handle_type_change('list');
						}}
						class="btn btn-ghost btn-xs">List Only</button
					>
				</div>
				<div>
					<button
						onclick={() => {
							handle_type_change('richtext');
						}}
						class="btn btn-ghost btn-xs">Heading & Text</button
					>
				</div>
				<div>
					<button
						onclick={() => {
							handle_type_change('story_list');
						}}
						class="btn btn-ghost btn-xs">Story List Block</button
					>
				</div>
				<div>
					<button
						onclick={() => {
							handle_type_change('story');
						}}
						class="btn btn-ghost btn-xs">Story Block</button
					>
				</div>
			</div>
		</div>
	{/if}
	{#if s === 'text'}
		<button
			title="Bold"
			class="bold"
			onclick={() => entry_session.annotate_text('strong')}
			disabled={entry_session.active_annotation() &&
				entry_session.active_annotation()?.[2] !== 'strong'}
			class:active={entry_session.active_annotation() &&
				entry_session.active_annotation()?.[2] === 'strong'}
		>
			<Icon name="bold" />
		</button>
		<button
			title="Italic"
			class="italic"
			onclick={() => entry_session.annotate_text('emphasis')}
			disabled={entry_session.active_annotation() &&
				entry_session.active_annotation()?.[2] !== 'emphasis'}
			class:active={entry_session.active_annotation() &&
				entry_session.active_annotation()?.[2] === 'emphasis'}
		>
			<Icon name="italic" />
		</button>
		<button
			title="Link"
			onclick={insert_link}
			disabled={entry_session.active_annotation() &&
				entry_session.active_annotation()?.[2] !== 'link'}
			class:active={entry_session.active_annotation() &&
				entry_session.active_annotation()?.[2] === 'link'}
		>
			<Icon name="link" />
		</button>
	{/if}
	<!-- Lightbox -->
	{#if s === 'container' && (b === 'lightbox_grid' || b === 'team_grid')}
		<div
			onclick={() => {
				console.log({ lightboxEditor });

				lightboxEditor = true;
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					lightboxEditor = !lightboxEditor;
				}
			}}
			tabindex="0"
			role="button"
			class:dropdown-open={lightboxEditor}
			class="dropdown dropdown-right"
		>
			<div class="btn btn-circle btn-ghost btn-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
			</div>
			<ul
				tabindex="-1"
				class="menu dropdown-content rounded-box bg-base-content text-base-100 z-[1] mb-2 ml-4 w-52 p-2 shadow"
			>
				<li>
					{#if lightboxEditor}
						<div
							use:lightboxEditorInit
							transition:slide
							class="flex max-h-72 w-full flex-col overflow-auto"
						>
							<div class="w-full">
								{#each imageGrid as image}
									<div class="w-full">
										<div class="aspect-square w-24">
											<img
												src="{$page.data.cloudfront}/fit-in/150x150/{image.url}"
												alt={image.alt || image.title}
												class="h-full w-full object-cover object-center"
											/>
										</div>
										<div>
											{image.title}
										</div>
									</div>
								{:else}
									No slides found.
								{/each}
							</div>
							<!--  -->
							<ArtworkImage
								on:saveSelected={(e) => {
									console.log('save selected', e.detail);
									currentImage = e.detail.image.name;
									console.log(currentImage);
								}}
								{post}
								bind:this={Uploader}
								on:modal={() => (modals = true)}
							/>

							<div class="flex flex-col space-y-1">
								<span class="text-xs">
									{currentImage}
								</span>
								<input
									bind:value={slideTitle}
									type="text"
									class="input input-xs bg-gray-200"
									onkeydown={(e) => {
										e.stopPropagation();
									}}
									placeholder="title"
								/>
								<textarea
									bind:value={slideDescription}
									type="text"
									class="textarea textarea-xs bg-gray-200"
									onkeydown={(e) => {
										e.stopPropagation();
									}}
									placeholder="Description"
								></textarea>
								<input
									bind:value={slideAlt}
									type="text"
									class="input input-xs bg-gray-200"
									onkeydown={(e) => {
										e.stopPropagation();
									}}
									placeholder="alt"
								/>
								<button
									onclick={(e) => {
										imageGrid.push({
											id: crypto.randomUUID(),
											title: slideTitle,
											description: slideDescription,
											alt: slideAlt,
											url: currentImage
										});
										handle_save_grid($state.snapshot(imageGrid));
										currentImage = '';
										slideTitle = '';
										slideDescription = '';
										slideAlt = '';
										post = { _id: 'x' };
									}}
									disabled={!currentImage}
									class="!btn !btn-xs">Add</button
								>
								<div class="p-2"></div>
								<button
									onclick={(e) => {
										//
									}}
									class="!btn !btn-xs">Save</button
								>
							</div>
						</div>
						<!-- <button
            onclick={() => {
              if (!currentImage) return;
              handle_image_change(currentImage);
            }}
            class="btn btn-primary"
          >
            Save image
          </button> -->
					{/if}
				</li>
			</ul>
		</div>
	{/if}
	{#if s === 'container' && (b === 'story' || b === 'brand' || b === 'story_list' || b === 'story_video' || b === 'richtext' || b === 'text' || b === 'image')}
		{#each layout_options as option}
			<button
				onclick={() => handle_layout_change(option.value)}
				class:active={entry_session.selected_block.layout === option.value}
			>
				<Icon name={option.icon} />
			</button>
		{/each}
		{#if entry_session.selected_block.classes.includes('accented')}
			<button
				aria-label="remove accent"
				onclick={() => handle_class_change('')}
				class:active={entry_session.selected_block.classes.includes('accented')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
					/>
				</svg>
			</button>
		{:else}
			<button
				aria-label="add accent"
				onclick={() => handle_class_change('accented')}
				class:active={entry_session.selected_block.classes.includes('accented')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
					/>
				</svg>
			</button>
		{/if}

		<div tabindex="0" role="button" class:dropdown-open={row} class="dropdown dropdown-right">
			<div
				onclick={() => (row = !row)}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						row = !row;
					}
				}}
				class="btn btn-circle btn-ghost btn-sm"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
			</div>
			<ul
				tabindex="-1"
				class="menu dropdown-content rounded-box bg-base-content text-base-100 z-[1] mb-2 ml-4 w-52 p-2 shadow"
			>
				<li>
					{#if row}
						<div transition:slide class="h-full w-full">
							<!--  -->
							<ArtworkImage
								on:saveSelected={(e) => {
									console.log('save selected', e.detail);
									currentImage = e.detail.image.name;
									console.log(currentImage);
									if (!currentImage) return;
									handle_image_change(currentImage);
									row = false;
								}}
								bind:this={Uploader}
								on:modal={() => (modals = true)}
							/>
						</div>
						<div class="flex w-full flex-col space-y-1">
							<input
								class="input input-primary input-xs text-base-content w-full"
								placeholder="url..."
								bind:value={imageUri}
								type="text"
							/>
							<button
								onclick={(e) => {
									currentImage = imageUri;
									if (!currentImage) return;
									handle_image_uri(currentImage);
									row = false;
									(currentImage = ''), (imageUri = '');
								}}
								disabled={!imageUri}
								class="btn btn-primary !btn-xs w-full">Save image</button
							>
						</div>
						<!-- <button
							onclick={() => {
								if (!currentImage) return;
								handle_image_change(currentImage);
							}}
							class="btn btn-primary"
						>
							Save image
						</button> -->
					{/if}
				</li>
			</ul>
		</div>
	{/if}
	{#if s === 'container' && (b === 'list' || b === 'story_list')}
		<hr />
		{#each list_style_options as option}
			<button
				onclick={() => handle_list_style_change(option.value)}
				class:active={entry_session.selected_block.list_style === option.value}
			>
				<Icon name={option.icon} />
			</button>
		{/each}
	{/if}

	{#if entry_session.selection?.type === 'text' || (entry_session.selection?.type === 'container' && entry_session.selected_block?.type === 'story') || (entry_session.selection?.type === 'container' && entry_session.selected_block?.type === 'list')}
		<hr />
	{/if}
	<button
		title="Undo"
		onclick={() => entry_session.undo()}
		disabled={entry_session.history.length === 0}
	>
		<Icon name="rotate-left" />
	</button>
	<button
		title="Redo"
		onclick={() => entry_session.redo()}
		disabled={entry_session.future.length === 0}
	>
		<Icon name="rotate-right" />
	</button>
	<button onclick={handle_save_session} aria-label="save">
		{#if !saving}
			<svg class="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z"
					fill="#212121"
				/>
			</svg>
		{:else}
			<span class="loading loading-spinner"></span>
		{/if}
	</button>
</div>

<input bind:checked={modals} type="checkbox" id="gallaries-modal" class="modal-toggle z-10" />
<div class="modal">
	<div class="modal-box relative w-4/5 max-w-none">
		<label for="gallaries-modal" class="btn btn-circle btn-sm absolute top-2 right-2">✕</label>
		<!-- <div class="tabs">
			<button
				class:tab-active={galleryTab === 'unsplash'}
				id="unsplash"
				on:click={toggleGallery}
				class="tab tab-lifted">Unsplash</button
			>
			<button
				class:tab-active={galleryTab === 'envato'}
				id="envato"
				on:click={toggleGallery}
				class="tab tab-lifted">Envato</button
			>
			<button
				class:tab-active={galleryTab === 'aws'}
				id="aws"
				on:click={toggleGallery}
				class="tab tab-lifted">Gallery</button
			>
		</div> -->
		<h4 class="mb-4 text-xl font-bold">Media Gallery</h4>
		{#if galleryTab === 'unsplash'}
			<!-- <Unsplash on:select={handleSelectFeatured} /> -->
		{:else if galleryTab === 'envato'}
			<!-- <Envato on:select={handleSelectFeatured} /> -->
		{:else if galleryTab === 'aws'}
			<Gallery
				on:select={(e) => {
					console.log('selected', e.detail);
					currentImage = e.detail.image.key;
					console.log(currentImage);
					if (!currentImage) return;
					if (!lightboxEditor) handle_image_change(currentImage);
					modals = false;
					row = false;
					post = { ...post, image: currentImage };
				}}
				items={$page.data.gallery}
				on:upload={() => {
					Uploader.handleUpload();
					modals = false;
				}}
			/>
		{/if}
	</div>
</div>

<style>
	.editor-toolbar {
		color: var(--primary-text-color);
		background-color: var(--canvas-fill-color);
		width: fit-content;
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		left: var(--s-4);
		border-radius: 9999px;
		box-shadow: var(--shadow-2);
		display: flex;
		z-index: 50;
		flex-direction: column;
		align-items: center;
		-ms-overflow-style: none; /* Internet Explorer 10+ */
		scrollbar-width: none; /* Firefox */

		@media (max-width: 768px) {
			top: auto;
			bottom: var(--s-4);
			left: 50%;
			transform: translateX(-50%);
			flex-direction: row;
			max-width: calc(100vw - 2 * var(--s-4));
			overflow-x: auto;
			scrollbar-width: thin;
		}

		button {
			height: 100%;
			min-height: 44px;
			--icon-color: var(--primary-text-color);
			position: relative;
			&.active {
				color: var(--editing-stroke-color);
				--icon-color: var(--editing-stroke-color);
			}
		}
		hr {
			background-color: var(--stroke-color);
			width: 100%;
			height: 1px;
			border: none;
			margin-block: var(--s-2);
			@media (max-width: 768px) {
				width: 1px;
				height: 100%;
				margin-inline: var(--s-2);
			}
		}
	}

	.editor-toolbar::-webkit-scrollbar {
		display: none; /* Safari and Chrome */
	}
</style>
