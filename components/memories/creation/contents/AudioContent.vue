<template>
  <client-only>
    <div class="audio-content memory-content">
      <div class="memory-content__inner">
        <AudioGallery v-if="!value.file" />
        <span v-else>{{ value.file }}</span>
        <button type="button" @click="validate">Valider</button>
      </div>
    </div>
  </client-only>
</template>

<script>
import AudioGallery from '../../../gallery/audio/AudioGallery';

export default {
  name: 'AudioCreation',
  components: { AudioGallery },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log(this.value);
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
}
</style>
