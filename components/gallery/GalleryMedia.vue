<template>
  <div
    ref="media"
    :class="{ selected }"
    class="gallery-media"
    @click="$emit('select')"
  >
    <div class="gallery-media__container">
      <img v-if="isImage" class="gallery-media__img" :src="path" alt="" />
      <span v-if="isAudio">Audio</span>
      <span v-if="isVideo">Video</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryMedia',
  props: {
    selectable: {
      type: Boolean,
      default: false,
    },
    media: {
      type: Object,
      required: true,

      path: {
        type: String,
        required: true,
      },
      mimetype: {
        type: String,
        required: true,
      },
    },
  },
  data() {
    return {
      selected: false,
    };
  },
  computed: {
    path() {
      return `${this.media.path}?w=100`;
    },
    isImage() {
      return this.media.mimetype.split('/')[0] === 'image';
    },
    isVideo() {
      return this.media.mimetype.split('/')[0] === 'video';
    },
    isAudio() {
      return this.media.mimetype.split('/')[0] === 'audio';
    },
  },
  methods: {
    selectHandler() {
      if (!this.selectable) return;
      this.selected = !this.selected;
      if (this.selected) {
        this.showTransition();
      } else {
        this.hideTransition();
      }
    },
    showTransition() {
      // gsap.to(this.$refs.media);
    },
    hideTransition() {},
  },
};
</script>

<style lang="scss" scoped>
.gallery-media {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 100%;

  &.selected:after {
    content: '';
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 4px solid $primary;
  }
}

.gallery-media__container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.gallery-media__img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}
</style>
