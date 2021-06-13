<template>
  <div class="step step-1">
    <nav class="o-section__head tab-nav">
      <button class="tab-nav__item current">
        <span>Séléctionnez une date</span>
      </button>
    </nav>
    <div class="form__group">
      <input v-model="date" type="date" class="form__input" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step1',
  computed: {
    date: {
      get() {
        return this.$store.state.handover.date;
      },
      set(value) {
        this.$store.commit('handover/setDate', value);
      },
    },
  },
};
</script>

<style scoped></style>
