<template>
  <div class="audio-gallery">
    <div class="audio-view">
      <div class="audio-container">
        <AudioItem
          v-for="(aud, i) in audios"
          :key="i"
          :audio="aud"
          class="audio-item"
          :show-player="current === aud._id"
          :deletable="deleteFiles"
          :seletable="selectFiles"
          @selected="audioSelected(aud._id)"
        />
      </div>
    </div>

    <div v-if="recorder" class="o-page__outside audio-gallery__recorder">
      <AudioRecorder light />
    </div>
  </div>
</template>

<script>
import AudioRecorder from './AudioRecorder';
import AudioItem from './AudioItem';

export default {
  name: 'AudioGallery',
  components: {
    AudioItem,
    AudioRecorder,
  },
  props: {
    recorder: {
      type: Boolean,
      default: false,
    },
    deleteFiles: {
      type: Boolean,
      default: false,
    },
    selectFiles: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      current: null,
    };
  },
  computed: {
    audios() {
      return this.$store.getters['gallery/getAudios'];
    },
  },
  methods: {
    audioSelected(index) {
      this.current = index;
    },
  },
};
</script>

<style lang="scss">
.audio-item__date {
  font-size: 12px;
}

.audio-container {
}

.audio-gallery {
  display: flex;
  flex-direction: column;
  //height: calc(100vh - 264px);
}

.audio-gallery__recorder {
  //position: fixed;
  //bottom: 72px;
  //left: 0;
  //right: 0;
}
.o-page--gallery {
  .audio-view {
    max-height: calc(
      100vh - 404px - env(safe-area-inset-top, 0) -
        env(safe-area-inset-bottom, 0)
    );
    height: calc(
      100vh - 404px - env(safe-area-inset-top, 0) -
        env(safe-area-inset-bottom, 0)
    );
    overflow: scroll;
  }
}

.o-page--gallery {
  //padding-bottom: 220px !important;
  /*.audio-gallery__recorder {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 72px;
  }*/
}
</style>
