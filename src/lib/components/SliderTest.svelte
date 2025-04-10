<script>
	import { fade, slide } from 'svelte/transition';

	let { close, startAt = 0 } = $props();

	let items = $state([
		{ title: '1', size: '24' },
		{ title: '2', size: '36' },
		{ title: '3', size: '54' },
		{ title: '4', size: '48' },
		{ title: '5', size: '36' },
		{ title: '6', size: '24' },
		{ title: '7', size: '54' }
	]);
	let current = $state(startAt);

	let sliderOrder = $derived.by(() => {
		let slides = $state.snapshot(items);
		const traverse = slides.splice(0, current);
		slides?.push(...traverse);
		return slides;
	});

	let slider = $state($state.snapshot(sliderOrder));

	function next(e) {
		const s = slider.shift();
		slider.push(s);
		console.log(s, $state.snapshot(slider));
	}
	function previous(e) {
		e.stopPropagation();

		const s = slider.pop();
		slider.unshift(s);
	}
</script>

<div
	onclick={close}
	role="button"
	tabindex="-1"
	onkeydown={(e) => {
		if (e.key === 'Enter') {
			close();
		}
	}}
	class="fixed z-10 my-20 flex h-screen w-full flex-col items-center justify-center space-x-8 rounded-lg bg-teal-900 bg-opacity-95 p-8 md:flex-row"
>
	<button
		onclick={previous}
		onkeydown={(e) => {
			e.stopPropagation();
			previous();
		}}
		class="btn btn-primary hidden md:flex">{'<'}</button
	>
	{#each slider as slide, i}
		{#if i === 0}
			<div
				style:--tag={'g-image-' + (parseInt(slide.title) - 1)}
				style="width:{slide.size}0px;height:{slide.size}0px;"
				class="card flex items-center justify-center rounded-lg bg-teal-700 p-8 transition-all"
			>
				<h1 class="text-7xl text-teal-400">{slide.title}</h1>
			</div>
		{/if}
	{/each}
	<button
		onkeydown={(e) => {
			e.stopPropagation();
			next(e);
		}}
		clas
		onclick={next}
		class="btn btn-primary hidden md:flex">{'>'}</button
	>
	<div class="flex w-full justify-center space-x-4 md:hidden">
		<button
			onclick={previous}
			onkeydown={(e) => {
				e.stopPropagation();
				previous();
			}}
			clas
			class="btn btn-primary">{'<'}</button
		>
		<button
			onclick={next}
			onkeydown={(e) => {
				e.stopPropagation();
				next();
			}}
			clas
			class="btn btn-primary">{'>'}</button
		>
	</div>
</div>

<style>
	.card {
		view-transition-name: var(--tag);
	}
</style>
