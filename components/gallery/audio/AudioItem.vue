<template>
  <div class="audio-item" @click="$emit('selected')">
    <AudioPlayer v-if="showPlayer" :media="audio" />
    <div class="audio-item__infos">
      <div class="left">
        <p>{{ audio.name }}</p>
        <p v-if="audio.date" class="audio-item__date">{{ date(audio.date) }}</p>
      </div>

      <button v-if="showPlayer" class="btn-delete" @click="deleteMedia">
        <IconTrash />
      </button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import IconTrash from '@/assets/svg/ic_trash.svg?inline';
import AudioPlayer from './AudioPlayer';

export default {
  name: 'AudioItem',
  components: {
    AudioPlayer,
    IconTrash,
  },
  props: {
    showPlayer: {
      type: Boolean,
      default: false,
    },
    audio: {
      type: Object,
      required: true,

      date: {
        type: Date,
        required: true,
      },

      name: {
        type: Date,
        required: true,
      },
    },
  },
  methods: {
    date(d) {
      return dayjs(d).format('DD MMMM YYYY');
    },
    async deleteMedia() {
      try {
        await this.$store.dispatch('gallery/deleteMedia', this.audio._id);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-item {
  position: relative;
  padding: 20px 0;

  &:not(:last-child) {
    border-bottom: 1px solid $gray-darkest;
  }

  .btn-delete {
    background-color: transparent;
    border: none;
  }
}

.audio-item__infos {
  display: flex;
  justify-content: space-between;
  .left {
    max-width: calc(100% - 40px);
  }
}
</style>
