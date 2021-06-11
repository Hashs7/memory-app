<template>
  <div class="o-page o-page--full with-nav">
    <div class="media-preview">
      <ButtonBack emit @back="close" />
      <div class="o-page__outside">
        <img v-if="isImage" class="" :src="media.path" alt="" />
        <div v-if="isAudio" class="">
          <canvas id="canvas" class="audio-vizualiser"></canvas>
          <audio id="audio-element" controls>
            <source :src="media.path" :type="media.mimetype" />
            Sorry, your browser doesn't support embedded videos.
          </audio>
        </div>
        <video v-if="isVideo" controls>
          <source :src="media.path" :type="media.mimetype" />
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
      <div class="media-preview__actions">
        <a :href="downloadUrl" class="u-button--action">
          <IconDownload />
        </a>
        <button class="u-button--action" @click="deleteMedia">
          <IconTrash />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Wave from '@foobar404/wave';
import IconTrash from '@/assets/svg/ic_trash.svg?inline';
import IconDownload from '@/assets/svg/ic_download.svg?inline';
import ButtonBack from '../UI/ButtonBack';

export default {
  name: 'MediaPreview',
  components: {
    ButtonBack,
    IconTrash,
    IconDownload,
  },
  props: {
    media: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      wave: null,
    };
  },
  computed: {
    downloadUrl() {
      return `${this.media.path}?download=true`;
    },
    isImage() {
      return this.media.mimetype.split('/')[0] === 'image';
    },
    isVideo() {
      return this.media.mimetype.split('/')[0] === 'video';
    },
    isAudio() {
      return this.media.mimetype.split('/')[0] === 'audio';
    },
  },
  mounted() {
    if (!this.isAudio) return;
    this.enableAudio();
  },
  methods: {
    close() {
      this.$store.commit('gallery/setPreview', null);
    },
    async deleteMedia() {
      try {
        await this.$store.dispatch('gallery/deleteMedia', this.media._id);
        this.close();
      } catch (e) {
        console.log(e);
      }
    },
    enableAudio() {
      const canvas = document.getElementById('canvas');
      canvas.width = window.innerWidth;
      canvas.height = (9 / 16) * window.innerWidth;

      this.wave = new Wave();
      this.wave.fromElement('audio-element', 'canvas', {
        type: 'dualbars',
        colors: ['#373737', '#373737'],
      });
    },
  },
};
</script>

<style scoped>
.media-preview {
  height: 100%;
  position: relative;
}

.media-preview__actions {
  position: absolute;
  bottom: 20px;
  right: 0;
}
.audio-vizualiser {
  display: block;
  width: 100%;
}
</style>
