<template>
  <div class="audio-gallery">
    <div class="audio-container">
      <div v-for="(aud, i) in audios" :key="i" class="audio-item">
        <p>{{ aud.originalname }}</p>
        <p v-if="aud.date" class="audio-item__date">{{ date(aud.date) }}</p>
      </div>
    </div>
    <div class="o-page__outside">
      <AudioRecorder />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import AudioRecorder from '../AudioRecorder';

export default {
  name: 'AudioGallery',
  components: {
    AudioRecorder,
  },
  computed: {
    audios() {
      return this.$store.getters['gallery/getAudios'];
    },
  },
  methods: {
    date(d) {
      return dayjs(d).format('DD MMMM YYYY');
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-item {
  padding: 20px 0;

  &:not(:last-child) {
    border-bottom: 1px solid $gray-darkest;
  }
}

.audio-item__date {
  font-size: 12px;
}
</style>
