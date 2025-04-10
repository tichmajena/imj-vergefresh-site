<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Logo from '../lib/assets/Logo.svelte';
	import Mail from '$icons/IconMail.svelte';
	import Telephone from '$icons/IconPhone.svelte';
	import Location from '$icons/IconMap.svelte';
	import Clock from '$icons/IconClock.svelte';
	import { toTitleCase } from '$lib/js/utils';
	import IconInstagram from '$icons/IconInstagram.svelte';
	import IconYoutube from '$icons/IconYoutube.svelte';
	import IconFacebook from '$icons/IconFacebook.svelte';
	import { fade, fly, slide } from 'svelte/transition';

	let { children, socials, url } = $props();

	let title = '',
		image = '',
		slug = '';
</script>

<div data-theme={$page.data.theme} class="drawer drawer-end !bg-base-100">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar bg-base-100 container mx-auto w-full">
			<div class="mr-2 flex-1 pr-2">
				<a href="/"> <Logo></Logo></a>
			</div>
			<div class="hidden flex-none lg:block">
				<ul class="menu menu-horizontal">
					<!-- Navbar menu content here -->
					<li><a class="text-base-content no-underline" href="/">Home</a></li>
					<li><a class="text-base-content no-underline" href="/about">About</a></li>
					<li><a class="text-base-content no-underline" href="/team">Team</a></li>
					<!-- <div class="dropdown dropdown-end dropdown-hover">
						<div tabindex="0" role="button" class="the-drop">Brands</div>
						<ul
							tabindex="-1"
							class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
						>
							<li>
								<a href="/" class="text-base-content no-underline"> Drop</a>
							</li>

							<li>
								<a href="/brands" class="text-base-content no-underline"> All brands</a>
							</li>
						</ul>
					</div> -->
					<!-- <li>
						<a class="text-base-content no-underline" href="/about">Resources</a>
					</li> -->
					<li><a class="text-base-content no-underline" href="/contact">Contact</a></li>

					<form
						use:enhance
						action="/?/setTheme&theme={$page.data.theme === 'dark' ? 'light' : 'dark'}"
						method="post"
					>
						<button
							class="the-drop swap swap-rotate relative flex size-8 items-center justify-center !rounded-full border-0 ring-0 outline-none hover:bg-transparent"
						>
							<!-- this hidden checkbox controls the state -->
							<input type="checkbox" class="sr-only" />

							<!-- sun icon -->
							<svg
								class:swap-on={$page.data.theme === 'light'}
								class:swap-off={$page.data.theme === 'dark'}
								class="absolute right-2 h-4 w-4 fill-current"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
								/>
							</svg>

							<!-- moon icon -->
							<svg
								class:swap-on={$page.data.theme === 'dark'}
								class:swap-off={$page.data.theme === 'light'}
								class="absolute right-2 h-4 w-4 fill-current"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
								/>
							</svg>
						</button>
					</form>
				</ul>
			</div>
			<div class="flex-none pr-6 lg:hidden">
				<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
		</div>

		<!-- Page content here -->
		{@render children()}
		{@render footer()}
	</div>

	{#snippet footer()}
		<!-- <footer class=" -mt-1 w-full bg-[#006838] p-10 text-white">
			<div class="footer container mx-auto">
				<nav>
					<h6 class="footer-title">Contact</h6>
					<div class="flex flex-col text-xs">
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Location />
							</div>
							<div class="mx-2 text-lg font-medium">
								<a
									href="https://maps.app.goo.gl/F3Lx27MAjX8Y8WfN6"
									target="_blank"
									class="text-sm text-white no-underline"
									rel="noreferrer"
								>
									Stand 479 Pomona, Harare Drive<br /> Harare, Zimbabwe
								</a>
							</div>
						</div>
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Telephone />
							</div>
							<div class="mx-2 text-lg font-medium">
								<a class="text-sm text-white no-underline" href="tel:+263 771 387 703">
									+263 771 387 703
								</a><br />
								<a class="text-sm text-white no-underline" href="tel:+263 771 637 769">
									+263 771 637 769
								</a><br />
								<a class="text-sm text-white no-underline" href="tel:+263 771 600 124">
									+263 771 600 124
								</a><br />
							</div>
						</div>
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Mail />
							</div>
							<div class="mx-2 text-lg font-medium">
								<a class="text-sm text-white no-underline" href="mailto:info@kuminda.net">
									info@kuminda.net
								</a>
							</div>
						</div>
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Clock />
							</div>
							<div class="mx-2 text-lg font-medium">
								<div class="text-sm text-white no-underline">Mon-Fri 8:00 AM - 5:00 PM</div>
							</div>
						</div>
					</div>
				</nav>
				<nav>
					<h6 class="footer-title">About</h6>
					<a href="/about" class="link-hover link text-[--light]">About</a>
				</nav>
				<nav>
					<h6 class="footer-title">Company</h6>
					<a href="/" class="link-hover link text-[--light]">Home</a>
					<a href="/about" class="link-hover link text-[--light]">Approach</a>
					<a href="/about" class="link-hover link text-[--light]">Our Story</a>
					<a href="/about" class="link-hover link text-[--light]">Team</a>
					<a href="/contact" class="link-hover link text-[--light]">Contact</a>
				</nav>

				<nav>
					<h6 class="footer-title">Social</h6>
					<div class="grid grid-flow-col gap-4 text-[--light]">
						<a aria-label="instagram" href={socials.instagram} target="_blank">
							<IconInstagram />
						</a>
						<a aria-label="youtube" href={socials.youtube} target="_blank">
							<IconYoutube />
						</a>
						<a aria-label="facebook" href={socials.facebook} target="_blank">
							<IconFacebook />
						</a>
					</div>
				</nav>
			</div>
		</footer> -->
		<footer class="footer sm:footer-horizontal bg-base-300 text-base-content p-10">
			<nav>
				<h6 class="footer-title">Services</h6>
				<a class="link link-hover">Branding</a>
				<a class="link link-hover">Design</a>
				<a class="link link-hover">Marketing</a>
				<a class="link link-hover">Advertisement</a>
			</nav>
			<nav>
				<h6 class="footer-title">Company</h6>
				<a class="link link-hover">About us</a>
				<a class="link link-hover">Contact</a>
				<a class="link link-hover">Jobs</a>
				<a class="link link-hover">Press kit</a>
			</nav>
			<nav>
				<h6 class="footer-title">Social</h6>
				<div class="grid grid-flow-col gap-4">
					<a>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="fill-current"
						>
							<path
								d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
							></path>
						</svg>
					</a>
					<a>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="fill-current"
						>
							<path
								d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
							></path>
						</svg>
					</a>
					<a>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="fill-current"
						>
							<path
								d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
							></path>
						</svg>
					</a>
				</div>
			</nav>
		</footer>
	{/snippet}

	<div class="drawer-side">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-80 bg-[#006838] p-4 text-white">
			<!-- Sidebar content here -->
			<li><a class="no-underline" href="/">Home</a></li>
			<li><a class="no-underline" href="/about">About</a></li>
			<li><a class="no-underline" href="/team">Team</a></li>
			<!-- <li><a class="no-underline" href="/showroom">Packhouse</a></li> -->
			<li><a class="no-underline" href="/contact">Contact</a></li>
		</ul>
	</div>
</div>

<style>
	.the-drop {
		position: relative;
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: stretch;
		border-radius: var(--rounded-btn, 0.5rem);
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		text-align: start;
		transition-property:
			color,
			background-color,
			border-color,
			text-decoration-color,
			fill,
			stroke,
			opacity,
			box-shadow,
			transform,
			filter,
			-webkit-backdrop-filter;
		transition-property:
			color, background-color, border-color, text-decoration-color, fill, stroke, opacity,
			box-shadow, transform, filter, backdrop-filter;
		transition-property:
			color,
			background-color,
			border-color,
			text-decoration-color,
			fill,
			stroke,
			opacity,
			box-shadow,
			transform,
			filter,
			backdrop-filter,
			-webkit-backdrop-filter;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
		transition-duration: 200ms;
		text-wrap: balance;
	}

	.the-drop:hover {
		background-color: var(--fallback-bc, oklch(var(--bc) / 0.1));
	}
</style>
