<template>
  <div class="sonority" @click="togglePlay">
    <IconNote v-if="paused" class="note" />
    <Pause v-else />
    <audio ref="audio" class="sonority__audio" controls preload="metadata">
      <source v-if="media" :src="media.path" :type="media.mimetype" />
      Sorry, your browser doesn't support embedded videos.
    </audio>
  </div>
</template>

<script>
import IconNote from '~/assets/svg/ic_note.svg?inline';
import Pause from '~/assets/svg/player/ic_pause.svg?inline';

export default {
  name: 'Sonority',
  components: {
    IconNote,
    Pause,
  },
  props: {
    media: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      paused: true,
    };
  },
  mounted() {
    this.$refs.audio?.addEventListener('ended', () => {
      this.paused = true;
    });
  },
  methods: {
    togglePlay() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.muted = false;
        this.$refs.audio.play();
        this.paused = false;
      } else {
        this.$refs.audio.pause();
        this.paused = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sonority {
  width: 68px;
  height: 68px;
  background-color: $gray-darkest;
  display: flex;
  border-radius: 50%;

  svg {
    margin: auto;
    width: 28px;
  }
  .note {
    transform: translateX(-2px);
  }

  path,
  rect {
    fill: $background;
  }

  .sonority__audio {
    position: absolute;
    pointer-events: none;
    z-index: -1;
    visibility: hidden;
  }
}
</style>
