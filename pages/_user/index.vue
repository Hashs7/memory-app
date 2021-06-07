<template>
  <div class="o-page o-page--user">
    <div v-if="user.thumbnail" class="user-thumbnail">
      <img
        :src="user.thumbnail.path"
        :alt="`Photo de profil de ${user.firstName}`"
      />
    </div>
    <h1 v-if="user.firstName || user.lastName">
      {{ user.firstName }} {{ user.lastName }}
    </h1>
    <p>@{{ user.username }}</p>

    <div v-if="isCurrentUser" class="">
      <NuxtLink to="/profil/edit" class="u-button u-button--primary"
        >Modifier mon compte</NuxtLink
      >
      <Logout>Déconnexion</Logout>
    </div>

    <section class="">
      <TabSections :sections="sections" :show-index="true" />
    </section>
  </div>
</template>

<script>
import TabSections from '../../components/layout/TabSections';
import Logout from '../../components/user/Logout';

export default {
  name: 'UserProfile',
  components: { Logout, TabSections },
  async asyncData({ $api, params, redirect }) {
    try {
      const user = await $api.getUserByUsername(params.user);
      const instruments = await $api.getUserInstrumentsByUsername(params.user);

      return {
        user: user.data,
        instruments: instruments.data.userInstruments,
      };
    } catch (e) {
      redirect(404, '/');
    }
  },
  data() {
    return {
      user: null,
      instruments: [],
      sections: [
        {
          name: 'instruments',
          class: 'instruments',
          nav: 'Motel',
          component: 'InstrumentPreview',
          data: [],
        },
        {
          name: 'memories',
          class: 'memories',
          nav: 'Souvenirs',
          component: 'MemoryPreview',
          data: [],
        },
      ],
    };
  },
  computed: {
    isCurrentUser() {
      return this.$auth.$state.user.username === this.user.username;
    },
  },
  created() {
    const instrumentSection = this.sections.find(
      (s) => s.name === 'instruments'
    );
    const memoriesSection = this.sections.find((s) => s.name === 'memories');
    instrumentSection.data = this.instruments;
    memoriesSection.data = this.instruments.reduce(
      (acc, cur) => [...acc, ...cur.memories],
      []
    );
  },
};
</script>

<style lang="scss" scoped>
.o-page--user {
}
.user-thumbnail {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 80px auto 12px auto;
}
</style>
