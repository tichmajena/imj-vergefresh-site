import { AWS_CLOUDFRONT } from '$env/static/private';
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	/** @type {String|null} */
	let theme = 'light';

	const newTheme = event.url.searchParams.get('theme');
	const cookieTheme = event.cookies.get('colortheme');

	// if (newTheme) {
	// 	theme = newTheme;
	// } else if (cookieTheme) {
	// 	theme = cookieTheme;
	// }
	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	event.locals.theme = theme;
	event.locals.cloudfront = AWS_CLOUDFRONT;

	// Resolve auth session
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event, {
			preload: ({ type }) => {
				return type === 'font' || type === 'css' || type === 'js';
			}
		});
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = { ...user, exists: true };

	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%theme%', theme || 'light')
		});
	}

	return await resolve(event);
};
