<script>
	import IconRegulations from '$icons/IconRegulations.svelte';
	import IconGoodAgri from '$icons/IconGoodagri.svelte';
	import IconStandards from '$icons/IconStandards.svelte';
	import IconWindmill from '$icons/IconWindmill.svelte';
	import IconRightcrop from '$icons/IconRightcrop.svelte';
	import IconTraining from '$icons/IconTraining.svelte';
	import IconSocialcompliance from '$icons/IconSocialcompliance.svelte';
	import IconPlant from '$icons/IconPlant.svelte';
	import IconPaper from '$icons/IconPaper.svelte';
	import IconVision from '$icons/IconVision.svelte';
	import IconApproach from '$icons/IconApproach.svelte';
	import IconCreed from '$icons/IconCreed.svelte';
	import IconBadge from '$icons/IconBadge.svelte';

	let { icon = 'windmill', class: classes } = $props();

	let icons = {
		badge: IconBadge,
		windmill: IconWindmill,
		plant: IconPlant,
		standards: IconStandards,
		regulations: IconRegulations,
		training: IconTraining,
		paper: IconPaper,
		'good-agricultural-practices': IconGoodAgri,
		'right-crop': IconRightcrop,
		'social-compliance': IconSocialcompliance,
		vision: IconVision,
		approach: IconApproach,
		creed: IconCreed
	};
	const Icon = icons[icon] || icons.windmill;
</script>

<Icon class={classes} />
