<template>
  <div class="o-page o-page--user">
    <div class="user__header">
      <ButtonBack light class="user-back" />
      <div v-if="isOwner" class="owner">
        <NuxtLink to="profil/edit" class="btn-edit">Modifier</NuxtLink>
      </div>
    </div>
    <div class="user-banner">
      <img src="http://seb-mbp.local:3000/file/guitar1975.jpg" alt="" />
    </div>
    <div class="user-infos">
      <div v-if="user.thumbnail" class="user-thumbnail">
        <img
          :src="user.thumbnail.path"
          :alt="`Photo de profil de ${user.firstName}`"
        />
      </div>
      <h1 v-if="name" class="user-name">
        {{ name }}
      </h1>
      <p class="user-username">
        @<span>{{ user.username }}</span>
      </p>
    </div>

<<<<<<< HEAD
    <section class="o-page__container">
=======
    <div v-if="isCurrentUser" class="">
      <NuxtLink to="/profil/edit" class="u-button u-button--primary"
        >Modifier mon compte</NuxtLink
      >
      <Logout>Déconnexion</Logout>
    </div>

    <section class="">
>>>>>>> feature/instrument
      <TabSections :sections="sections" :show-index="true" />
    </section>
  </div>
</template>

<script>
<<<<<<< HEAD
import TabSections from '@/components/layout/TabSections';
import ButtonBack from '../../components/UI/ButtonBack';

export default {
  name: 'UserProfile',
  components: { ButtonBack, TabSections },
=======
import TabSections from '../../components/layout/TabSections';
import Logout from '../../components/user/Logout';

export default {
  name: 'UserProfile',
  components: { Logout, TabSections },
>>>>>>> feature/instrument
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
<<<<<<< HEAD
    name() {
      if (!this.user.firstName) return null;
      let txt = this.user.firstName;
      const shortLast = this.user.lastName?.charAt(0);
      if (shortLast) {
        txt += ` ${shortLast}.`;
      }
      return txt;
    },
    isOwner() {
      return this.$auth.$state.user._id === this.user._id;
=======
    isCurrentUser() {
      return this.$auth.$state.user.username === this.user.username;
>>>>>>> feature/instrument
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

<style lang="scss"></style>
