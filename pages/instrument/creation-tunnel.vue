<template>
  <div class="o-container instru-tunnel__container">
    <section v-if="index === 0" class="instru-tunnel__section">
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

    <section v-if="index === 1" class="instru-tunnel__section">
      <div class="instru-tunnel__text">
        <h2>Nomme ton instrument</h2>
        <p>Quel petit nom pour ton instrument ?</p>
      </div>
      <img
        class="instru-tunnel__img"
        src="~/assets/img/tunnel_name.png"
        alt="Nom instrument"
      />
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
      <img
        class="instru-tunnel__img"
        src="~/assets/img/tunnel_calendar.png"
        alt="Date instrument"
      />
      <input
        v-model="instrument.buyDate"
        class="slider__date-input instru-tunnel__input"
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
      <img
        class="instru-tunnel__img"
        src="~/assets/img/tunnel_sonority.png"
        alt="Sonority instrument"
      />
      <AudioRecorder />
    </section>

    <div class="buttons_container">
      <div v-if="index !== 0" class="o-page__actions">
        <p class="btn-pass" @click="skip">Retour</p>
      </div>

      <div v-if="index < sections.length - 1" class="o-page__actions">
        <button class="u-button instru-tunnel__button" @click="next">
          Suivant
        </button>
      </div>
      <div v-if="index === sections.length - 1" class="o-page__actions">
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
import IconMedia from '~/assets/svg/ic_camera.svg?inline';

export default {
  name: 'NewInstrumentTunnel',
  components: {
    AudioRecorder,
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
      this.index -= 1;
    },

    redirect(id) {
      this.$router.push({
        name: 'instrument-id',
        params: { id },
      });
    },

    submitInstrument() {
      const isEmpty = !Object.values(this.instrument).some(
        (x) => x !== null && x !== '' && x.length > 0
      );

      if (!isEmpty) {
        try {
          return this.$api.newInstrument(this.instrument).then((res) => {
            this.redirect(res.data.id);
          });
        } catch (e) {
          throw new Error(e);
        }
      }
    },

    previewImg() {
      const fileReader = new FileReader();
      [...this.$refs.file.files].forEach((f) => {
        fileReader.readAsDataURL(f);
        fileReader.addEventListener('loadend', (e) => this.uploadImg(e, f));
      });
    },

    async uploadImg(event, file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await this.$api.uploadFile(formData);
        this.instrument.images.push(data.response._id);
        this.imagePath = data.response.path;
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
.buttons_container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.instru-tunnel__text {
  margin-top: 70px;
  & p {
    margin-top: 20px;
  }
}
.instru-tunnel__img {
  margin-top: 50px;
}

.instru-tunnel__input {
  margin-top: 50px;
  width: 100%;
}
.instru-tunnel__button {
  padding: 0 52px;
  @include button-background;
}
.btn-pass {
  padding: 0 52px;
}
.instru-tunnel__section {
  height: 615px;
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
  height: 100vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  text-align: center;
}

.instru-tunnel__photo {
  background-color: $background-darker;
  border: none;
  margin-top: 50px;

  .photo-help {
  }
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
