<template>
  <div class="o-page">
    <div class="o-page__header">
      <SearchBar />
<<<<<<< HEAD
      <transition name="fade" mode="out-in">
        <NuxtLink v-if="!searchActive" to="/profil" class="profile">
          <span v-if="!$auth.loggedIn">Profil</span>
          <img
            v-if="profilePicture"
            :src="profilePicture"
            alt="Photo de profil"
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
=======
      <NuxtLink :to="profileLink" class="profile">
        <IconUser v-if="!$auth.loggedIn || !profilePicture" />
        <img
          v-if="profilePicture"
          :src="profilePicture"
          alt="photo de profil"
        />
      </NuxtLink>
>>>>>>> feature/instrument
    </div>

    <div class="o-page__body">
      <h1 class="o-page__title">Explorer</h1>

      <section class="o-section">
        <div class="o-section__head">
          <h4 class="o-section__title">Actualités des instruments favoris</h4>
          <button class="u-link">Voir tout</button>
        </div>
      </section>
    </div>
  </div>
</template>

<router>
  path: /decouvrir
</router>

<script>
<<<<<<< HEAD
import { mapMutations, mapState } from 'vuex';
import SearchBar from '../components/search/SearchBar';
import SearchModal from '../components/search/SearchModal';

export default {
  components: { SearchModal, SearchBar },
=======
import IconUser from '@/assets/svg/ic_user.svg?inline';
import SearchBar from '../components/layout/SearchBar';

export default {
  components: { SearchBar, IconUser },
>>>>>>> feature/instrument
  async fetch() {
    try {
      const res = await this.$api.getInstruments();
      this.instruments = res.data;
    } catch (e) {
      throw new Error(e);
    }
  },
  computed: {
    ...mapState('search', { searchActive: 'active' }),
    profilePicture() {
      return this.$auth.user?.thumbnail?.path;
    },
    username() {
      return this.$auth.$state.user.username;
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
  },
  methods: {
    ...mapMutations('search', {
      setSearchActive: 'setActive',
    }),
  },
};
</script>

<style lang="scss" scoped>
.o-page__header {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.o-page__title {
  margin-top: 20px;
}

.profile {
  width: 36px;
  height: 36px;
  margin-left: 12px;
  background-color: $background-darker;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
