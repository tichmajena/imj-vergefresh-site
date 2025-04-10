<script>
  import { page } from '$app/stores';
  //TODO import { galleryImages } from '$lib/stores/gallery';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let items = [];
</script>

<button
  on:click={() => {
    dispatch('upload');
  }}
  class="my-6 flex w-full items-center justify-center rounded-lg border-2 border-dashed border-blue-600 py-4 text-2xl text-blue-600"
>
  Upload
</button>
{#await items}
  :::LOADING
{:then items_}
  <div class="lg:colums-4 w-full columns-2 gap-3 space-y-3 sm:columns-3 md:columns-4">
    {#each items_ as image}
      <div
        on:keydown
        on:click={() => {
          dispatch('select', { source: 'aws', image });
        }}
      >
        <img src={$page.data.cloudfront + '/fit-in/300x600/' + image.key} alt="" />
      </div>
    {:else}
      No images found {items.length}
    {/each}
  </div>
{/await}
