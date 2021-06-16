<template>
  <div class="audio-item" @click="$emit('selected')">
    <AudioPlayer v-if="showPlayer" controls progress-bar :media="audio" />
    <div class="audio-item__infos">
      <div class="left">
        <form @submit.prevent.stop="updateName">
          <input v-model="name" type="text" class="audio-item__name" />
        </form>
        <p v-if="audio.date" class="audio-item__date">{{ date(audio.date) }}</p>
      </div>

      <button v-if="deletable" class="btn-delete" @click="deleteMedia">
        <IconTrash />
      </button>
    </div>
    <button
      v-if="seletable"
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
import { mapActions } from 'vuex';
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
    seletable: {
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
  data() {
    return {
      name: '',
    };
  },
  computed: {
    selected() {
      return !!this.$store.state.gallery.selected.audio.find(
        (el) => el === this.audio._id
      );
    },
  },
  mounted() {
    this.name = this.audio.name;
  },
  methods: {
    ...mapActions('gallery', ['updateMedia']),
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
    async updateName() {
      await this.updateMedia({ id: this.audio._id, name: this.name });
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

.audio-item__name {
  padding: 0;
  font-size: 16px;
  background-color: transparent;

  &::placeholder {
    font-size: 16px;
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
