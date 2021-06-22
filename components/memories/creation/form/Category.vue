<template>
  <ul class="categories-filters">
    <vue-scroll>
      <li
        v-for="category in selectionCategories"
        :key="category.id"
        :class="{ selected: category.selected }"
        @click="toggleCategory(category)"
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
        category.selected = false;
        return category;
      });
    } catch (e) {
      console.log(e);
    }
  },

  computed: {
    categories: {
      get() {
        return this.$store.state.memory.data?.categories;
      },
      set(newValue) {
        this.updateCategories(newValue);
      },
    },
  },

  methods: {
    toggleCategory(category) {
      category.selected = !category.selected;
      const selectedCats = this.selectionCategories?.filter((c) => {
        return c.selected;
      });
      this.categories = selectedCats?.map((s) => s._id);
    },
    ...mapMutations('memory', ['updateCategories']),
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
