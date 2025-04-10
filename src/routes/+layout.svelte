<script lang="ts">
	import '../app.css';
	import '$lib/styles/spacing.css';
	import '$lib/styles/colors.css';
	import '$lib/styles/shadows.css';
	import Nav from './Nav.svelte';
	let { children, data } = $props();
</script>

<Nav url={data.url} socials={data.socials}>
	{@render children()}
</Nav>
