<template>
  <div class="step step-3">
    <nav class="o-section__head tab-nav">
      <button class="tab-nav__item current">
        <span>Maintenant</span>
      </button>
    </nav>
    <div class="instrument-container">
      <Background class="background" />
      <div class="instrument__thumbnail">
        <img
          v-if="thumbnail"
          class=""
          :src="thumbnail.path"
          alt="image de l'instrument"
        />
      </div>
    </div>
    <p>Ce n’est pas fini !</p>
    <p>
      Vous pourrez toujours suivre la vie de votre instrument dans votre Motel
      en “Instrument Passés”
    </p>
  </div>
</template>

<script>
import Background from '@/assets/svg/handover/instrument-background.svg?inline';

export default {
  name: 'Step3',
  components: {
    Background,
  },
  computed: {
    instrument() {
      return this.$store.state.instrument.data;
    },
    thumbnail() {
      return this.$store.state.instrument.data.images[0];
    },
  },
};
</script>
