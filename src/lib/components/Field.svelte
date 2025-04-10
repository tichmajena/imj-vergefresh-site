<script>
	let {
		id,
		name,
		value = '',
		label,
		labelClasses,
		required = false,
		autocomplete = false,
		form
	} = $props();

	const message = form?.message[name];
</script>

<div class="form-control relative mb-5">
	<input
		placeholder={label}
		type="text"
		class:error-input={message?.code === 'error'}
		class:warning-input={message?.code === 'warning'}
		class:success-input={message?.code === 'success'}
		class="peer border-base-content focus:border-primary h-12 w-full rounded-lg border bg-transparent py-3 pl-3 text-base placeholder-transparent transition-all focus:outline focus:outline-none"
	/>
	<label
		for={id}
		class:error-label={message?.code === 'error'}
		class:warning-label={message?.code === 'warning'}
		class:success-label={message?.code === 'success'}
		class="field-label peer-placeholder-shown:text-base-contentt text-base-content peer-focus:text-primary absolute -top-2.5 left-3 px-1 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-sm"
		>{label}</label
	>
	{#if message}
		<div
			class:text-error={message?.code === 'error'}
			class:text-warning={message?.code === 'warning'}
			class:text-success={message?.code === 'success'}
			class="text-w mt-1 px-2 text-sm"
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

	:global(.drawer[data-theme='dark']) .field-label {
		background-color: var(--label-bg-dark);
		color: var(--label-dark);
	}
	:global(.drawer[data-theme='light']) .field-label {
		background-color: var(--label-bg-light);
		color: var(--label-light);
	}
</style>
