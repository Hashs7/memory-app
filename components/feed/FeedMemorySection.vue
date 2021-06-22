<template>
  <section>
    <p>lol</p>
    <FeedMemoryCarousel
      v-if="memoriesFavInstru && memoriesFavInstru.length"
      :data="memoriesFavInstru"
    />
    <EmptyInstrument v-else />
    <section
      v-for="categoryId in categoriesArray"
      :key="categoryId.id"
      class="o-section"
    >
      <p>{{ categoryId }}</p>
      <div class="o-section__head">
        <h4 class="o-section__title">{{ memoriesCat[categoryId].name }}</h4>
      </div>

      <FeedMemoryCarousel :data="memoriesCat[categoryId].memories" />
    </section>
  </section>
</template>

<script>
import EmptyInstrument from '../instrument/EmptyInstrument';
import FeedMemoryCarousel from './FeedMemoryCarousel';
export default {
  name: 'FeedMemorySection',
  components: { EmptyInstrument, FeedMemoryCarousel },
  props: {
    memoriesFavInstru: {
      type: Array,
      default: () => [],
    },
    memoriesCat: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    categoriesArray() {
      console.log(Object.keys(this.memoriesCat));
      return Object.keys(this.memoriesCat);
    },
  },
  watch: {
    memoriesCat(newValue) {
      console.log('newValue', newValue);
    },
  },
};
</script>

<style scoped></style>
