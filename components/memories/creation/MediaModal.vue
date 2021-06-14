<template>
  <div class="media-modal o-page--full">
    <div class="media-modal__head">
      <ButtonBack emit @back="closeModal" />
      <p class="media-modal__head">Galerie Memory Motel</p>
      <button @click="addContent">valider</button>
    </div>
    <div class="media-modal__body">
      <slot />
    </div>
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
  top: 60px;
  background-color: $background;
}
</style>
