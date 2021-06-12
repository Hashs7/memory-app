<template>
  <div>
    <FeedMemoryCarousel :data="memoriesFavInstru"> </FeedMemoryCarousel>

    <section
      v-for="categoryId in memoriesCat"
      :key="categoryId.id"
      class="o-section"
    >
      <div class="o-section__head">
        <h4 class="o-section__title">{{ categoryId.category.name }}</h4>
      </div>

      <FeedMemoryCarousel :data="categoryId.memories"> </FeedMemoryCarousel>
    </section>
  </div>
</template>

<script>
import FeedMemoryCarousel from './FeedMemoryCarousel';
export default {
  name: 'FeedMemorySection',
  components: { FeedMemoryCarousel },
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
  computed: {},
};
</script>

<style scoped></style>
