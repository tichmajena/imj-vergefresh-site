import { AWS_CLOUDFRONT } from '$env/static/private';
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

  if (theme) {
    return await resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%theme%', theme || 'light')
    });
  }

  return await resolve(event);
};
