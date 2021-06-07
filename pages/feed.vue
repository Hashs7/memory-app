<template>
  <div class="o-page">
    <div class="o-page__header">
      <SearchBar />
      <NuxtLink :to="profileLink" class="profile">
        <IconUser v-if="!$auth.loggedIn || !profilePicture" />
        <img
          v-if="profilePicture"
          :src="profilePicture"
          alt="photo de profil"
        />
      </NuxtLink>
    </div>

    <h1 class="o-page__title">Explorer</h1>

    <section class="o-section">
      <div class="o-section__head">
        <h4 class="o-section__title">Actualités des instruments favoris</h4>
        <button class="u-link">Voir tout</button>
      </div>
    </section>
  </div>
</template>

<router>
  path: /decouvrir
</router>

<script>
import IconUser from '@/assets/svg/ic_user.svg?inline';
import SearchBar from '../components/layout/SearchBar';

export default {
  components: { SearchBar, IconUser },
  async fetch() {
    try {
      const res = await this.$api.getInstruments();
      this.instruments = res.data;
    } catch (e) {
      throw new Error(e);
    }
  },
  computed: {
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
};
</script>

<style lang="scss" scoped>
.o-page__header {
  display: flex;
  justify-content: space-between;
}

.o-page__title {
  margin-top: 20px;
}

.profile {
  width: 50px;
  height: 50px;
  margin-left: 16px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
