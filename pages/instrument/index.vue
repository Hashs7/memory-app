<template>
  <div class="o-page o-page__container">
    <h1 class="o-page__title">Mon motel</h1>
    <div class="o-page__body">
      <section class="view view--instrument-list">
        <nav class="o-section__head tab-nav">
          <button
            v-for="(s, i) in sections"
            :key="i"
            :class="{ current: selectedSection === s.name }"
            class="tab-nav__item"
            @click="showSection(s.name)"
          >
            {{ s.nav }}
          </button>
        </nav>

        <div class="instrument-sections">
          <section v-for="(s, i) in sections" :key="i" class="">
            <div
              v-if="selectedSection === s.name"
              :class="motel[s.name].length ? [s.class] : 'empty-instrument'"
              class="instruments-container"
            >
              <NuxtLink
                v-if="selectedSection === 'user'"
                to="/instrument/creation-tunnel"
                class="u-button u-button--background create-instrument"
              >
                <div class="u-button__content">
                  <IconAdd />
                  <span>Ajouter</span>
                </div>
                <IconRectangle class="u-button__bg" />
              </NuxtLink>

              <template v-if="motel[s.name].length">
                <InstrumentPreview
                  v-for="ins in motel[s.name]"
                  :key="ins.id"
                  :data="ins"
                  :show-favorite="s.name === 'wish'"
                />
              </template>
              <EmptyInstrument v-else />
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<router>
  alias:
    - /motel
</router>

<script>
import IconRectangle from '@/assets/svg/ic_rectangle.svg?inline';
import IconAdd from '@/assets/svg/ic_add.svg?inline';
import InstrumentPreview from '@/components/instrument/InstrumentPreview';
import EmptyInstrument from '../../components/instrument/EmptyInstrument';

export default {
  components: { EmptyInstrument, InstrumentPreview, IconRectangle, IconAdd },
  middleware: 'auth',
  data() {
    return {
      selectedSection: null,
      sections: [
        {
          name: 'user',
          nav: 'Actuels',
          class: 'user-instrument',
        },
        {
          name: 'old',
          nav: 'Anciens',
          class: 'old-instrument',
        },
        {
          name: 'wish',
          nav: 'Favoris',
          class: 'wish-instrument',
        },
      ],
    };
  },
  async fetch() {
    this.showSection('user');
    await this.$store.dispatch('motel/getUserInstruments');
  },
  computed: {
    motel() {
      return this.$store.state.motel;
    },
  },
  fetchOnServer: false,
  methods: {
    showSection(name) {
      this.selectedSection = name;
    },
  },
};
</script>

<style lang="scss" scoped>
.create-instrument {
  margin-bottom: 8px;
  grid-column-start: 1;
  grid-column-end: 3;
}

.instruments-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;

  &.user-instrument {
    display: block;
  }
}

.create-instrument {
  width: 100%;
}
</style>
