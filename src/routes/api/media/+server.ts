import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '200');
	const source = url.searchParams.get('source');
	const type = url.searchParams.get('type');
	const ext = url.searchParams.get('ext');
	const size_lte = url.searchParams.get('size_lte');
	const size_gte = url.searchParams.get('size_gte');
	const orderby_asc = url.searchParams.get('orderby_asc');
	const orderby_desc = url.searchParams.get('orderby_desc');
	let where: any = { status: 'published', project: 'vergefresh' };
	let orderBy: any = { upatedAt: 'desc' };

	if (type) {
		where = { ...where, type };
	}
	if (source) {
		where = { ...where, source };
	}
	if (ext) {
		where = { ...where, ext };
	}
	if (size_lte) {
		where = { ...where, size: { lte: size_lte } };
	}
	if (size_gte) {
		where = { ...where, size: { gte: size_gte } };
	}

	if (orderby_asc) {
		orderBy = { ...orderBy, [orderby_asc]: 'asc' };
	}
	if (orderby_desc) {
		orderBy = { ...orderBy, [orderby_desc]: 'desc' };
	}

	const images = await prisma.media.findMany({
		where,
		take: limit,
		skip: (page - 1) * limit,
		orderBy
	});
	return json(images);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		let files = data.map((file: any) => {
			return {
        ...file,
        project:'vergefresh'
      };
		});

		const image = await prisma.media.createMany({ data: files });
		return json(image);
	} catch (error) {
		console.error(error);

		return json(null);
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	try {
		await prisma.media.deleteMany({ where: { id: id as string } });
		return json({ success: true });
	} catch (error) {
		return json({ success: false });
	}
};
