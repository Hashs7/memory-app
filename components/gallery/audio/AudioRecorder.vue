<template>
  <div class="audio-recorder">
    <div v-if="!disabled" class="container">
      <div class="stopwatch">
        <StopWatch ref="stopwatch" />
      </div>
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
      <button @click="upload">Upload</button>
      <p>
        <audio ref="recordedAudio"></audio>
      </p>
    </div>
    <div v-else>
      <p>L'enregistrement audio n'est pas disponible</p>
    </div>
  </div>
</template>

<script>
import StopWatch from '../../UI/StopWatch';
export default {
  name: 'AudioRecorder',
  components: { StopWatch },
  data() {
    return {
      rec: null,
      audioChunks: null,
      recordDisabled: false,
      stopRecordDisabled: true,
      stream: null,
      audioBlob: null,
      disabled: false,
    };
  },
  created() {
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
      navigator.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
        this.stream = stream;
        this.handlerFunction(stream);
        this.storeData();
      });
    },
    startRecord() {
      this.$refs.stopwatch.resetTimer();
      this.$refs.stopwatch.start();
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
      this.rec.stop();
      this.stream.getTracks().forEach((track) => track.stop());
    },
    handlerFunction(stream) {
      this.rec = new MediaRecorder(stream);
      this.rec.ondataavailable = (e) => {
        this.audioChunks.push(e.data);
        if (this.rec.state === 'inactive') {
          const blob = new Blob(this.audioChunks, { type: 'audio/mp3' });
          this.$refs.recordedAudio.src = URL.createObjectURL(blob);
          this.$refs.recordedAudio.controls = true;
          // this.$refs.recordedAudio.autoplay = true;
          this.audioBlob = blob;
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-recorder {
  text-align: center;
  color: $background;
  padding: 24px 24px 40px 24px;
  background-color: $gray-darkest;
}

.audio-recorder__btn {
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

.record {
  background-color: $background !important;
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
