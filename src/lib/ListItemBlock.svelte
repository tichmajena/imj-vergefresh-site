<script>
  import Text from '$lib/Text.svelte';

  let {
    path,
    /** @type {('decimal'|'decimal-leading-zero'|'lower-roman'|'upper-roman'|'lower-latin'|'upper-latin'|'disc'|'circle'|'square')} */
    list_style
  } = $props();
</script>

<!-- IMPORTANT: There must not be any white space between the div and <Text>-->
<div
  class="list-item text-lg"
  style:--list-style={list_style}
  data-path={path.join('.')}
  data-type="block"
  data-index={path.at(-1)}
  style="anchor-name: --{path.join('-')};"
>
  <Text path={[...path, 'description']} />
</div>

<style>
  div {
    position: relative;
    padding-left: 3em;
  }

  div::before {
    position: absolute;
    padding-left: 0.7em;
    left: 0;
    top: 0;
    font-size: 1em;
    content: counter(listcounter, var(--list-style));
    color: var(--primary-fill-color);
  }

  .list-item::marker {
    content: '';
    display: none;
  }

  /* CSS Counter initiation */
  :global(* > .list-item:first-of-type) {
    counter-reset: listcounter;
    counter-increment: listcounter;
  }
  :global(.list-item + .list-item) {
    counter-increment: listcounter;
  }
</style>
