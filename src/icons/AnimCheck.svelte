<script lang="ts">
  import { draw, scale } from "svelte/transition";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  class="h-6 w-6"
  stroke="currentColor"
  stroke-width="1.4"
  stroke-linecap="round"
  stroke-linejoin="round"
  fill="none"
>
  <path in:draw|global={{ duration: 750 }} d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
  <polyline
    in:draw|global={{ duration: 1000, delay: 300 }}
    points="22 4 12 14.01 9 11.01"
  />
</svg>
