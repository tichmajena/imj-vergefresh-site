import { sendMail } from '$lib/server/aws';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ContactMessage } from '$lib/js/zod';
import { zodValidationErrors } from '$lib/js/utils';
import { prisma } from '$lib/server/prisma';
import { page_json_clean } from '$lib/server/utils';

export const load = (async () => {
	console.log(await prisma.user.findMany());

	const page = await prisma.page.findFirst({
		where: { route: '/contact', status: 'published', project: 'vergefresh' }
	});
	let entry = JSON.parse(page?.entry || page_json_clean);
	entry = { ...entry, id: page?.id || '' };

	return { entry };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		let formEntries = await request.formData();
		let formDataObj = Object.fromEntries(formEntries) as {
			subject: string;
			message: string;
			email: string;
			name: string;
			mi: string;
		};

		const { mi, ...formData } = formDataObj;
		console.log({ mi });

		if (!mi) {
			fail(401, { success: false });
		}

		try {
			ContactMessage.parse(formData);
		} catch (error) {
			const messages: any = zodValidationErrors(error);
			return fail(401, { messages, success: false, fields: formData });
		}
		let subject = 'From Fair-Mark Website: ' + formData.subject;
		let body = 'Name: ' + formData.name + '\n';
		body += 'Email: ' + formData.email + '\n';
		body += 'Message: ' + '\n';
		body += formData.message;
		let payload = { subject, body };
		const result = await sendMail(payload);

		if (result === null) {
			console.log('Sending Failed');

			return fail(500, { message: 'Sending Failed', success: false });
		} else {
			return { success: true };
		}
	}
};
