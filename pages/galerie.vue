<template>
  <div class="o-page o-page--gallery o-page__container o-page__flex">
    <h1 class="o-page__title">Galerie</h1>
    <TabSections :sections="sections" class="o-page__body">
      <template #section0>
        <Gallery preview />
      </template>
      <template #section1>
        <AudioGallery delete-files recorder />
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

<style lang="scss">
.o-page--gallery {
  .o-page__body {
    display: flex;
    flex-direction: column;
  }

  .tab-sections {
    flex-grow: 1;
  }
}
</style>
