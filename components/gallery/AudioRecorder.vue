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
      <button @click="upload">Upload</button>
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
      audioBlob: null,
    };
  },
  methods: {
    async upload() {
      const formData = new FormData();
      formData.append('file', this.audioBlob, 'rot.mp3');
      try {
        const { data } = await this.$api.uploadFile(formData);
        this.$store.commit('gallery/addMedia', data.response);
      } catch (e) {
        console.log(e);
      }
    },
    handleAudioStream() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.stream = stream;
        this.handlerFunction(stream);
        this.storeData();
      });
    },
    startRecord() {
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
          const blob = new Blob(this.audioChunks, { type: 'audio/mp3' });
          this.$refs.recordedAudio.src = URL.createObjectURL(blob);
          this.$refs.recordedAudio.controls = true;
          // this.$refs.recordedAudio.autoplay = true;
          this.audioBlob = blob;
        }
      };
    },
    blobToBase64(blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    },
  },
};
</script>

<style scoped></style>
