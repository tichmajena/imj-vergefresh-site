import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	return {
		...locals,
		url: url.pathname,

		socials: {
			facebook: '',
			instagram: '',
			linkedin: '',
			x: '',
			youtube: ''
		}
	};
}) satisfies LayoutServerLoad;
