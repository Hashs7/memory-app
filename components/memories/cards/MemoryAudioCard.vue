<template>
  <div class="memory-audio-card">
    <span v-if="name" class="memory-audio-card__name">
      {{ name }}
    </span>
    <AudioPlayer
      class="memory-audio-card__player"
      :media="data.file"
      visualizer
      @play="$emit('play')"
      @pause="$emit('pause')"
    />
  </div>
</template>

<script>
import AudioPlayer from '@/components/gallery/audio/AudioPlayer';

export default {
  name: 'MemoryAudioCard',
  components: { AudioPlayer },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    name() {
      return this.data.file?.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.memory-audio-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: $background;
  overflow: hidden;
}
</style>
