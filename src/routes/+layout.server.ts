import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url, fetch }) => {
	async function getGallery() {
		const res = await fetch('/api/media');
		const media = await res.json();
		// console.log({ media });
		return media;
	}
	const loginForm = url.searchParams.get('edit');
	return {
		...locals,
		showLogin: loginForm === null ? false : true,
		url: url.pathname,
		gallery: getGallery(),
		socials: {
			facebook: '',
			instagram: '',
			linkedin: '',
			x: '',
			youtube: ''
		}
	};
}) satisfies LayoutServerLoad;
