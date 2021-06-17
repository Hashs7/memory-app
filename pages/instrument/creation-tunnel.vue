<template>
  <div class="o-container instru-tunnel__container">
    <section v-if="index === 0" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Cheeeese !</h2>
        <p>Ajoute une photo de ton instrument préféré</p>
      </div>

      <button
        class="u-button u-button--round instru-tunnel__photo instru-tunnel__input"
      >
        <input
          ref="file"
          class="u-button__input-file"
          type="file"
          name="image"
          accept="image/*"
          style="opacity: 0"
        />
      </button>
    </section>

    <section v-if="index === 1" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Nomme ton instrument</h2>
        <p>Quel petit nom pour ton instrument ?</p>
      </div>

      <b-input
        v-model="instrument.name"
        name="name"
        type="text"
        class="instru-tunnel__input"
        placeholder="Son p'tit nom"
      />
    </section>
    <section v-if="index === 2" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Année de rencontre</h2>
        <p>Quand est-ce que cet instrument est devenu le votre ?</p>
      </div>
      <input
        v-model="instrument.buyDate"
        class="slider__date-input"
        type="date"
        name="date"
        placeholder="Sélectionner une date"
      />
    </section>

    <section v-if="index === 3" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Son plus bel accord</h2>
        <p>
          Enregistre le son que fait ton instrument sur un accord de ton choix !
        </p>
      </div>
      <AudioRecorder />
    </section>

    <div class="buttons_container">
      <div v-if="index < sections.length" class="o-page__actions">
        <p class="btn-pass" @click="skip">Passer</p>
      </div>

      <div v-if="index < sections.length" class="o-page__actions">
        <button class="u-button instru-tunnel__button" @click="next">
          Suivant
        </button>
      </div>
      <div v-if="index === sections.length" class="o-page__actions">
        <button
          class="u-button instru-tunnel__button"
          @click="submitInstrument"
        >
          Terminer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AudioRecorder from '../../components/gallery/audio/AudioRecorder';

export default {
  name: 'NewInstrumentTunnel',
  components: {
    AudioRecorder,
  },
  data() {
    return {
      instrument: {
        name: null,
        buyDate: null,
        username: null,
        sonority: null,
        images: [],
      },
      index: 0,
      sections: ['images', 'name', 'buyDate', 'sonority'],
    };
  },
  computed: {
    audio() {
      return this.$store.getters['gallery/getLastAudio'];
    },
  },
  methods: {
    next() {
      if (this.sections[this.index] === 'name') {
        const name = document.getElementsByName('name')[0].value;
        if (name !== '') {
          this.instrument.name = name;
        }
      }

      if (this.sections[this.index] === 'date') {
        this.instrument.buyDate = document.getElementsByName('date')[0].value;
      }

      if (this.sections[this.index] === 'sonority') {
        if (this.audio) {
          this.instrument.sonority = this.audio._id;
        }
      }

      if (this.sections[this.index] === 'images') {
        this.instrument.images.push();
      }
      this.index += 1;
    },

    skip() {
      this.index += 1;
    },

    async submitInstrument() {
      const isEmpty = !Object.values(this.instrument).some(
        (x) => x !== null && x !== ''
      );
      if (!isEmpty) {
        try {
          return await this.$api.newInstrument(this.instrument);
        } catch (e) {
          throw new Error(e);
        }
      }
    },

    path() {},
  },
};
</script>

<style lang="scss">
.buttons_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}
.instru-tunnel__text {
  margin-top: 100px;
  & p {
    margin-top: 20px;
  }
}

.instru-tunnel__input {
  margin-top: 50px;
}
.instru-tunnel__button {
  padding: 0 52px;
  @include button-background;
}
.btn-pass {
  padding: 0 52px;
}
.instru-tunnel__section {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.instru-tunnel__container {
  text-align: center;
}

.instru-tunnel__photo {
  background-color: $background-darker;
  border: none;
}
</style>
