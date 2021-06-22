<template>
  <div class="o-page o-page--feed">
    <div class="o-page__header">
      <div class="o-page__container">
        <SearchBar />
        <transition name="fade" mode="out-in">
          <NuxtLink v-if="!searchActive" :to="profileLink" class="profile">
            <client-only>
              <IconUser v-if="!$auth.loggedIn || !profilePicture" />
            </client-only>
            <img
              v-if="profilePicture"
              :src="profilePicture"
              alt="photo de profil"
            />
          </NuxtLink>
          <button
            v-else
            class="u-button u-button--text"
            @click="setSearchActive(false)"
          >
            Annuler
          </button>
        </transition>
        <SearchModal v-if="searchActive" />
      </div>
    </div>

    <h1 class="o-page__title o-page__container">{{ title }}</h1>
    <div class="o-page__body">
      <section class="">
        <ul class="categories-filters">
          <vue-scroll>
            <li
              v-for="category in categories"
              :key="category.id"
              :class="{ selected: category.selected }"
              @click="toggleCategory(category)"
            >
              {{ category.name }}
            </li>
          </vue-scroll>
        </ul>
      </section>
      <section class="o-section">
        <div class="o-section__head actu">
          <h4 class="o-section__title">Actualités des instruments favoris</h4>
          <button class="u-link">Voir tout</button>
        </div>

        <FeedMemorySection
          v-if="results.memories"
          :memories-cat="memoriesCat"
          :memories-fav-instru="results.memories"
        />
      </section>
    </div>
  </div>
</template>

<router>
  path: /decouvrir
</router>

<script>
import { mapMutations, mapState } from 'vuex';
import IconUser from '@/assets/svg/ic_user.svg?inline';
import SearchBar from '../components/search/SearchBar';
import SearchModal from '../components/search/SearchModal';
import FeedMemorySection from '../components/feed/FeedMemorySection';

export default {
  components: { FeedMemorySection, SearchModal, SearchBar, IconUser },
  data() {
    return {
      results: {
        instruments: [],
        memories: [],
      },
      instruments: [],
      categories: [],
      memoriesCat: {},
    };
  },
  async fetch() {
    if (!this.$auth.loggedIn) return;
    try {
      const res = await this.$api.getInstruments();
      const categories = await this.$api.fetchAllCategories();
      const results = await this.$api.fetchFeedFavMemories();

      categories.data = categories.data.map((category, i) => {
        category.selected = i < 3;
        return category;
      });

      this.instruments = res.data;
      this.results = results.data;
      this.categories = categories.data;
    } catch (e) {
      console.log(e);
    }
  },
  fetchOnServer: false,
  computed: {
    ...mapState('search', { searchActive: 'active' }),
    profilePicture() {
      return this.$auth.user?.thumbnail?.path;
    },
    username() {
      return this.$auth.$state.user.username;
    },
    title() {
      if (this.$auth.$state?.user?.firstName) {
        return `Cher ${this.$auth.$state.user.firstName},`;
      }
      return 'Explorer';
    },
    profileLink() {
      if (this.$auth.loggedIn) {
        return {
          name: 'user',
          params: { user: this.username },
        };
      }
      return {
        name: 'connexion',
      };
    },
    selectedCategoriesMapped() {
      const selectedCats = this.categories?.filter((c) => {
        return c.selected;
      });
      return selectedCats?.map((s) => s._id);
    },
  },
  created() {
    this.fetchMemoriesCat();
    this.$auth.fetchUser();
  },
  methods: {
    ...mapMutations('search', {
      setSearchActive: 'setActive',
    }),

    toggleCategory(category) {
      category.selected = !category.selected;
      this.fetchMemoriesCat();
    },

    async fetchMemoriesCat() {
      try {
        const { data } = await this.$api.fetchMemoriesCat(
          this.selectedCategoriesMapped
        );
        this.memoriesCat = data;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
.o-page--feed {
  .o-page__title {
    margin-top: 0;
  }

  .o-section__head.actu {
    margin: 0 16px;
  }

  .o-page__header {
    height: 72px;
    padding: 16px 0 0 0;
  }

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

  .o-page__header {
    position: relative;
    z-index: 100;

    .o-page__container {
      display: flex;
      justify-content: space-between;
    }

    .profile {
      width: 42px;
      height: 42px;
      margin-left: 12px;
      background-color: $background-darker;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
  }
}
</style>
