<template>
  <ContentForm
    v-if="!showSummary"
    @next="showSummary = true"
    @back="$router.back()"
  />
  <Summary v-else @back="showSummary = false" @submit="submit" />
</template>

<router>
  path: /instrument/:id/souvenir/creation
  alias:
    -
      path: /souvenir/creation
</router>

<script>
import { mapState } from 'vuex';
import Summary from '@/components/memories/creation/views/Summary';
import ContentForm from '../../components/memories/creation/views/ContentForm';

// TODO get instrument id
export default {
  name: 'NewInstrument',
  components: {
    ContentForm,
    Summary,
  },
  layout: 'none',
  data() {
    return {
      success: false,
      showSummary: false,
    };
  },
  computed: {
    ...mapState('memory', ['data']),
    instrumentId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.$store.commit('memory/resetState');
  },
  mounted() {
    this.$store.commit('memory/resetState');
    this.$store.commit('gallery/resetSelected');
  },
  methods: {
    // Form submitted event
    async submit() {
      try {
        await this.$api.newMemory(this.instrumentId, {
          ...this.data,
        });
        this.createdHandler();
      } catch (e) {
        this.notifyError();
      }
    },

    // Instrument created callback
    createdHandler() {
      this.$router.push({
        name: 'instrument-id',
        params: { id: this.instrumentId },
      });
    },

    notifyError() {
      this.$buefy.toast.open({
        message: "Le souvenir n'a pas pu être créé",
        type: 'is-danger',
      });
    },
  },
};
</script>

<style lang="scss">
.o-page__footer {
  display: flex;
  justify-content: space-between;
}
</style>
