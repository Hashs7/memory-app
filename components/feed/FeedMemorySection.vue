<template>
  <section>
    <FeedMemoryCarousel
      v-if="memoriesFavInstru && memoriesFavInstru.length"
      :data="memoriesFavInstru"
    />
    <EmptyInstrument v-else />
    <p>lol</p>
    <section
      v-for="categoryId in categoriesArray"
      :key="categoryId.id"
      class="o-section"
    >
      <p>{{ categoryId }}</p>
      <div class="o-section__head">
        <h4 class="o-section__title">{{ categoryId.category.name }}</h4>
      </div>

      <FeedMemoryCarousel :data="categoryId.memories"> </FeedMemoryCarousel>
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
      required: true,
    },
    memoriesCat: {
      type: Object,
      required: true,
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
