<script lang="ts">
	// Import Svedit Componets
	import Container from '$lib/Container.svelte';
	import StoryBlock from '$lib/StoryBlock.svelte';
	import Svedit from '$lib/Svedit.svelte';
	import EntrySession from '$lib/EntrySession.svelte';
	import TextToolBar from '$lib/TextToolBar.svelte';
	import IconPlant from '$icons/IconPlant.svelte';
	import HeaderBlock from '$lib/HeaderBlock.svelte';

	// Import Utilities
	import { dev } from '$app/environment';
	import type { PageData } from './$types';
	import ViewTransition from '$lib/components/ViewTransition.svelte';

	let { data }: { data: PageData } = $props();

	// Initialise Svedit
	let page_json = $state(data.entry);
	let entry_session = new EntrySession(page_json);
</script>

<!-- <ViewTransition></ViewTransition> -->
<div class="demo-wrapper md:pb-10">
	{#if data.user?.exists}
		<TextToolBar {entry_session} />
	{/if}

	<Svedit {entry_session} editable={data.user?.exists === true} class="flex-column">
		<HeaderBlock
			heading={false}
			subheading={false}
			subtitle={true}
			editable={data.user?.exists === true}
		>
			<!-- <IconPlant class="h-96"></IconPlant> -->
		</HeaderBlock>

		<Container class="body flex-column w-full gap-y-10 px-6 md:mt-10" path={['body']}>
			{#snippet block(block, path)}
				{#if block.type === 'story'}
					<StoryBlock cloudfront={data.cloudfront} editable={data.user?.exists === true} {path}
					></StoryBlock>
				{:else}{/if}
			{/snippet}
		</Container>
	</Svedit>
</div>
