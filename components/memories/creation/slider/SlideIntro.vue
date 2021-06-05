<template>
  <div class="slider__item slider__intro">
    <div class="slider__media">
      <div v-if="!showMedia" class="slider__select" @click="showMedia = true">
        <div class="slider__help">
          <IconCamera />
          <p>Ajouter une photo de couverture</p>
        </div>
      </div>
      <MediaContent v-else preview :index="null" :value="memory.preview" />
    </div>
    <div>
      <label class="o-cells__label">Date</label>
      <client-only>
        <b-field>
          <b-datepicker
            :value="new Date(memory.date)"
            locale="fr"
            placeholder="Sélectionner une date"
            icon="calendar-today"
            trap-focus
            @input="updateDate($event.toISOString())"
          >
          </b-datepicker>
        </b-field>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
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
  },
  methods: {
    ...mapMutations('memory', ['updateDate']),
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
