<template>
  <ContentForm
    v-if="currentView === 'ContentForm'"
    edit
    @back="currentView = 'Summary'"
  />
  <Summary
    v-else-if="currentView === 'Summary'"
    edit
    @back="onBack"
    @submit="onSubmit"
    @open-form="currentView = 'ContentForm'"
  />
</template>

<router>
  path: /instrument/:id/souvenir/:memoryId/edit
</router>

<script>
import { mapMutations, mapState } from 'vuex';
import ContentForm from '@/components/memories/creation/views/ContentForm';
import Summary from '@/components/memories/creation/views/Summary';

export default {
  components: { Summary, ContentForm },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('memory/resetState');
    next();
  },
  middleware: 'auth',
  async fetch() {
    const memory = (
      await this.$api.getMemoryById(
        this.$route.params.id,
        this.$route.params.memoryId
      )
    )?.data;
    await this.$store.commit('memory/setMemory', memory);
  },
  data() {
    return {
      currentView: 'Summary',
    };
  },
  computed: {
    ...mapState('memory', { memory: 'data' }),
    instrumentId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.resetSelected();
    this.closeModal();
  },
  methods: {
    ...mapMutations('memory', ['closeModal']),
    ...mapMutations('gallery', ['resetSelected']),
    onBack() {
      this.$router.push({
        name: 'instrument-id',
        params: { id: this.instrumentId },
      });
    },
    async onSubmit() {
      try {
        await this.$api.updateMemory(
          this.instrumentId,
          this.$route.params.memoryId,
          {
            ...this.memory,
          }
        );
        this.updatedHandler();
      } catch (e) {
        this.$buefy.toast.open({
          message: 'Une erreur est survenue',
          type: 'is-error',
        });
      }
    },
    updatedHandler() {
      this.$router.push({
        name: 'instrument-id',
        params: { id: this.instrumentId },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
