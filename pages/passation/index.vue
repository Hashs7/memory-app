<template>
  <div class="o-page">
    <h1 class="o-page__title">{{ title }}</h1>
    <div class="step-container">
      <Step1 v-show="step === 0" />
      <Step2 v-show="step === 1" :token="token" />
      <Step3 v-show="step === 2" />
    </div>
    <button
      v-if="step !== 0"
      class="u-button u-button--outline"
      @click="stepBack"
    >
      Retour
    </button>
    <button
      v-if="step !== MAX_STEP"
      class="u-button u-button--primary"
      @click="stepNext"
    >
      Suivant
    </button>
    <button v-else class="u-button u-button--primary">Terminer</button>
  </div>
</template>

<router>
path: /instrument/:id/passation
</router>

<script>
import Step1 from '../../components/instrument/handover/Step1';
import Step2 from '../../components/instrument/handover/Step2';
import Step3 from '../../components/instrument/handover/Step3';

export default {
  components: { Step1, Step2, Step3 },
  data() {
    return {
      MAX_STEP: 2,
      step: 0,
      token: null,
    };
  },
  computed: {
    instrumentId() {
      return this.$route.params.id;
    },
    title() {
      let txt;
      switch (this.step) {
        case 0:
          txt = 'Quand a lieu l’échange ?';
          break;
        case 1:
          txt = 'Bon échange !';
          break;
        case 2:
          txt = 'Ce n’est qu’un au revoir';
          break;
      }
      return txt;
    },
  },
  methods: {
    stepBack() {
      this.step -= 1;
    },
    stepNext() {
      this.step += 1;
      if (this.step === 1) {
        this.requestHandover();
      }
    },
    async requestHandover() {
      this.step = 1;
      try {
        const res = await this.$api.handoverInstrument(this.instrumentId);
        this.token = res.data.token;
        await this.showQRCode();
      } catch (e) {
        // console.error(e);
      }
    },
  },
};
</script>

<style scoped></style>
