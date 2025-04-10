<script context="module">
  import { browser } from '$app/environment';
  import { setContext, onMount } from 'svelte';

  let iframeApiReady = false;
  console.log('This module ran', browser);

  if (browser) {
    try {
      let tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      let firstScriptTag = document.getElementsByTagName('script')[0];

      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      console.log(firstScriptTag);
      window.onYouTubeIframeAPIReady = () => window.dispatchEvent(new Event('iframeApiReady'));
    } catch (error) {
      console.error(error);
    }
  }
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { getContext } from 'svelte';
  export let videoId;
  let player;
  let divId = 'player_' + parseInt(Math.random() * 109999);
  export function play() {
    player.playVideo();
  }
  console.log('this script ran');

  const dispatch = createEventDispatcher();
  onMount(() => {
    console.log('it was mounted');

    window.addEventListener('iframeApiReady', function (e) {
      console.log('yo', divId, YT);
      player = new YT.Player(divId, {
        height: '390',
        width: '640',
        videoId,
        events: {
          onReady: playerIsReady,
          onStateChange: playerStateChange
        }
      });
    });
    console.log('listener set');
  });
  function playerStateChange({ data }) {
    dispatch('PlayerStateChange', data);
    console.log(data);
    let strReturn = '';
    if (data == -1) {
      strReturn = '(unstarted)';
    }
    if (data == 0) {
      strReturn = '(ended)';
    }
    if (data == 1) {
      strReturn = '(playing)';
    }
    if (data == 2) {
      strReturn = '(paused)';
    }
    if (data == 3) {
      strReturn = '(buffering)';
    }
    if (data == 5) {
      strReturn = '(video cued).';
    }
    dispatch('PlayerStateChangeString', strReturn);
  }
  function playerIsReady() {
    dispatch('Ready');
    setInterval(() => {
      dispatch('currentPlayTime', player.getCurrentTime());
      //console.log(player.getCurrentTime())
    }, 1000);
  }
</script>

<!-- <svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head> -->

<div id={divId}></div>
