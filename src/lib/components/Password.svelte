<script>
	export let id,
		name,
		value = '',
		label,
		required,
		autocomplete;
	export let form;

	const message = form?.message[name];

	let see;
</script>

<div class="form-control relative mb-5">
	<textarea
		placeholder={label}
		type={see ? 'text' : 'password'}
		{...$$props}
		class:error-input={message?.code === 'error'}
		class:warning-input={message?.code === 'warning'}
		class:success-input={message?.code === 'success'}
		class="peer border-base-content focus:border-primary h-12 w-full rounded-lg border bg-transparent py-3 pl-3 text-base placeholder-transparent transition-all focus:outline focus:outline-none"
	></textarea>
	<label
		for={id}
		class:error-label={message?.code === 'error'}
		class:warning-label={message?.code === 'warning'}
		class:success-label={message?.code === 'success'}
		class="bg-base-100 text-base-content peer-placeholder-shown:text-base-content peer-focus:text-primary absolute -top-2.5 left-3 px-1 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-sm"
		>{label}</label
	>
	<button
		on:click={() => {
			see = !see;
		}}
		type="button"
		class="cursor pointer absolute top-3 right-3 z-20"
	>
		{#if !see}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
				/>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
				/>
			</svg>
		{/if}
	</button>
	{#if message}
		<div
			class:text-warning={message?.code === 'warning'}
			class:text-error={message?.code === 'error'}
			class:text-success={message?.code === 'success'}
			class="text-w mt-0.5 text-sm"
		>
			<ul>
				{#each message?.msg || [] as message}
					<li>{message}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	@reference '../../app.css';

	.error-label {
		@apply peer-placeholder-shown:text-error;
		@apply text-error;
		@apply peer-focus:text-error;
	}
	.warning-label {
		@apply peer-placeholder-shown:text-warning;
		@apply text-warning;
		@apply peer-focus:text-warning;
	}
	.success-label {
		@apply peer-placeholder-shown:text-success;
		@apply text-success;
		@apply peer-focus:text-success;
	}

	.error-input {
		@apply peer-placeholder-shown:text-error;
		@apply peer-focus:text-error;
		@apply border-error;
		@apply focus:border-error;
	}
	.warning-input {
		@apply peer-placeholder-shown:text-warning;
		@apply peer-focus:text-warning;
		@apply border-warning;
		@apply focus:border-warning;
	}
	.success-input {
		@apply peer-placeholder-shown:text-success;
		@apply peer-focus:text-success;
		@apply border-success;
		@apply focus:border-success;
	}
</style>
