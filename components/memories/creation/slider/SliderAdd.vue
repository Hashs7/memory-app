<template>
  <div class="slider__item slider__add">
    <div class="slider__container">
      <button class="slider__btn" type="button" @click="showModal('media')">
        <IconMedia />
        <span class="slider__helper">Ajouter une photo ou vidéo</span>
      </button>
      <button class="slider__btn" type="button" @click="showModal('audio')">
        <IconAudio />
        <span class="slider__helper">Ajouter un enregistrement</span>
      </button>
      <button class="slider__btn" type="button" @click="addContent('text')">
        <span class="slider__btn-txt">Tt</span>
        <span class="slider__helper">Ajouter du texte</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import IconAudio from '~/assets/svg/ic_audio.svg?inline';
import IconMedia from '~/assets/svg/ic_camera.svg?inline';

export default {
  name: 'SliderAdd',
  components: { IconAudio, IconMedia },
  methods: {
    ...mapMutations('memory', ['showModal']),
    addContent(type) {
      this.$store.commit('memory/addContent', { type });
    },
  },
};
</script>

<style lang="scss" scoped>
.slider__add {
  padding: 8px;

  .u-button {
    margin: 8px;
    background-color: $background;
  }
}

.slider__container {
  height: 100%;
  align-items: center;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
  grid-row-gap: 8px;
}

.slider__btn {
  height: 100%;
  width: 100%;
  background-color: $background-darker;
  border: 2px dashed #d0c9af;
  box-shadow: none;
  border-radius: 4px;
  color: #928f82;
}

.slider__helper {
  display: block;
  font-size: 14px;
  margin-top: 16px;
}

.slider__btn-txt {
  font-size: 50px;
  font-family: $font-secondary;
}
</style>
