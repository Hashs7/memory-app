<template>
  <div class="o-page o-page--full with-nav">
    <div class="media-preview">
      <button @click="$emit('close')">Retour</button>
      <div class="o-page__outside">
        <Gallery select-files @selected="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script>
import Gallery from './Gallery';

export default {
  name: 'GalleryView',
  components: { Gallery },
};
</script>

<style scoped></style>
