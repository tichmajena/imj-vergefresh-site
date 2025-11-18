import { S3Client } from '@aws-sdk/client-s3';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import type { SendEmailCommandInput } from '@aws-sdk/client-sesv2';

import {
	AWS_BUCKET_NAME,
	AWS_ACCESSKEY,
	AWS_REGION,
	AWS_SECRETKEY,
	EMAIL_TO
} from '$env/static/private';

const REGION = AWS_REGION;
const ACCESS_KEY = AWS_ACCESSKEY;
const SECRET = AWS_SECRETKEY;
const BUCKET = AWS_BUCKET_NAME;

if (!REGION) console.warn('(AWS_REGION) AWS Region not set');
if (!ACCESS_KEY) console.warn('(AWS_ACCESSKEY) AWS Access Key not set');
if (!SECRET) console.warn('(AWS_SECRETKEY) AWS secret Access Key not set');
if (!BUCKET) console.warn('(AWS_BUCKET_NAME) AWS Bucket not set');

const config = {
	credentials: {
		accessKeyId: ACCESS_KEY,
		secretAccessKey: SECRET
		//sessionToken: crypto.randomUUID()
	},
	region: REGION,
	endpoint: 'https://s3.amazonaws.com',
	signatureVersion: 'v4'
};

export async function PresignedGET(key: string, bucket = BUCKET) {
	const { PutObjectCommand } = await import('@aws-sdk/client-s3');
	const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

	const s3 = new S3Client(config);

	const command = new PutObjectCommand({ Key: key, Bucket: bucket });
	try {
		return await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function signedURL(key: string, bucket = BUCKET) {
	console.log(':::Signing', key, bucket);
	const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = await import(
		'@aws-sdk/client-s3'
	);
	const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
	const s3 = new S3Client(config);

	const getcommand = new GetObjectCommand({ Key: key, Bucket: bucket });
	const putcommand = new PutObjectCommand({ Key: key, Bucket: bucket });
	const deletecommand = new DeleteObjectCommand({ Key: key, Bucket: bucket });
	try {
		return {
			get: await getSignedUrl(s3, getcommand, { expiresIn: 60 * 60 * 24 }),
			put: await getSignedUrl(s3, putcommand, { expiresIn: 60 * 60 * 24 }),
			delete: await getSignedUrl(s3, deletecommand, { expiresIn: 60 * 60 * 24 })
		}; // expires in seconds
	} catch (error) {
		console.error(':::Zvadhakwa', error);
		return null;
	}
}

export async function sendMail(payload: { body: string; subject: string }) {
	const client = new SESv2Client({
		credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET },
		region: REGION
	});
	const params: SendEmailCommandInput = {
		Content: {
			Simple: {
				Body: {
					Text: {
						Data: payload.body
					}
				},
				Subject: {
					Data: payload.subject
				}
			}
		},
		Destination: {
			ToAddresses: [EMAIL_TO]
		},
		FromEmailAddress: EMAIL_TO // Replace with a verified email in SES
	};
	const command = new SendEmailCommand(params);

	try {
		const data = await client.send(command);
		return data;
	} catch (error: any) {
		console.error(error.$response);
		return null;
	}
}
