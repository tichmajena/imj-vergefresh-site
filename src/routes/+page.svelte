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

	const siteUrl = 'https://www.kuminda.net';
	const img1 = siteUrl + '/images/seo/logo-16x9.jpg';
	const img2 = siteUrl + '/images/seo/logo-4x3.jpg';
	const img3 = siteUrl + '/images/seo/logo-1x1.jpg';
	const siteTitle = '';
	const metaTitle = '';
	const metadescription = '';
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
	ogLanguage={'en-ZW'}
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
<div class="demo-wrapper">
	{#if dev}
		<TextToolBar {entry_session} />
	{/if}

	<!-- <div class="container-2xl mx-auto h-[70vh] w-full overflow-hidden pr-40">
		<img src={packhouse_img} class="h-full w-full object-cover" alt="" />
	</div> -->

	<!-- <div class="container mx-auto flex w-full justify-center overflow-hidden">
		<video muted autoplay loop disablepictureinpicture>
			<source
				src="https://sdcdc213s.cloudfront.net/video-bg-1_10-720.mp4"
				type="video/mp4"
			/>
		</video>
	</div> -->

	<!-- <HeroSlide
		slides={[
			{
				title: 'Fresh Produce',
				description: 'Certified healthy fruits and vegetables in quality packaging.',
				slug: 'duravit',
				image: packhouse_img
			},
			{
				title: 'Packhouse',
				description: 'Certified healthy fruits and vegetables in quality packaging.',
				slug: 'about',
				image: packhouse_img
			},
			{
				title: 'Outgrower Programs',
				description: 'Great stuff',
				slug: 'about',
				image: packhouse_img
			},
			{
				title: 'Development Programs Programs',
				description: 'Great stuff',
				slug: 'about',
				image: packhouse_img
			}
		]}
	/> -->

	<!-- <pre class="text-xs text-lime-500">
  
          {JSON.stringify(page_json, null, 2)}
      </pre> -->

	<Svedit {entry_session} editable={dev} class="flex-column">
		<!-- <div class="flex-column container mx-auto w-full gap-y-10 p-10">
        <div class="flex-row flex-wrap items-center gap-5">
          <Text path={['title']} class="heading1 m-0" />
          <a
            class="github-button"
            href="https://github.com/michael/svedit"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            data-size="large"
            data-show-count="true"
            aria-label="Star michael/svedit on GitHub">Star</a
          >
        </div>
        <Text path={['subtitle']} class="heading3" />
      </div> -->
		<!-- NOTE: non-editable island must have contenteditable="false" and contain some text content, otherwise invalid selections occur. -->
		<div class="container mx-auto px-6 py-10">
			<div class="w-full md:w-2/3">
				<Text path={['title']} class="mb-4 text-3xl font-bold text-green-800 md:text-4xl" />
				<Text path={['subtitle']} class="text-xl md:text-2xl" />
			</div>
		</div>
		<Container class="body flex-column gap-y-10" path={['body']}>
			{#snippet block(block, path)}
				{#if block.type === 'story'}
					<StoryBlock {block} {path} />
				{:else if block.type === 'story_list'}
					<StoryList {block} {path} />
				{:else if block.type === 'story_video'}
					<StoryVideo {block} {path} />
				{:else if block.type === 'brand'}
					<BrandBlock {block} {path} />
				{:else if block.type === 'lightbox_grid'}
					<BlockTest {block} {path} />
				{:else if block.type === 'list'}
					<ListBlock {block} {path} />
				{:else if block.type === 'text'}
					<Text {path} class="heading1 m-0" />
				{:else}
					<UnknownBlock {block} {path} />
				{/if}
			{/snippet}
		</Container>
		<div contenteditable="false" class="container mx-auto pt-20">
			<div class="mx-auto w-2/3">
				<div class="mb-4 text-center text-3xl font-bold text-green-800 md:text-4xl">Heading</div>
				<div path={['subtitle']} class="text-center text-xl text-green-800 md:text-2xl">
					This is text under the heading
				</div>
			</div>
		</div>
	</Svedit>

	<!-- <button onclick={test} class="btn">Test</button>
  
      <hr />
  
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
