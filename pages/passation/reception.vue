<template>
  <div class="o-page o-page--handover o-page__container">
    <h1 v-if="validated && instrument" class="o-page__title">
      Vous venez de faire l'acquisition de {{ instrument.name }}
    </h1>
    <div v-if="error.hasError" class="o-page__title error">
      <h1>{{ error.message }}</h1>
    </div>

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

    <div v-if="!$auth.loggedIn" class="">
      <h1>Pour faire l'acquisition de {{ instrument.name }}</h1>
      <p>Veuillez d'abord vous authentifier</p>
      <NuxtLink :to="signIn" class="u-button u-button--primary"
        >Connexion</NuxtLink
      >
      <NuxtLink :to="signUp" class="u-button u-button--primary"
        >Inscription</NuxtLink
      >
    </div>

    <NuxtLink v-if="validated" to="/motel" class="u-button u-button--primary">
      Voir mon motel
    </NuxtLink>
  </div>
</template>

<router>
path: /instrument/:id/passation/reception
</router>

<script>
import Background from '@/assets/svg/handover/instrument-background.svg?inline';

export default {
  components: {
    Background,
  },
  data() {
    return {
      error: {
        hasError: null,
        message: '',
      },
      instrument: null,
      validated: null,
    };
  },
  async fetch({ $api, params }) {
    try {
      const res = await $api.getInstrumentById(params.id);
      this.instrument = res.data;
    } catch (e) {
      console.log(e);
    }
  },
  computed: {
    token() {
      return this.$route.query.token;
    },
    instrumentId() {
      return this.$route.params.id;
    },
    signIn() {
      return `/connexion`;
    },
    signUp() {
      return `/inscription`;
    },
    thumbnail() {
      return this.instrument?.images[0];
    },
  },
  mounted() {
    if (!this.$auth.loggedIn) {
      this.storeToken();
      return;
    }
    this.validateToken();
  },
  methods: {
    async validateToken() {
      if (!this.$route.query.token) {
        this.error.message = "Votre jeton n'est pas valide";
        this.validated = false;
        this.error.hasError = true;
        return;
      }

      try {
        await this.$api.confirmHandoverInstrument(this.token);
        this.validated = true;
      } catch (e) {
        this.error.message = e.response.data.message;
        this.error.hasError = true;
        this.validated = false;
      }
      this.$store.commit('handover/setToken', null);
      this.$store.commit('handover/setInstrumentId', null);
    },

    storeToken() {
      this.$store.commit('handover/setToken', this.token);
      this.$store.commit('handover/setInstrumentId', this.instrumentId);
    },

    notifyError(message) {
      this.$buefy.toast.open({
        message,
        type: 'is-danger',
      });
    },
  },
};
</script>

<style scoped></style>
