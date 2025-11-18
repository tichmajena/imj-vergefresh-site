<script>
	import { getContext } from 'svelte';
	import Text from '$lib/Text.svelte';
	const svedit = getContext('svedit');

	let { path, editable = true, cloudfront } = $props();

	let block = $derived(svedit.entry_session.get(path));
	// console.log(block);
	import { getLightbox } from '$lib/js/Lightbox.svelte';
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';

	const lightbox = getLightbox();

	function select(i) {
		console.log(i);

		if (!document.startViewTransition) {
			lightbox.launch(i, block.images);
		} else {
			document.startViewTransition(() => {
				lightbox.launch(i, block.images);
			});
		}
	}
	// $inspect(block);
	let selected = $state($page?.params?.member || '');
	let members = $derived(
		block.images.filter((m) => m.title.toLowerCase().replaceAll(' ', '-') !== selected)
	);

	onNavigate((navigation) => {
		console.log(navigation.to?.params.member);
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				selected = navigation.to?.params.member;
				resolve();
				console.log('resolved');
				await navigation.complete;
			});
		});
	});
</script>

<!-- data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};" -->

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each members as member_}
		<!-- <a
			style:--tag={'member-' + member}
			onclick={() => {
				//selected = member;
			}}
			aria-label={member}
			href="/team/{member}"
		>
			<div
				style="background-color: {member};"
				class:ds={member !== selected}
				class="aspect-square w-full"
			></div>
		</a> -->
		{@render member(member_)}
	{/each}
</div>

{#snippet member(member)}
	<a class="mb-2 cursor-pointer" href="/team/{member.title.toLowerCase().replaceAll(' ', '-')}">
		<div class="ds" style:--tag={'member-' + member.title.toLowerCase().replaceAll(' ', '-')}>
			<div class="mb-2 aspect-square w-full">
				<img
					class="h-full w-full"
					src="{$page.data.cloudfront}/fit-in/300x300/{member.url}"
					alt={member.title}
				/>
			</div>
			<div class=" text-sm font-bold text-[--primary-to-light] md:text-base">{member.title}</div>
			<div class="text-xs md:text-sm">{member.alt}</div>
		</div>
	</a>
{/snippet}

<style>
	.card {
		view-transition-name: var(--tag);
	}

	.layout-1 {
		@apply md:flex md:flex-col;
	}
	.layout-1.stack {
		@apply inline-grid md:hidden;
	}

	.layout-2 {
		@apply block;
	}
	.layout-3 {
		@apply grid;
	}

	.ds {
		view-transition-name: var(--tag);
	}
</style>
