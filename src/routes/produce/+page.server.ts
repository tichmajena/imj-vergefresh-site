import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';
import { page_json } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	//fetch pagenfrom prisma and paste on route
	const page = await prisma.page.findFirst({
		where: { route: '/produce', status: 'published', project: 'vergefresh' }
	});

	//parse the entry from json use page_json as fallback
	let entry = JSON.parse(page?.entry || page_json);
	//add id to entry, use empty string as fallback
	entry = { ...entry, id: page?.id || '' };

	return { entry };
}) satisfies PageServerLoad;
