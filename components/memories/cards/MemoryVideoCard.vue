<template>
  <div class="memory-video-card">
    <video
      ref="video"
      class="memory-video-card__video"
      :src="data.file.path"
      loop
      :muted="muted"
      playsinline
      @click="toggleMuted"
    />
    <span v-show="muted" class="memory-video-card__muted">
      <IconSoundMuted />
    </span>
  </div>
</template>

<script>
import IconSoundMuted from '@/assets/svg/ic_sound-muted.svg?inline';

export default {
  name: 'MemoryVideoCard',
  components: { IconSoundMuted },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      muted: true,
    };
  },
  mounted() {
    this.muted = this.$refs.video.muted;
  },
  methods: {
    toggleMuted(e) {
      this.muted = !this.muted;
      this.$emit('toggle-mute', e);
    },
  },
};
</script>

<style lang="scss" scoped>
.memory-video-card {
  position: relative;
  height: 100%;
}

.memory-video-card__video {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.memory-video-card__muted {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  border-radius: 100%;
  @include blurred-background;

  svg {
    height: 30px;
    fill: $background;
  }
}
</style>
