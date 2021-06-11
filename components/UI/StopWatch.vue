<template>
  <p class="stopwatch">{{ timer }}</p>
</template>

<script>
export default {
  name: 'StopWatch',
  data() {
    return {
      min: 0,
      sec: 0,
      timer: '',
      stopTime: true,
    };
  },
  methods: {
    start() {
      if (!this.stopTime) return;
      this.stopTime = false;
      setTimeout(() => this.timerCycle(), 1000);
    },

    stop() {
      if (this.stopTime) return;
      this.stopTime = true;
    },

    timerCycle() {
      if (this.stopTime) return;
      this.sec = parseInt(this.sec);
      this.min = parseInt(this.min);

      this.sec = this.sec + 1;

      if (this.sec === 60) {
        this.min = this.min + 1;
        this.sec = 0;
      }
      if (this.min === 60) {
        this.hr = this.hr + 1;
        this.min = 0;
        this.sec = 0;
      }

      if (this.sec < 10 || this.sec === 0) {
        this.sec = '0' + this.sec;
      }
      if (this.min < 10 || this.min === 0) {
        this.min = '0' + this.min;
      }

      this.timer = this.min + ':' + this.sec;

      setTimeout(() => this.timerCycle(), 1000);
    },

    resetTimer() {
      this.min = 0;
      this.sec = 0;
      this.timer = '00:00';
    },
  },
};
</script>

<style scoped></style>
