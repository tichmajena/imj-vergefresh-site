<script>
	import IconCamera from '$icons/IconCamera.svelte';
	import IconCheck from '$icons/IconCheck.svelte';
	import IconClose from '$icons/IconClose.svelte';
	import AnimCheck from '$icons/AnimCheck.svelte';
	import { page } from '$app/stores';
	//TODO import { galleryImages } from '$lib/stores/gallery';
	import { createEventDispatcher } from 'svelte';
	import placeholder from '$lib/assets/placeholder-3.png';

	import Gallery from './Gallery.svelte';

	import { encode } from 'blurhash';
	import { dataURItoBlob } from '$lib/js/utils';

	let data;

	const dispatch = createEventDispatcher();
	//export let post = { photo: "zviko.jpeg" };

	export let post = { _id: 'x' };

	export let confirmImage = false;
	export let featuredImageModel;
	export let featuredSaveCheck;
	export let centre;

	let divider;

	$: source = 'aws';
	$: featuredImg =
		source && source === 'unsplash'
			? post?.featuredImg?.image[post?.featuredImg?.source].src
			: source && post?.image
				? `${$page.data.cloudfront}/fit-in/1920x3000/${post?.image}`
				: undefined;
	let galleryTab = 'aws';
	let modals = {
		featured: false,
		[post._id]: { featured: false }
	};
	let loaders = {
		save: false
	};

	$: console.log(featuredImg);

	let photo;
	let hiddenInput;
	let loading = false;
	let imageKey = '';
	let online = true;

	let imgBlob;
	let imgSize;
	let imgSizeRaw;
	let imgData = null;

	const handleOnChange = async (e, i) => {
		loaders.save = false;
		const file = e.target.files[0];
		const blob = await processImage(file);
		imgData = blob.img;
		photo = file.name;
		imageKey = file.name;
		imgSize = blob.size;
		imgSizeRaw = blob.sizeRaw;
		imgBlob = blob;

		featuredImageModel = { src: imgData, name: photo, source: 'upload' };
		modals[post._id].featured = false;
		confirmImage = true;
	};

	export const handleUpload = () => {
		hiddenInput.click();
	};

	async function handleCreate() {
		console.log('handling create ', imgBlob);
		loading = true;
		const awsRes = await fileSubmit(imgBlob);
		if (!awsRes) {
			console.log('image upload failed');

			return;
		}
		console.log(await awsRes);
		const data = { photo };
	}

	const processImage = async (file) => {
		return new Promise((resolve) => {
			let data, blob;
			let uploadedWidth;
			const reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = function (event) {
				const imgEl = document.createElement('img');
				imgEl.src = event.target.result;

				imgEl.onload = function (e) {
					const MAX_WIDTH = 3840;
					const MAX_HASH_WIDTH = 32;

					const canvas = document.createElement('canvas');
					const hashCanvas = document.createElement('canvas');

					let width;

					if (e.target.width > MAX_WIDTH) {
						width = MAX_WIDTH;
					} else {
						width = e.target.width;
					}

					const scaleSize = width / e.target.width;
					canvas.width = width;
					canvas.height = e.target.height * scaleSize;

					const hashScaleSize = MAX_HASH_WIDTH / e.target.width;
					const hashHeight = Math.floor(e.target.height * hashScaleSize);
					hashCanvas.width = MAX_HASH_WIDTH;
					hashCanvas.height = hashHeight;

					const ctx = canvas.getContext('2d');
					ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
					data = canvas.toDataURL('image/jpeg', 90);
					//console.log(file.name, imgdata);
					console.log(data?.width, data?.height, e.target?.width);

					const hashCtx = canvas.getContext('2d');
					hashCtx.drawImage(e.target, 0, 0);
					const hashImageData = hashCtx.getImageData(0, 0, MAX_HASH_WIDTH, hashHeight);
					const blur_hash = encode(
						hashImageData.data,
						hashImageData.width,
						hashImageData.height,
						4,
						4
					);

					divider.appendChild(canvas);

					const blobData = dataURItoBlob(data);
					blob = {
						img: data,
						data: blobData,
						blur_hash: { hash: blur_hash, w: MAX_HASH_WIDTH, h: hashHeight },
						sizeRaw: blobData.size,
						size:
							blobData.size > 1024
								? file.size > 1048576
									? Math.round(blobData.size / 1048576) + 'mb'
									: Math.round(blobData.size / 1024) + 'kb'
								: blobData.size + 'b'
					};
					// alert(blob.size / 1000 + "KB");
					console.log(blob);
					resolve(blob);
				};
			};
		});
	};

	async function fileSubmit(blobData) {
		console.log(blobData);
		if (!blobData) return { key: '', src: '', ok: true, blur_hash: null };
		return new Promise((resolve) => {
			const file = blobData.data;
			let result = null;
			try {
				const reader = new FileReader();
				reader.onloadend = async () => {
					console.log(reader.result);
					try {
						const res = await fetch('/api/signing', { method: 'POST', body: imageKey });
						const url = await res.json();
						console.log({ url });

						const response = await fetch(url.put, {
							method: 'PUT',
							body: reader.result
						});
						console.log({ response });
						const d = await response.text();
						console.log(d);

						if (response.ok) {
							result = { key: imageKey, src: url.get, ok: true, blur_hash: blobData.blur_hash };
							//TODO await galleryImages.create({ key: imageKey, size: imgSize || '' });
							let payload = {
								key: imageKey,
								source: 'aws',
								type: 'image',
								size: imgSize,
								sizeRaw: imgSizeRaw,
								ext: imageKey.split('.')[imageKey.split('.').length - 1],
								status: 'published'
							};
							console.log('POSTING TO GALLERY', payload);

							const res = await fetch('/api/media', {
								method: 'POST',
								body: JSON.stringify([payload])
							});

							console.log(await res.json());

							// UPLOADS[file.name] = { key: file.name, src: url.get, size: file.blob.size };
						}
						resolve(result);
					} catch (err) {
						console.log(err);
						console.log(err?.msg);

						resolve({ ok: false, error: err });
					}
				};

				reader.readAsArrayBuffer(file);
			} catch (error) {
				console.warn(`Error in handleSubmit on / route: ${error}`);
				resolve(null);
			}
		});
	}

	function toggleGallery(e) {
		galleryTab = e.srcElement.id;
	}

	async function handleSelectFeatured(e) {
		loaders.save = false;
		const { source, image } = e.detail;
		if (source === 'unsplash') {
			let model = {
				source,
				src: image.urls.regular,
				alt: image.alt_description,
				name: image.photographer.name,
				profile: image.photographer.profile,
				referer: 'mcd-attorneys-zim',
				urls: image.urls,
				links: image.links
			};

			featuredImageModel = model;
		} else if (source === 'envato') {
			console.log(image, e.detail);
			const { thumbnail, medium, large, larger, name } = image;

			let model = {
				source,
				src: larger.url || large.url,
				alt: image.alt_description,
				name,
				thumbnail,
				medium,
				large,
				larger
			};

			featuredImageModel = model;
		} else if (source === 'aws') {
			let model = {
				src: `${$page.data.cloudfront}/${image.key}`,
				name: image.key,
				source
			};
			featuredImageModel = model;
		}
		confirmImage = true;
		modals[post._id].featured = false;
	}

	let fm = {
		source: 'unsplash',
		image: {
			unsplash: [{}],
			envato: [{}],
			aws: [{}]
		}
	};

	async function saveSelected() {
		loaders.save = true;
		await handleCreate();
		source = 'aws';
		const image = featuredImageModel;
		dispatch('saveSelected', { image, source });
		loaders.save = false;
	}
