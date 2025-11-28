<script lang="ts">
	import Field from '$lib/components/Field.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	// import * as Google from '@googlemaps/js-api-loader';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import {
		PUBLIC_GOOGLE_API_KEY,
		PUBLIC_HCAPTCHA_SITEKEY,
		PUBLIC_MAP_ID
	} from '$env/static/public';
	import Mail from '$icons/IconMail.svelte';
	import Telephone from '$icons/IconPhone.svelte';
	import Location from '$icons/IconMap.svelte';
	import Clock from '$icons/IconClock.svelte';
	import { dev } from '$app/environment';
	import EntrySession from '$lib/EntrySession.svelte';
	import Svedit from '$lib/Svedit.svelte';
	import Text from '$lib/Text.svelte';
	import TextToolBar from '$lib/TextToolBar.svelte';
	import HeaderBlock from '$lib/HeaderBlock.svelte';
	import { enhance } from '$app/forms';
	import ViewTransition from '$lib/components/ViewTransition.svelte';
	let { data, form }: { data: PageData; form: any } = $props();

	let page_json = $state(data.entry);
	let entry_session = new EntrySession(page_json);

	// const { Loader } = Google;

	let passkey = $state('');
	let showPassKey = $state(false);

	let mapFrame: HTMLElement;
	let apiKey = PUBLIC_GOOGLE_API_KEY;
	let mapId = PUBLIC_MAP_ID;

	let hcaptcha = {
		execute: async (_a, _b) => ({ response: '' }),
		render: (_a, _b) => {}
	};
	let hcaptchaWidgetID;

	onMount(async () => {
		hcaptcha = window.hcaptcha;

		if (hcaptcha.render) {
			hcaptchaWidgetID = hcaptcha.render('hcaptcha', {
				sitekey: PUBLIC_HCAPTCHA_SITEKEY,
				size: 'invisible',
				theme: 'light'
			});
		}
		// const loader = new Loader({
		// 	apiKey: apiKey,
		// 	version: 'weekly',
		// 	libraries: ['maps', 'marker']
		// });
		// let { Map } = await loader.importLibrary('maps');
		// let { AdvancedMarkerElement } = await loader.importLibrary('marker');

		// const position = { lat: -17.743299877834637, lng: 31.076833591709782 };
		// const map = new Map(mapFrame, {
		// 	center: position,
		// 	zoom: 16,
		// 	mapId: mapId,
		// 	disableDefaultUI: true
		// });

		// new AdvancedMarkerElement({
		// 	map: map,
		// 	position: position,
		// 	title: 'Fair-Mark'
		// });

		passkey = crypto.randomUUID();
		showPassKey = true;
	});

	async function handleSubmit({ cancel }) {
		try {
			const { response: token } = await hcaptcha.execute(hcaptchaWidgetID, {
				async: true
			});

			await fetch('/api/verify', {
				method: 'POST',
				body: token
			});
		} catch (error) {
			console.error('Error in contact form submission');
			cancel();
			return;
		}

		return async ({ update }) => {
			await update();
		};
	}
</script>

<svelte:head>
	<script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>
<!-- <ViewTransition></ViewTransition> -->
<div class="demo-wrapper pb-10">
	{#if data.user?.exists}
		<TextToolBar {entry_session} />
	{/if}
	<Svedit {entry_session} editable={data.user?.exists === true} class="flex-column">
		<HeaderBlock editable={data.user?.exists === true} />
	</Svedit>
	<section class="w-full">
		<!-- <div bind:this={mapFrame} class="h-96 w-full overflow-hidden bg-white/10"></div> -->
		<div class="container mx-auto overflow-hidden px-6 py-12">
			<!--  -->
			<div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8">
				<div class="w-full md:w-2/3 lg:w-1/2">
					<form use:enhance={handleSubmit} method="POST">
						<!--  -->
						<Field
							--label-light="oklch(0.19 0.03 127.91)"
							--label-dark="#ffffff"
							--label-bg-dark="oklch(0.19 0.03 127.91)"
							--label-bg-light="#ffffff"
							name="name"
							label="Name"
							{form}
						/>
						<Field
							--label-light="oklch(0.19 0.03 127.91)"
							--label-dark="#ffffff"
							--label-bg-dark="oklch(0.19 0.03 127.91)"
							--label-bg-light="#ffffff"
							name="email"
							label="Email"
							{form}
						/>
						<Field
							--label-light="oklch(0.19 0.03 127.91)"
							--label-dark="#ffffff"
							--label-bg-dark="oklch(0.19 0.03 127.91)"
							--label-bg-light="#ffffff"
							name="subject"
							label="Subject"
							{form}
						/>
						<TextArea
							--label-light="oklch(0.19 0.03 127.91)"
							--label-dark="#ffffff"
							--label-bg-dark="oklch(0.19 0.03 127.91)"
							--label-bg-light="#ffffff"
							name="message"
							label="Message"
							{form}
						/>
						{#if showPassKey}
							<input name="mid" type="text" hidden value={passkey} />
						{/if}
						<div
							id="hcaptcha"
							class="h-captcha mb-4 bg-transparent"
							data-sitekey={PUBLIC_HCAPTCHA_SITEKEY}
						></div>
						<button class="btn btn-primary">Send</button>
					</form>
				</div>
				<div class="flex w-full flex-col md:w-1/3 lg:w-1/2">
					<div class="flex w-fit flex-row space-x-3">
						<div class="w-6">
							<Location />
						</div>
						<div class="mx-2 text-lg">
							<!-- href="https://maps.app.goo.gl/F36"
							target="_blank"
							rel="noreferrer" -->
							<span class="text-base-content no-underline">
								Courtlands<br />
								17 Kier Park<br />
								Ascot<br />
								SL5 7DS<br />
								United Kingdom
							</span>
						</div>
					</div>
					<div class="flex w-fit flex-row space-x-3">
						<div class="w-6">
							<Telephone />
						</div>
						<div class="mx-2 text-lg">
							<a class="text-base-content no-underline" href="tel:+263 771 387 703">
								+263 771 387 703
							</a>
						</div>
					</div>
					<div class="flex w-fit flex-row space-x-3">
						<div class="w-6">
							<Mail />
						</div>
						<div class="mx-2 text-lg">
							<a class="text-base-content no-underline" href="mailto:info@vergefresh.com">
								info@vergefresh.com
							</a>
						</div>
					</div>
					<div class="flex w-fit flex-row space-x-3">
						<div class="w-6">
							<Clock />
						</div>
						<div class="mx-2 text-lg">
							<div class="text-base-content">Mon-Fri 8:00 AM - 5:00 PM</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
