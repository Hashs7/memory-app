<template>
  <div class="capture-actions">
    <IlluCapture class="illu-capture" />

    <div class="action" role="button">
      <h3 class="action__title">Capturer un moment</h3>
      <p class="action__description">
        Ajouter un média rapidement à ta galerie.
      </p>
      <input
        ref="file"
        class="u-button__input-file"
        type="file"
        accept="audio/*,video/*,image/*"
        style="opacity: 0"
        @change="previewImg"
      />
    </div>

    <NuxtLink class="action" :to="newMemory">
      <h3 class="action__title">Écrire un memory</h3>
      <p class="action__description">
        Raconte-nous un instant de vie avec ton instrument
      </p>
    </NuxtLink>
  </div>
</template>

<script>
import IlluCapture from '@/assets/svg/illu_capture.svg?inline';

export default {
  name: 'CaptureActions',
  components: {
    IlluCapture,
  },
  computed: {
    newMemory() {
      return {
        name: 'souvenir-creation/souvenir/creation',
      };
    },
  },
  methods: {
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
        this.$store.commit('gallery/addMedia', data.response);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style lang="scss">
.illu-capture {
  display: block;
  width: 184px;
  margin: 64px auto;
}

.action {
  cursor: pointer;
  display: block;
  position: relative;
  padding: 16px 32px 32px 32px;
  border: 1px solid $gray-darkest;
  border-radius: 4px;

  &:not(:last-child) {
    margin-bottom: 16px;
  }

  &:after {
    content: '';
    position: absolute;
    top: 22px;
    left: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid $gray-darkest;
  }
}
.action__title {
  font-family: $font-primary;
  font-weight: 500;
  margin-bottom: 16px;
}
.action__description {
  line-height: 1.2;
  font-weight: 300;
}
</style>
