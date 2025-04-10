import { signedURL } from '$lib/server/aws';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
	const key = await request.text();
	const bucket = url.searchParams.get('bucket') || undefined;
	console.log({ key, bucket });
	const urls = await signedURL(key, bucket);
	console.log({ urls });
	if (urls) {
		return json(urls);
	} else {
		return json({ success: false, message: 'faild to chakuti the signed url' });
	}
}
