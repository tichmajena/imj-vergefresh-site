<script lang="ts">
	let { children, heading, subheading, subtitle, editable = true } = $props();
	import Text from '$lib/Text.svelte';
</script>

<div class=" w-full pt-32">
	<div class="relative container mx-auto flex w-full space-x-3 overflow-hidden px-6 py-5 md:py-10">
		<div class="flex-column md:w-2/3">
			{#if heading}
				<Text {editable} path={['heading']} class="text-primary font-bold" />
			{/if}
			<Text {editable} path={['title']} class="heading1 text-primary font-bold" element="h1" />
			{#if subheading}
				<div class="border-primary mb-4 border-l-3 pt-3 pb-4 pl-5">
					<Text {editable} path={['subheading']} class="text-2xl md:text-4xl" />
				</div>
			{/if}
			{#if subtitle}
				<Text {editable} path={['subtitle']} class="heading3" />
			{/if}
		</div>
		<div class="text-primary/10 absolute right-0 -bottom-10 flex w-0 justify-center md:w-1/3">
			{@render children?.()}
		</div>
	</div>
</div>
