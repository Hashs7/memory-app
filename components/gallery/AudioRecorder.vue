<template>
  <div>
    <p>
      <button ref="record" :disabled="recordDisabled" @click="startRecord">
        Enregistrer
      </button>
      <button
        ref="stopRecord"
        :disabled="stopRecordDisabled"
        @click="stopRecord"
      >
        Stop
      </button>
    </p>
    <p>
      <audio ref="recordedAudio"></audio>
    </p>
  </div>
</template>

<script>
export default {
  name: 'AudioRecorder',
  data() {
    return {
      rec: null,
      audioChunks: null,
      recordDisabled: false,
      stopRecordDisabled: true,
      stream: null,
    };
  },
  methods: {
    sendData(data) {},
    handleAudioStream() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.stream = stream;
        this.handlerFunction(stream);
        this.storeData();
      });
    },
    startRecord(e) {
      this.handleAudioStream();
    },
    storeData() {
      this.recordDisabled = true;
      this.stopRecordDisabled = false;
      this.audioChunks = [];
      this.rec.start();
    },
    stopRecord(e) {
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
          const blob = new Blob(this.audioChunks, { type: 'audio/mpeg-3' });
          this.$refs.recordedAudio.src = URL.createObjectURL(blob);
          this.$refs.recordedAudio.controls = true;
          this.$refs.recordedAudio.autoplay = true;
          this.sendData(blob);
        }
      };
    },
  },
};
</script>

<style scoped></style>
