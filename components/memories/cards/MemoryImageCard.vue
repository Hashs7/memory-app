<template>
  <div class="memory-image-card">
    <img
      class="memory-image-card__image"
      :src="data.file.path"
      draggable="false"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: 'MemoryImageCard',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.memory-image-card {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.memory-image-card__image {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
