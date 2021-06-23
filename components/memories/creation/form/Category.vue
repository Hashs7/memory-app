<template>
  <ul class="categories-filters">
    <vue-scroll>
      <li
        v-for="category in selectionCategories"
        :key="category._id"
        :class="{ selected: isSelected(category._id) }"
        @click="toggleCategory(category._id)"
      >
        {{ category.name }}
      </li>
    </vue-scroll>
  </ul>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Category',

  data() {
    return {
      selectionCategories: [],
    };
  },
  async fetch() {
    if (!this.$auth.loggedIn) return;
    try {
      const categories = await this.$api.fetchAllCategories();
      this.selectionCategories = categories.data.map((category) => {
        return category;
      });
    } catch (e) {
      console.log(e);
    }
  },

  computed: {
    categories() {
      return this.$store.state.memory.data?.categories;
    },
  },

  methods: {
    isSelected(id) {
      return this.categories.includes(id);
    },

    ...mapMutations('memory', ['toggleCategory']),
  },
};
</script>

<style lang="scss">
.categories-filters .__view {
  display: flex;
  padding: 0 16px 8px 16px;
}

.categories-filters li {
  white-space: nowrap;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  margin-right: 4px;
  font-size: 14px;
  font-weight: 400;
  border: solid 1px $background-darker;
  border-radius: 6px;

  &:last-child {
    margin-right: 0;
  }
}

.categories-filters li.selected {
  background-color: $background-darker;
}
</style>
