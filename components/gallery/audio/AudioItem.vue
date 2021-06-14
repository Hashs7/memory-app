<template>
  <div class="audio-item" @click="$emit('selected')">
    <AudioPlayer v-if="showPlayer" :media="audio" />
    <div class="audio-item__infos">
      <div class="left">
        <p>{{ audio.name }}</p>
        <p v-if="audio.date" class="audio-item__date">{{ date(audio.date) }}</p>
      </div>

      <button v-if="deletable" class="btn-delete" @click="deleteMedia">
        <IconTrash />
      </button>
    </div>
    <button
      :class="{ selected }"
      class="btn-select"
      type="button"
      @click.stop="selectMedia"
    >
      <span class="selected-dot"></span>
    </button>
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
    deletable: {
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
  computed: {
    selected() {
      return !!this.$store.state.gallery.selected.audio.find(
        (el) => el === this.audio._id
      );
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
    selectMedia() {
      if (this.selected) {
        this.$store.commit('gallery/removeSelected', {
          type: 'audio',
          id: this.audio._id,
        });
        return;
      }
      this.$store.commit('gallery/addSelectedAudio', this.audio._id);
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

.btn-select {
  position: absolute;
  bottom: 30px;
  right: 20px;
  width: 26px;
  height: 26px;
  border: 1px solid $gray-darkest;
  background-color: transparent;
  border-radius: 50%;
  padding: 2px;

  .selected-dot {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  &.selected .selected-dot {
    background-color: $gray-darkest;
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
