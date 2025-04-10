import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ fetch }) => {
	
	let page_json = {
		id: '',
		type: 'page',
		title: ['Svedit', []],
		subtitle: [
			'A template for building rich content editors with Svelte 5',
			[[24, 44, 'emphasis']]
		],
		body: [
			{
				type: 'story_list',
				layout: 2,
				classes: '',
				image: '/images/extendable.svg',
				title: ['Alpha version', []],
				description: [
					"Expect bugs. Expect missing features. Expect the need for more work on your part to make this work for your use case.\n\nFind below a list of known issues we'll be working to get fixed next:",
					[]
				],
				list_style: 'decimal-leading-zero',
				items: [
					{
						type: 'list_item',
						description: [
							"Images can not yet be selected and changed. We'll solve this by making any non‑text property selectable on the canvas, and show a popover (e.g. an image selector, or a math formula editor) to make changes, which will then be reflected in the canvas display immediately.",
							[]
						]
					}
					// {
					//   type: 'list_item',
					//   description: [
					//     'Container selections inside nested blocks (e.g. list items in this list) do not work reliably yet.',
					//     []
					//   ]
					// },
					// {
					//   type: 'list_item',
					//   description: [
					//     'Only the latest Chrome is supported at the moment as we rely on CSS Anchor Positioning for overlays.',
					//     []
					//   ]
					// },
					// {
					//   type: 'list_item',
					//   description: [
					//     'Full mobile support is considered in our design, but not yet implemented.',
					//     []
					//   ]
					// }
				]
			},
			{
				type: 'brand',
				layout: 1,
				classes: 'devious',
				brand: 'duravit',
				image: '',
				title: ['Visual in‑place editing', []],
				description: [
					'Model your content in JSON, render it with Svelte components, and edit content directly in the layout. You only have to follow a couple of rules to make this work.',
					[]
				]
			},
			{
				type: 'story',
				layout: 1,
				classes: 'accented devious',
				image: '',
				title: ['Visual in‑place editing', []],
				description: [
					'Model your content in JSON, render it with Svelte components, and edit content directly in the layout. You only have to follow a couple of rules to make this work.',
					[]
				]
			},
			{
				type: 'lightbox_grid',
				layout: 1,
				classes: '',
				image: '',
				images: [
					{ url: '/images/dcode_private.jpg', alt: '', id: '1', size: '36', title: '1' },
					{ url: '/images/dcode_private.jpg', alt: '', id: '2', size: '40', title: '2' },
					{ url: '/images/dcode_private.jpg', alt: '', id: '3', size: '32', title: '3' },
					{ url: '/images/dcode_private.jpg', alt: '', id: '4', size: '44', title: '4' },
					{ url: '/images/dcode_private.jpg', alt: '', id: '5', size: '50', title: '5' },
					{ url: '/images/dcode_private.jpg', alt: '', id: '6', size: '40', title: '6' },
					{ url: '/images/dcode_private.jpg', alt: '', id: '7', size: '48', title: '7' }
				],
				title: ['The Grid Test', []],
				description: [
					"The reference implementation uses only about 1000 lines of code. That means you'll be able to serve editable web pages, removing the need for a separate Content Management System.",
					[[100, 118, 'link', { href: 'https://editable.website' }]]
				]
			},
			{
				type: 'story',
				layout: 2,
				classes: '',
				image: '/images/dcode_private.jpg',
				title: ['Minimal viable editor', []],
				description: [
					"The reference implementation uses only about 1000 lines of code. That means you'll be able to serve editable web pages, removing the need for a separate Content Management System.",
					[[100, 118, 'link', { href: 'https://editable.website' }]]
				]
			},
			{
				type: 'story',
				layout: 1,
				classes: '',
				image: '/images/nested-blocks-illustration.svg',
				title: ['Nested blocks', []],
				description: [
					'A block can embed a container of other blocks. For instance the list block at the bottom of the page has a container of list items.',
					[]
				]
			},
			{
				type: 'story',
				layout: 2,
				classes: '',
				image: '/images/container-cursors.svg',
				title: ['Container cursors', []],
				description: [
					'They work just like text cursors, but instead of a character position in a string they address a block position in a container.\n\nTry it by selecting a few blocks, then press ↑ or ↓. Press ↵ to insert a new block or ⌫ to delete the block before the cursor.',
					[]
				]
			},
			{
				type: 'story',
				layout: 1,
				classes: '',
				image: '/images/svelte-logo.svg',
				title: ['Made for Svelte 5', []],
				description: [
					'Integrate with your Svelte application. Use it as a template and copy and paste Svedit.svelte to build your custom rich content editor.',
					[
						[20, 26, 'link', { href: 'https://svelte.dev/' }],
						[80, 93, 'emphasis', null]
					]
				]
			},
			{
				type: 'story',
				layout: 2,
				classes: '',
				image: '/images/extendable.svg',
				title: ['Alpha version', []],
				description: [
					"Expect bugs. Expect missing features. Expect the need for more work on your part to make this work for your use case.\n\nFind below a list of known issues we'll be working to get fixed next:",
					[]
				]
			},
			{
				type: 'list',
				list_style: 'decimal-leading-zero',
				items: [
					{
						type: 'list_item',
						description: [
							"Images can not yet be selected and changed. We'll solve this by making any non‑text property selectable on the canvas, and show a popover (e.g. an image selector, or a math formula editor) to make changes, which will then be reflected in the canvas display immediately.",
							[]
						]
					},
					{
						type: 'list_item',
						description: [
							'Container selections inside nested blocks (e.g. list items in this list) do not work reliably yet.',
							[]
						]
					},
					{
						type: 'list_item',
						description: [
							'Only the latest Chrome is supported at the moment as we rely on CSS Anchor Positioning for overlays.',
							[]
						]
					},
					{
						type: 'list_item',
						description: [
							'Full mobile support is considered in our design, but not yet implemented.',
							[]
						]
					}
				]
			}
		]
	};
	const page = await prisma.page.findFirst({ where: { route: '/' ,project:"vergefresh"} });
	let entry = JSON.parse(page?.entry || JSON.stringify(page_json));
	entry = { ...entry, id: page?.id || '' };
	async function getGallery() {
		const res = await fetch('/api/media');
		const media = await res.json();
		// console.log({ media });
		return media;
	}
	return { gallery: getGallery(), entry: entry };
}) satisfies PageServerLoad;

export const actions: Actions = {
	setTheme: ({ url, cookies }) => {
		const theme = url.searchParams.get('theme');

		if (theme) {
			cookies.set('colortheme', theme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		}
	}
};
