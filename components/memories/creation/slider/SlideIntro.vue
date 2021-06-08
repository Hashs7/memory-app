<template>
  <div class="slider__item slider__intro">
    <div class="slider__media">
      <div
        v-if="!memory.preview.file && !showMedia"
        class="slider__select"
        @click="showMedia = true"
      >
        <div class="slider__help">
          <IconCamera />
          <p>Ajouter une photo de couverture</p>
        </div>
      </div>
      <MediaContent v-else preview :value="memory.preview" />
    </div>
    <div class="slider__date">
      <label class="o-cells__label">Date du souvenir</label>
      <input v-model="date" type="date" placeholder="Sélectionner une date" />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import MediaContent from '../contents/MediaContent';
import IconCamera from '~/assets/svg/ic_camera.svg?inline';

export default {
  name: 'SlideIntro',
  components: { MediaContent, IconCamera },
  data() {
    return {
      showMedia: false,
    };
  },
  computed: {
    memory: {
      get() {
        return this.$store.state.memory.data;
      },
      set(value) {
        this.$store.commit('memory/updateMemory', value);
      },
    },
    date: {
      get() {
        return dayjs(this.$store.state.memory.data?.date).format('YYYY-MM-DD');
      },
      set(newValue) {
        this.$store.commit('memory/updateDate', dayjs(newValue).toDate());
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.slider__intro {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.slider__media {
  flex-grow: 1;
}

.slider__date {
  margin-top: 16px;
}

.slider__select {
  background-color: $background-darker;
  border-radius: 4px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider__help {
  text-align: center;
  font-size: 14px;
}

.title__input {
  font-size: 36px;
  font-weight: 700;
  resize: none;

  &::placeholder {
    font-size: 36px;
    font-weight: 700;
  }
}
</style>
