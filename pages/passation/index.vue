<template>
  <div class="o-page o-page--handover o-page__flex">
    <div class="o-page__header o-page__header-nav">
      <ButtonBack emit @back="stepBack" />
    </div>
    <h1 class="o-page__title o-page__container">{{ title[step - 1] }}</h1>
    <div class="step-container o-page__body o-page__container">
      <component
        :is="`Step${i}`"
        v-for="i in MAX_STEP"
        v-show="step === i"
        :key="i"
        :show="step === i"
      />
    </div>
    <div class="o-page__container">
      <button
        v-if="step !== MAX_STEP"
        class="u-button u-button--primary"
        @click="stepNext"
      >
        Suivant
      </button>
      <button v-else class="u-button u-button--primary" @click="redirect">
        Terminer
      </button>
    </div>
  </div>
</template>

<router>
  path: /instrument/:id/passation
</router>

<script>
import Step1 from '../../components/instrument/handover/Step1';
import Step2 from '../../components/instrument/handover/Step2';
import Step3 from '../../components/instrument/handover/Step3';
import ButtonBack from '../../components/UI/ButtonBack';

export default {
  components: { ButtonBack, Step1, Step2, Step3 },
  async asyncData({ $api, store, params }) {
    const instrument = (await $api.getInstrumentById(params.id))?.data;
    store.commit('instrument/setInstrumentData', instrument);
  },
  data() {
    return {
      MAX_STEP: 3,
      step: 1,
      title: [
        'Quand a lieu l’échange ?',
        'Bon échange !',
        'Ce n’est qu’un au revoir',
      ],
    };
  },
  computed: {
    instrumentId() {
      return this.$route.params.id;
    },
    date() {
      return this.$store.state.handover.date;
    },
  },
  mounted() {
    this.$store.commit('handover/setDate', null);
    this.$store.commit('handover/setSenderToken', null);
  },
  methods: {
    redirect() {
      this.$router.push({
        name: 'instrument',
      });
    },
    stepBack() {
      if (this.step === 1) {
        this.$router.go(-1);
        return;
      }
      this.step -= 1;
    },
    stepNext() {
      if (this.step === 1) {
        if (!this.date) return;
        this.requestHandover();
      }
      if (this.step === this.MAX_STEP) return;
      this.step += 1;
    },
    async requestHandover() {
      try {
        const res = await this.$api.handoverInstrument(
          this.instrumentId,
          this.date
        );
        this.$store.commit('handover/setSenderToken', res.data.token);
      } catch (e) {
        // console.error(e);
      }
    },
  },
};
</script>

<style lang="scss">
.o-page--handover {
  .u-button {
    width: 100%;
  }
  .u-button + .u-button {
    margin-top: 8px;
  }
}
</style>
