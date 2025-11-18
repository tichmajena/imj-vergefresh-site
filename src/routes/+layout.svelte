<script lang="ts">
	import '../app.css';
	import '$lib/styles/spacing.css';
	import '$lib/styles/colors.css';
	import '$lib/styles/shadows.css';
	import Nav from './Nav.svelte';
	import '@fontsource/fira-sans';
	import Field from '$lib/components/Field.svelte';
	import Password from '$lib/components/Password.svelte';

	let { children, data, form } = $props();
	let signup = $state(false);
</script>

<Nav url={data.url} socials={data.socials}>
	{@render children()}
</Nav>

{#if data.showLogin}
	<div class="bg-farm-green-400 fixed right-0 bottom-0 left-0 h-32 w-full">
		<div class="container mx-auto p-5">
			{#if data.user}
				<form class="flex space-x-4" method="POST" action="/?/logout">
					<button class="btn btn-primary">Logout</button>
				</form>
			{:else}
				{#if signup}
					<form class="flex space-x-4" method="POST" action="/?/signup">
						<Field name="email" label="Email" id="email" required {form}></Field>
						<Password name="password" label="Password" id="password" required {form}></Password>
						<Password
							name="confirmPassword"
							label="Confirm Password"
							id="confirmPassword"
							required
							{form}
						></Password>
						<button class="btn btn-primary">Register</button>
					</form>
				{:else}
					<form class="flex space-x-4" method="POST" action="/?/login">
						<Field name="email" label="Email" id="email" required {form}></Field>
						<Password name="password" label="Password" id="password" required {form}></Password>

						<button class="btn btn-primary">Login</button>
					</form>
				{/if}
				<button onclick={() => (signup = !signup)} class="block"
					>{signup ? 'Login' : 'Register'}</button
				>
			{/if}
		</div>
	</div>
{/if}
