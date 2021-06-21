<template>
  <div class="audio-recorder">
    <div v-if="!disabled" class="audio-recorder__container">
      <div class="stopwatch">
        <StopWatch v-show="!hasAudio" ref="stopwatch" />
        <AudioPlayer v-show="hasAudio" ref="recordedAudio" light progress-bar />
      </div>
      <div class="recorder-container">
        <div class="audio-recorder__btn">
          <button
            v-show="!recordDisabled"
            ref="record"
            class="record"
            :disabled="recordDisabled"
            @click="startRecord"
          ></button>
          <button
            v-show="!stopRecordDisabled"
            ref="stopRecord"
            class="stop"
            :disabled="stopRecordDisabled"
            @click="stopRecord"
          ></button>
        </div>
        <button
          v-if="hasAudio"
          class="upload u-button--round small light"
          @click="upload"
        >
          <IconCheck />
        </button>
        <button
          v-if="!hideActions && hasAudio"
          class="remove u-button--round small light"
          @click="deleteRecord"
        >
          <IconTrash />
        </button>
      </div>
    </div>
    <div v-else>
      <p>L'enregistrement audio n'est pas disponible</p>
    </div>
  </div>
</template>

<script>
import IconCheck from '@/assets/svg/ic_check.svg?inline';
import IconTrash from '@/assets/svg/ic_trash.svg?inline';
import StopWatch from '../../UI/StopWatch';
import AudioPlayer from './AudioPlayer';

export default {
  name: 'AudioRecorder',
  components: { StopWatch, AudioPlayer, IconTrash, IconCheck },
  props: {
    hideActions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rec: null,
      audioChunks: null,
      recordDisabled: false,
      hasAudio: false,
      stopRecordDisabled: true,
      stream: null,
      audioBlob: null,
      disabled: false,
    };
  },
  created() {
    if (process.env.VUE_ENV === 'server') return;
    if (!navigator.mediaDevices) {
      this.disabled = true;
    }
  },
  methods: {
    async upload() {
      const formData = new FormData();
      formData.append('file', this.audioBlob, 'Sans titre.mp3');
      try {
        const { data } = await this.$api.uploadFile(formData);
        this.$store.commit('gallery/addMedia', data.response);
      } catch (e) {
        console.log(e);
      }
    },
    handleAudioStream() {
      if (!navigator) return;
      navigator.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
        this.stream = stream;
        this.handlerFunction(stream);
        this.storeData();
        this.$refs.stopwatch.resetTimer();
        this.$refs.stopwatch.start();
      });
    },
    deleteRecord() {
      this.$refs.stopwatch.resetTimer();
      this.recordDisabled = false;
      this.stopRecordDisabled = true;
      this.hasAudio = false;
      this.audioChunks = [];
    },
    startRecord() {
      this.hasAudio = false;
      this.handleAudioStream();
    },
    storeData() {
      this.recordDisabled = true;
      this.stopRecordDisabled = false;
      this.audioChunks = [];
      this.rec.start();
    },
    stopRecord(e) {
      this.$refs.stopwatch.stop();
      this.recordDisabled = false;
      this.stopRecordDisabled = true;
      this.hasAudio = true;
      this.rec.stop();
      this.stream.getTracks().forEach((track) => track.stop());
    },
    handlerFunction(stream) {
      this.rec = new MediaRecorder(stream);
      this.rec.ondataavailable = (e) => {
        this.audioChunks.push(e.data);
        if (this.rec.state === 'inactive') {
          const blob = new Blob(this.audioChunks, { type: 'audio/mp3' });
          this.$refs.recordedAudio.$refs.audio.src = URL.createObjectURL(blob);
          this.audioBlob = blob;
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-recorder {
  width: 100%;
  text-align: center;
  color: $background;
  padding: 24px 24px 40px 24px;
  background-color: $gray-darkest;
}

.audio-recorder__btn {
  grid-column-start: 2;
  display: block;
  margin: auto;
  width: 92px;
  height: 92px;
  padding: 4px;
  border: 2px solid rgba($background, 0.4);
  border-radius: 50%;
  background-color: transparent;

  button {
    border: none;
    background-color: transparent;
  }
}

.remove {
  grid-column-start: 1;
  grid-row-start: 1;
}
.upload {
  grid-column-start: 3;
  grid-row-start: 1;
}

.record {
  background-color: $background !important;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.recorder-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.stop {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;

  &:after {
    content: '';
    background-color: $background !important;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 34px;
    height: 34px;
    border-radius: 4px;
  }
}

.stopwatch {
  height: 32px;
  line-height: 1;
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
