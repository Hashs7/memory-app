<template>
  <div class="media-content memory-content">
    <div class="memory-content__inner">
      <div
        v-if="previewSrc"
        class="preview"
        :style="`background-image: url(${previewSrc})`"
      ></div>
      <label v-else-if="showChoices" class="media-content__container">
        <Gallery @selected="previewImg" />
      </label>
    </div>
  </div>
</template>

<script>
import Gallery from '@/components/gallery/Gallery';

export default {
  name: 'MediaContent',
  components: {
    Gallery,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: false,
      default: null,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showChoices: true,
      file: null,
    };
  },
  computed: {
    previewSrc() {
      return this.value?.file?.path;
    },
  },
  methods: {
    previewImg() {
      this.$store.dispatch('memory/addSelectedMedia', {
        hasIndex: !this.preview,
        index: this.index,
      });
      this.showChoices = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.media-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border-radius: $radius;
  overflow: hidden;
}

.media-content__container {
  padding: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-button {
  margin-bottom: 8px;
}

.gallery {
  margin-top: 0;
}

.preview {
  width: 100%;
  height: 100%;
  user-select: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.preview__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}
</style>
