<template>
  <div class="o-page o-page__container instru-tunnel__container o-page__flex">
    <section v-show="index === 0" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Cheeeese !</h2>
        <p>Ajoute une photo de ton instrument préféré</p>
      </div>

      <div
        class="photo-placeholder instru-tunnel__img"
        :style="{
          backgroundImage: `url(${imagePath})`,
        }"
      >
        <div v-if="!hasImg" class="photo-help">
          <IconMedia />
          <p>Ajoutez une photo</p>
        </div>
        <input
          ref="file"
          class="u-button__input-file"
          type="file"
          accept="audio/*,video/*,image/*"
          style="opacity: 0"
          @change="previewImg"
        />
      </div>
    </section>

    <section v-show="index === 1" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Nomme ton instrument</h2>
        <p>Quel petit nom pour ton instrument ?</p>
      </div>
      <img
        class="instru-tunnel__img"
        src="~/assets/img/tunnel_name.png"
        alt="Nom instrument"
      />
      <div class="form__group">
        <input
          v-model="instrument.name"
          name="name"
          type="text"
          class="instru-tunnel__input form__input"
          placeholder="Son p'tit nom"
        />
      </div>
    </section>
    <section v-show="index === 2" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Année de rencontre</h2>
        <p>Quand est-ce que cet instrument est devenu le votre ?</p>
      </div>
      <img
        class="instru-tunnel__img"
        src="~/assets/img/tunnel_calendar.png"
        alt="Date instrument"
      />
      <div class="form__group">
        <input
          v-model="instrument.buyDate"
          class="slider__date-input instru-tunnel__input form__input"
          type="date"
          name="date"
          placeholder="Sélectionner une date"
        />
      </div>
    </section>

    <CreationStep3 v-show="index === 3" class="instru-tunnel__section" />

    <div class="buttons_container o-page__actions">
      <button v-if="index !== 0" class="btn-pass">
        <span @click="skip">Retour</span>
      </button>

      <button
        v-if="index < sections.length - 1"
        class="u-button instru-tunnel__button"
        @click="next"
      >
        Suivant
      </button>
      <button
        v-if="index === sections.length - 1"
        class="u-button instru-tunnel__button"
        @click="submitInstrument"
      >
        Terminer
      </button>
    </div>
  </div>
</template>

<script>
import CreationStep3 from '../../components/instrument/form/CreationStep3';
import IconMedia from '~/assets/svg/ic_camera.svg?inline';

export default {
  name: 'NewInstrumentTunnel',
  components: {
    CreationStep3,
    IconMedia,
  },
  layout: 'none',
  data() {
    return {
      instrument: {
        name: null,
        buyDate: null,
        username: null,
        sonority: null,
        images: [],
      },
      hasImg: false,
      imagePath: '/img/background_addimg.png',
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

      if (this.sections[this.index] === 'images') {
        this.instrument.images.push();
      }
      this.index += 1;
    },

    skip() {
      this.index -= 1;
    },

    redirect(id) {
      if (!id) {
        this.$router.push({
          name: 'instrument',
        });
        return;
      }
      this.$router.push({
        name: 'instrument-id',
        params: { id },
      });
    },

    async submitInstrument() {
      if (this.audio) {
        this.instrument.sonority = this.audio._id;
      }

      const isEmpty = !Object.values(this.instrument).some(
        (x) => x !== null && x !== '' && x.length > 0
      );

      if (!isEmpty) {
        try {
          const res = await this.$api.newInstrument(this.instrument);
          this.redirect(res.data.id);
          return;
        } catch (e) {
          console.log(e);
        }
      }
      this.redirect();
    },

    previewImg() {
      const fileReader = new FileReader();
      if (!this.$refs.file.files.length) return;
      const f = this.$refs.file.files[0];
      fileReader.readAsDataURL(f);
      fileReader.addEventListener('loadend', (e) => {
        this.imagePath = fileReader.result;
        this.uploadImg(e, f);
      });
    },

    async uploadImg(event, file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await this.$api.uploadFile(formData);
        this.instrument.images.push(data.response._id);
        this.hasImg = true;
        this.$store.commit('gallery/addMedia', data.response);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style lang="scss">
.instru-tunnel__container {
  .buttons_container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .u-button {
    margin: 0 2px;
    width: calc(50% - 4px);
  }
}

.instru-tunnel__text {
  margin-top: 70px;
  & p {
    margin-top: 20px;
  }
}

.instru-tunnel__img {
  margin-top: 50px;
  height: 200px;
}

.instru-tunnel__input {
  margin: 50px auto auto auto;
  width: 100%;
}

.instru-tunnel__button {
  @include button-background;
}

.btn-pass {
  padding: 0 52px;
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.instru-tunnel__section {
  //height: 615px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  & .audio-recorder {
    background-color: transparent;
  }
  .record {
    background-color: #9b988c !important;
  }
  .audio-recorder__btn {
    padding: 0;
    border: 7px solid #f3ecd4;
  }
}

.instru-tunnel__container {
  text-align: center;
}

.instru-tunnel__photo {
  background-color: $background-darker;
  border: none;
  margin-top: 50px;
}

.photo-placeholder {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 408px;
  width: 290px;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  .photo-help {
    font-size: 14px;
    color: #928f82;
    p {
      margin-top: 16px;
    }
  }
}
</style>
