<template>
  <client-only>
    <div class="o-page o-page--user">
      <div class="user__header">
        <ButtonBack v-if="!isOwner" light class="user-back" />
        <span v-else></span>
        <div v-if="isOwner" class="owner">
          <NuxtLink to="profil/edit" class="btn-edit">Modifier</NuxtLink>
        </div>
      </div>
      <!--    <div class="user-banner"></div>-->
      <div v-if="user" class="user-infos">
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
        <p v-if="user.description" class="user-description">
          {{ user.description }}
        </p>
      </div>

      <div class="o-page__container user__actions">
        <Logout v-if="isOwner" type="submit" class="button">
          Me déconnecter
        </Logout>
      </div>

      <section class="o-page__container">
        <TabSections :sections="sections" :show-index="true" />
      </section>
    </div>
  </client-only>
</template>

<script>
import TabSections from '@/components/layout/TabSections';
import ButtonBack from '../../components/UI/ButtonBack';
import Logout from '../../components/user/Logout';

export default {
  name: 'UserProfile',
  components: { Logout, ButtonBack, TabSections },
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
  async fetch() {
    try {
      const user = await this.$api.getUserByUsername(this.$route.params.user);
      const res = await this.$api.getUserInstrumentsByUsername(
        this.$route.params.user
      );
      this.user = user.data;
      this.instruments = res.data.userInstruments;
      this.memories = res.data.memories;
      this.updateSections();
    } catch (e) {
      await this.$router.push('/404/');
    }
  },
  fetchOnServer: false,
  computed: {
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
      return this.$auth.$state.user?._id === this.user?._id;
    },
    isCurrentUser() {
      return this.$auth.$state.user?.username === this.user?.username;
    },
  },
  created() {
    this.updateSections();
  },
  methods: {
    updateSections() {
      const instrumentSection = this.sections.find(
        (s) => s.name === 'instruments'
      );
      const memoriesSection = this.sections.find((s) => s.name === 'memories');
      instrumentSection.data = this.instruments;
      memoriesSection.data = this.memories;
    },
  },
};
</script>

<style lang="scss">
.user__actions {
  margin: 20px auto;
  text-align: center;
}
</style>
