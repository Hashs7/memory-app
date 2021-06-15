<template>
  <client-only>
    <div class="audio-content memory-content">
      <div class="memory-content__inner">
        <AudioPlayer visualizer :media="value.file" />
        <!--        <span v-else>{{ value.file }}</span>-->
      </div>
    </div>
  </client-only>
</template>

<script>
import AudioPlayer from '../../../gallery/audio/AudioPlayer';

export default {
  name: 'AudioContent',
  components: {
    AudioPlayer,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  methods: {
    validate() {
      this.$store.dispatch('memory/addSelectedAudios');
    },
  },
};
</script>

<style lang="scss">
.audio-content {
  padding: 16px;
}
</style>
