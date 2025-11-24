<script>
	import Text from '$lib/Text.svelte';
	import StoryBlock from '$lib/StoryBlock.svelte';
	import ListBlock from '$lib/ListBlock.svelte';
	import UnknownBlock from '$lib/UnknownBlock.svelte';
	import Svedit from '$lib/Svedit.svelte';
	import Container from '$lib/Container.svelte';
	import EntrySession from '$lib/EntrySession.svelte';
	import TextToolBar from '$lib/TextToolBar.svelte';
	import { getContext } from 'svelte';
	import Icon from '../lib/Icon.svelte';
	import { slide } from 'svelte/transition';
	import ArtworkImage from '../lib/components/ArtworkImage.svelte';
	import Gallery from '../lib/components/Gallery.svelte';
	import SliderTest from '$lib/components/SliderTest.svelte';
	import BlockTest from '$lib/components/BlockTest.svelte';
	import ViewTransition from '$lib/components/ViewTransition.svelte';
	import BrandBlock from '$lib/BrandBlock.svelte';
	import StoryList from '$lib/StoryList.svelte';
	import SEO from './SEO.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import { dev } from '$app/environment';
	// import HeroSlide from '$lib/components/HeroSlide.svelte';
	import StoryVideo from '$lib/StoryVideo.svelte';
	import FeatureBlock from '$lib/FeatureBlock.svelte';

	let { data } = $props();
	let page_json = $state(data.entry);
	let showLightbox = $state(false);
	let lightboxStart = $state(-1);
	let Uploader;

	let entry_session = new EntrySession(page_json);
	let galleryTab = 'aws';

	// $inspect(entry_session.entry);

	function test() {
		console.log(entry_session.entry);
		console.log(entry_session);
		page_json.body.push({
			type: 'story',
			layout: 1,
			editable: false,
			image: '/images/github.svg',
			title: ['Star us on GitHub', []],
			description: [
				'Please star Svedit on GitHub or watch the repo to be notified about updates. Svedit is made by Michael Aufreiter and Johannes Mutter and is licensed under the MIT License.',
				[
					[0, 28, 'link', { href: 'https://github.com/michael/svedit/', target: '_blank' }],
					[95, 112, 'link', { href: 'https://michaelaufreiter.com', target: '_blank' }],
					[117, 132, 'link', { href: 'https://mutter.co', target: '_blank' }]
				]
			]
		});
	}
	let modals = $state(false);
	let row = $state(false);

	const siteUrl = 'https://www.vergefresh.co.uk';
	const img1 = siteUrl + '/images/seo/logo-16x9.jpg';
	const img2 = siteUrl + '/images/seo/logo-4x3.jpg';
	const img3 = siteUrl + '/images/seo/logo-1x1.jpg';
	const siteTitle = 'Verge Fresh - Fresh Produce Suppliers';
	const metaTitle = 'Importers and Suppliers of Fresh Produce in the UK';
	const metadescription =
		'Large range of fresh fruits and vegetables supplied to retailers and wholesalers across the UK.';
	const telephone = '';
	const facebookPage = '';
	const twitterHandle = '';
	const linkedinProfile = '';
	const address = {
		street: '',
		city: '',
		region: '',
		country: ''
	};
</script>

<OpenGraph
	{siteTitle}
	{metadescription}
	{siteUrl}
	pageTitle={metaTitle}
	image={{ url: img1, alt: '' }}
	squareImage={{ url: img3, alt: '' }}
	ogLanguage={'en-UK'}
/>
<SEO
	{siteUrl}
	{siteTitle}
	services={[]}
	branches={[]}
	{metadescription}
	{metaTitle}
	images={[img1, img2, img3]}
	{telephone}
	{facebookPage}
	{twitterHandle}
	{address}
	{linkedinProfile}
/>

<!-- <ViewTransition></ViewTransition> -->
{#if showLightbox}
	<SliderTest
		startAt={lightboxStart}
		close={() => {
			document.startViewTransition(() => {
				showLightbox = false;
				lightboxStart = -1;
			});
		}}
	/>
{/if}
<div class="demo-wrapper pb-20">
	{#if data.user?.exists === true}
		<TextToolBar {entry_session} />
	{/if}

	<div class="relative h-screen w-full overflow-hidden">
		<img
			class="relative h-full w-full object-cover"
			src="{data.cloudfront}/1920x0/kuminda-norton-28.jpg"
			alt=""
		/>
		<div
			class="from-base-300/80 via-base-300/50 absolute top-0 right-0 bottom-0 left-0 h-72 bg-gradient-to-b to-transparent"
		></div>
	</div>

	<Svedit {entry_session} editable={data.user?.exists === true} class="flex-column">
		<!-- NOTE: non-editable island must have contenteditable="false" and contain some text content, otherwise invalid selections occur. -->
		<div class="container mx-auto px-6 py-20">
			<div class="w-full max-w-screen-lg md:w-2/3">
				<Text path={['title']} class="mb-4 text-3xl font-bold text-green-800 md:text-4xl" />
				<Text path={['subtitle']} class="text-xl md:text-2xl" />
			</div>
		</div>
		<Container class="body flex-column gap-y-10" path={['body']}>
			{#snippet block(block, path)}
				{#if block.type === 'story'}
					<StoryBlock cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{:else if block.type === 'cta'}
					<CtaBlock cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{:else if block.type === 'story_list'}
					<StoryList cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{:else if block.type === 'story_video'}
					<StoryVideo cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{:else if block.type === 'brand'}
					<BrandBlock cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{:else if block.type === 'lightbox_grid'}
					<BlockTest cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{:else if block.type === 'list'}
					<ListBlock cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{:else if block.type === 'text'}
					<Text {path} class="heading1 m-0" />
				{:else}
					<UnknownBlock cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{/if}
			{/snippet}
		</Container>
		<Container
			class="body container mx-auto grid grid-cols-1 gap-y-10 px-6 md:grid-cols-2 "
			path={['sidebar']}
		>
			{#snippet block(block, path)}
				{#if block.type === 'story'}
					<FeatureBlock cloudfront={data.cloudfront} editable={data.user?.exists === true} {path} />
				{/if}
			{/snippet}
		</Container>
	</Svedit>

	<!-- <hr />

	<div class="flex-column mx-auto my-10 w-full max-w-screen-lg gap-y-2">
		<p>Selection:</p>
		<pre class="debug-info p-4">{JSON.stringify(entry_session.selection || {}, null, '  ')}</pre>
		<p>Entry:</p>
		<pre class="debug-info p-4">{JSON.stringify(entry_session.entry, null, '  ')}</pre>
	</div> -->
</div>

<style>
	.demo-wrapper {
		/* no paddings or margins here on the body, so Blocks can use the full width (edge to edge layouts) */
	}
	.debug-info {
		text-wrap: wrap;
		height: 12lh;
		overflow-y: auto;
		color: white;
		background: var(--primary-fill-color);
		font-size: 12px;
	}
</style>
