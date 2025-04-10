import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return new Response();
};

export const PUT: RequestHandler = async ({ request, locals, url }) => {
  const session = await request.json();
  const route = url.searchParams.get('route')?.replaceAll('_-_', '/') || '';
  console.log({ route });

  try {
    const page = await prisma.page.upsert({
      where: { id: session.id },
      update: { entry: JSON.stringify(session) },
      create: { entry: JSON.stringify(session), status: 'published', route, project:"vergefresh" }
    });
    return json({ success: true, page });
  } catch (error) {
    console.error(error);
    return json({ success: false, page: null });
  }
};
