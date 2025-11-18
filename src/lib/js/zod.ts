import { z } from 'zod';

export const LoginUser = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.min(3, { message: 'Email is required' })
		.email()
		.max(128),
	password: z
		.string({ required_error: 'Password is required' })
		.min(2, { message: 'Password is required' })
		.max(128)
});

export const CreateUser = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.min(3, { message: 'Email is required' })
			.email()
			.max(128),

		password: z
			.string({ required_error: 'Password is required' })
			.min(2, { message: 'Password is required' })
			.max(128),
		confirmPassword: z
			.string({ required_error: 'Password is required' })
			.min(2, { message: 'Password is required' })
			.max(128)
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmPassword']
			});
		}
	});

// name: z
// .string({ required_error: 'Name is required.' })
// .min(2, { message: 'Name is too short.' })
// .max(128, { message: 'Name is too long.' }),

export const ContactMessage = z.object({
	name: z.string().min(3),
	email: z.string().min(3).email(),
	subject: z.string().min(3),
	message: z.string().min(3)
});
