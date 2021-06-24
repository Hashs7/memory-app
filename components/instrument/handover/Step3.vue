<template>
  <div class="step step-3" :class="{ show }">
    <nav class="o-section__head tab-nav">
      <button class="tab-nav__item current">
        <span>Maintenant</span>
      </button>
    </nav>
    <div class="instrument-container">
      <img class="background front" :src="illu" alt="" />
      <Background class="background" />
      <div ref="thumbnail" class="instrument__thumbnail">
        <img
          v-if="thumbnail"
          class=""
          :src="thumbnail.path"
          alt="image de l'instrument"
        />
      </div>
    </div>
    <p class="handover__title">Ce n’est pas fini !</p>
    <p class="handover__description">
      Vous pourrez toujours suivre la vie de votre instrument dans votre Motel
      en “Instrument Passés”
    </p>
  </div>
</template>

<script>
import gsap from 'gsap';
import Background from '@/assets/svg/handover/instrument-background.svg?inline';
import illu from '~/assets/img/illu_handover.gif';

export default {
  name: 'Step3',
  components: {
    Background,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      illu,
    };
  },
  computed: {
    instrument() {
      return this.$store.state.instrument.data;
    },
    thumbnail() {
      return this.$store.state.instrument.data.images[0];
    },
  },
  watch: {
    show(newVal) {
      if (!newVal) return;
      gsap.fromTo(
        this.$refs.thumbnail,
        {
          css: { filter: 'grayscale(0%)', '-webkit-filter': 'grayscale(0%)' },
        },
        {
          css: {
            filter: 'grayscale(100%)',
            '-webkit-filter': 'grayscale(100%)',
          },
          delay: 1,
          duration: 2,
        }
      );
    },
  },
};
</script>
