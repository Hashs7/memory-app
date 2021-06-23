<template>
  <div class="media-modal o-page--full">
    <div class="media-modal__container o-page__container">
      <div class="media-modal__body">
        <slot />
      </div>
      <div class="media-modal__footer">
        <button class="u-button u-button--secondary" @click="closeModal">
          Annuler
        </button>
      </div>
    </div>
    <div class="media-modal__background o-page--full" @click="closeModal"></div>
  </div>
</template>

<script>
export default {
  name: 'InstrumentModal',
  mounted() {
    document.body.style.position = 'fixed';
  },
  beforeDestroy() {
    document.body.style.position = '';
  },
  methods: {
    closeModal() {
      console.log('close');
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.media-modal {
  z-index: 1000;
  padding-bottom: calc(72px + env(safe-area-inset-bottom, 0));
}

.media-modal__footer {
  margin-top: 24px;
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
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
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
