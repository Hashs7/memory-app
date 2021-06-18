<template>
  <div class="media-modal o-page--full">
    <div class="media-modal__container">
      <div class="media-modal__head">
        <ButtonBack emit @back="closeModal" />
        <p class="">Galerie Memory Motel</p>
        <button @click="addContent">valider</button>
      </div>
      <div class="media-modal__body">
        <slot />
      </div>
    </div>
    <div class="media-modal__background o-page--full" @click="closeModal"></div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import ButtonBack from '../../UI/ButtonBack';

export default {
  name: 'MediaModal',
  components: { ButtonBack },
  computed: {
    ...mapState('memory', ['modal']),
  },
  methods: {
    ...mapActions('memory', ['addContent']),
    ...mapMutations('memory', ['closeModal']),
    validate() {},
  },
};
</script>

<style lang="scss" scoped>
.media-modal {
  z-index: 10;
  padding-top: 60px;
}

.media-modal__background {
  z-index: 1;
  @include blurred-background;
  background-color: rgba(0, 0, 0, 0.2);
}

.media-modal__container {
  position: relative;
  z-index: 10;
  height: 100%;
  border-radius: 22px 22px 0 0;
  background-color: $background;
}

.media-modal__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.media-modal .gallery-element {
  padding-top: 4px;
  //margin-top: -1px;
}
</style>
