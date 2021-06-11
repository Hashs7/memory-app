<template>
  <div class="o-page o-page__container">
    <h1 class="o-page__title">Galerie</h1>
    <TabSections :sections="sections">
      <template #section0>
        <Gallery preview />
      </template>
      <template #section1>
        <AudioGallery />
      </template>
    </TabSections>
  </div>
</template>

<script>
import Gallery from '../components/gallery/Gallery';
import AudioGallery from '../components/gallery/audio/AudioGallery';
import TabSections from '../components/layout/TabSections';

export default {
  name: 'Galerie',
  components: { TabSections, AudioGallery, Gallery },
  data() {
    return {
      sections: [
        {
          name: 'medias',
          class: 'medias',
          nav: 'Photos et vidéos',
        },
        {
          name: 'audios',
          class: 'audios',
          nav: 'Audios',
        },
      ],
    };
  },
};
</script>

<style scoped></style>
