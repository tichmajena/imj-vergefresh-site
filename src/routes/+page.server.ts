import { prisma } from '$lib/server/prisma';
import { page_json } from '$lib/server/utils';
import type { PageServerLoad, Actions } from './$types';
import { hash, verify } from '@node-rs/argon2';
import { createSession, generateSessionToken, invalidateSession } from '$lib/server/session';
import { getNextDays, zodValidationErrors } from '$lib/js/utils';
import { fail, redirect } from '@sveltejs/kit';
import { CreateUser, LoginUser } from '$lib/js/zod';
import { dev } from '$app/environment';

export const load = (async () => {
	let pageentry: any = {
		id: '4b7ee419-b490-406a-94bb-d3253442aedb',
		type: 'page',
		title: ['About Verge Fresh', []],
		subtitle: [
			'At Verge Fresh, we believe that fresh produce should arrive exactly as nature intended—vibrant, nutritious, and ready to enjoy. Based in the UK, we specialise in importing high‑quality fruits and vegetables from trusted growers around the world.\n\nAt Verge Fresh, our mission is simple: to connect people with produce they can trust. By combining reliability, scale, and uncompromising standards, we help businesses across the UK serve customers with the very best nature has to offer.',
			[[]]
		],
		heading: ['Title', []],
		subheading: ['Title', []],
		sidebar: [
			{
				type: 'story',
				image: '',
				classes: '',
				icon: 'quality-first',
				title: ['Quality First', []],
				description: [
					'Every item we source is carefully selected to meet the highest standards of freshness, flavour, and appearance.',
					[]
				]
			},
			{
				type: 'story',
				image: '',
				classes: '',
				icon: 'well-packaged-protected',
				title: ['Well Packaged & Protected', []],
				description: [
					'Our produce is delivered in secure, well‑designed packaging that preserves quality from farm to table.',
					[]
				]
			},
			{
				type: 'story',
				image: '',
				classes: '',
				icon: 'large-scale-supply',
				title: ['Large‑Scale Supply', []],
				description: [
					'Whether you’re a retailer, wholesaler, or distributor, we provide consistent volumes to meet your business needs.',
					[]
				]
			},
			{
				type: 'story',
				image: '',
				classes: '',
				icon: 'certified',
				title: ['Certified & Compliant', []],
				description: [
					'All our imports are fully certified and adhere to UK and international health and safety regulations, giving you confidence in every delivery.',
					[]
				]
			}
		],
		body: [
			{
				type: 'lightbox_grid',
				image: '/images/container-cursors.svg',
				classes: '',
				icon: '',
				title: ['Enter title', []],
				description: ['Enter a description', []],
				layout: 3,
				images: [
					{
						id: '9281e02b-6383-4c0d-91a1-5655feda8ce6',
						title: 'Quality First',
						description:
							'Every item we source is carefully selected to meet the highest standards of freshness, flavour, and appearance.',
						alt: 'Quality first',
						url: 'quality-first'
					},
					{
						id: '9281e02b-6383-4c0d-91a1-5655feda8ce7',
						title: 'Well Packaged & Protected',
						description:
							'Our produce is delivered in secure, well‑designed packaging that preserves quality from farm to table.',
						alt: 'Well packaged and protected',
						url: 'well-packaged-protected'
					},
					{
						id: '9281e02b-6383-4c0d-91a1-5655feda8ce8',
						title: 'Large‑Scale Supply',
						description:
							'Whether you’re a retailer, wholesaler, or distributor, we provide consistent volumes to meet your business needs.',
						alt: 'Large-scale supply',
						url: 'large-scale-supply'
					},
					{
						id: '9281e02b-6383-4c0d-91a1-5655feda8ce9',
						title: 'Certified & Compliant',
						description:
							'All our imports are fully certified and adhere to UK and international health and safety regulations, giving you confidence in every delivery.',
						alt: 'Certified and compliant',
						url: 'certified'
					}
				]
			}
		]
	};
	pageentry = JSON.stringify(pageentry);
	const page = await prisma.page.findFirst({ where: { route: '/', project: 'vergefresh' } });
	let entry = JSON.parse(page?.entry || page_json);
	entry = { ...entry, id: page?.id || '' };

	return { entry: entry };
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
	},
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		console.log({ email, password });

		try {
			LoginUser.parse({ email, password });
			console.log('RESULT: ', true);
		} catch (error: any) {
			console.log({ email, password });

			console.log('Error: ', error?.errors);

			const messages: any = zodValidationErrors(error);

			console.log(messages);
			return fail(401, {
				success: false,
				email,
				password: '',
				messages
			});
		}
		const errorBody = {
			success: false,
			message: 'Incorrect username or password',
			email,
			password: '',
			messages: {
				email: { msg: ['Incorrect username or password'], code: 'error' },
				password: { msg: ['Incorrect username or password'], code: 'error' }
			}
		};
		try {
			// find user by key
			// and validate password
			//const key = await auth.useKey('email', email.toLowerCase(), password);

			const user = await prisma.user.findUnique({
				where: {
					email: email
				},
				include: {
					password: true
				}
			});

			const hash = user?.password?.hashedPassword as string;
			const validPassword = await verify(hash, password);
			console.log({ validPassword });

			if (!validPassword) {
				return fail(400, errorBody);
			} else if (user && validPassword) {
				const token = generateSessionToken();

				// Do 2 parallel things:
				// 1. Create a session in our db base on the token
				await createSession(token, user?.id);

				// 2. Save the token in a browser cookie so that later..
				// ..we can use it to fetch the session to check if the..
				// ..user's authentication time period has expired or not
				cookies.set('session', token, {
					path: '/',
					sameSite: true,
					secure: dev ? false : true,
					expires: getNextDays()
				});
			}
		} catch (e: any) {
			console.log(e);

			if (e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD') {
				// user does not exist
				// or invalid password
				return fail(400, errorBody);
			}

			if (e.code === 'P1001') {
				return fail(500, {
					message: 'Network Error Occured, check your internet connect.',
					type: 'notice',
					success: false,
					email,
					password: ''
				});
			}
			return fail(500, errorBody);
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		redirect(302, '/');
	},
	signup: async ({ request, cookies }) => {
		const formData = await request.formData();
		const credentials = Object.fromEntries(formData) as {
			email: string;
			password: string;
			confirmPassword: string;
		};
		try {
			CreateUser.parse(credentials);
		} catch (error) {
			console.log({ credentials });

			const messages: any = zodValidationErrors(error);

			console.log(messages);
			return fail(401, {
				success: false,
				email: credentials.email,
				password: '',
				confirmPassword: '',
				messages
			});
		}
		const hashedPassword = await hash(credentials.password);
		const userId = crypto.randomUUID();

		await prisma.user.create({
			data: {
				id: userId,
				role: 'SUPPORT',
				email: credentials.email,
				password: {
					create: {
						hashedPassword
					}
				}
			}
		});
	},
	logout: async ({ cookies }) => {
		const token = cookies.get('session') as string;
		if (token) invalidateSession(token);
		cookies.set('session', '', {
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 0,
			path: '/'
		});
	}
};
