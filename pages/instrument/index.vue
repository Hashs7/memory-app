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
                to="/instrument/creation"
                class="u-button u-button--background create-instrument"
              >
                <div class="u-button__content">
                  <IconAdd />
                  <span>Ajouter</span>
                </div>
                <IconRectangle class="u-button__bg" />
              </NuxtLink>

              <div v-if="motel[s.name].length">
                <InstrumentPreview
                  v-for="ins in motel[s.name]"
                  :key="ins.id"
                  :data="ins"
                  :show-favorite="s.name === 'wish'"
                />
              </div>
              <div v-else-if="s.name === 'wish'">
                <img
                  src="~/assets/img/illu_face-mer.png"
                  alt="Face à la mere"
                />
                <h3>"Face à la mer !"</h3>
                <p>Calogero</p>
                <p>
                  C’est bien vide ici...<br />
                  Ajoute un instrument en favoris en cliquant sur le coeur d’un
                  instrument qui te plaît !
                </p>
              </div>
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

export default {
  components: { InstrumentPreview, IconRectangle, IconAdd },
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
}
.empty-instrument {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 70px auto 0;
  width: 90%;

  & h3 {
    margin-top: 50px;
  }
  & p {
    margin-top: 5px;
  }
  & p:last-child {
    margin-top: 35px;
  }
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
