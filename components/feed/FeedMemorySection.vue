<template>
  <section>
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
      <div class="o-section__head feed-head">
        <h4 class="o-section__title">
          {{ memoriesCat[categoryId].category.name }}
        </h4>
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
      return Object.keys(this.memoriesCat);
    },
  },
};
</script>

<style>
.feed-head {
  margin-left: 20px;
}
</style>