</script>

<div bind:this={divider} class="sr-only" />

<div
	class="group relative inset-0 mb-2 flex h-full min-h-24 w-full items-center justify-center overflow-hidden shadow-lg"
>
	<!--  -->
	{#if !confirmImage}
		<div class="absolute right-3 top-12 z-0">
			<button
				on:click={() => {
					dispatch('modal');
				}}
				id="button"
				class="btn btn-circle btn-sm hidden p-3 group-hover:block"
			>
				<IconCamera />
			</button>
		</div>
	{:else}
		<div class="absolute right-3 top-12 z-0">
			<button
				class:loading={loaders.save && !featuredSaveCheck}
				class:-mt-1={loaders.save && !featuredSaveCheck}
				on:click={saveSelected}
				class="btn btn-circle"
				>{#if featuredSaveCheck}
					<AnimCheck />
				{:else if !loaders.save}
					<IconCheck />
				{/if}
			</button>

			<button
				on:click={() => {
					if (loaders.save || featuredSaveCheck) return;
					confirmImage = false;
					featuredImageModel = undefined;
				}}
				class="btn btn-circle"
			>
				<IconClose />
			</button>
		</div>
	{/if}

	{#key featuredImageModel}
		<img
			src={featuredImageModel?.src || featuredImg || placeholder}
			alt=""
			class="inset-0 -z-10 h-full w-full object-cover"
		/>
	{/key}
	<input
		on:change={(e) => handleOnChange(e)}
		bind:this={hiddenInput}
		id="hidden-input"
		type="file"
		name="image"
		hidden
	/>
</div>
