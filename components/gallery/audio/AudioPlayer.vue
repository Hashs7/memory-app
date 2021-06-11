<template>
  <div class="player">
    <div v-if="visualizer" class="visualizer">
      <canvas id="canvas" class="audio-visualizer"></canvas>
    </div>
    <audio id="audio-element" ref="audio" :src="media.path" controls>
      Sorry, your browser doesn't support embedded videos.
    </audio>
    <div class="player__top">
      <div class="player-controls">
        <div class="player-controls__item -xl js-play" @click="play">
          <p class="icon">
            <!--            <use xlink:href="#icon-pause" v-if="isTimerPlaying"></use>-->
            <!--            <use xlink:href="#icon-play" v-else></use>-->
            <span v-if="isTimerPlaying">pause</span>
            <span v-else>play</span>
          </p>
        </div>
      </div>
    </div>
    <div ref="progress" class="progress-element">
      <p class="progress__top">
        <span class="progress__time">{{ currentTime }}</span>
        <span> / </span>
        <span class="progress__duration">{{ duration }}</span>
      </p>
      <div class="progress__bar" @click="clickProgress">
        <div class="progress__current" :style="{ width: barWidth }"></div>
      </div>
    </div>
    <div v-cloak></div>
  </div>
</template>

<script>
import Wave from '@/helpers/audio';

export default {
  name: 'AudioPlayer',
  props: {
    visualizer: {
      type: Boolean,
      default: false,
    },
    media: {
      type: Object,
      required: true,

      src: {
        type: Object,
        required: true,
      },

      mimetype: {
        type: Object,
        required: true,
      },
    },
  },
  data() {
    return {
      // audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      currentTrackIndex: 0,
      transitionName: null,
    };
  },
  mounted() {
    this.$refs.audio.loadedmetadata = (e) => {
      this.generateTime();
    };

    this.$refs.audio.addEventListener('durationchange', (e) => {
      this.generateTime();
    });

    this.$refs.audio.ontimeupdate = (e) => {
      this.generateTime();
    };

    this.$refs.audio.addEventListener('onended', (e) => {
      this.isTimerPlaying = true;
    });

    if (!this.visualizer) return;
    this.enableVisualizer();
  },
  methods: {
    enableVisualizer() {
      const canvas = document.getElementById('canvas');
      console.log(canvas);
      canvas.width = window.innerWidth;
      canvas.height = (9 / 16) * window.innerWidth;

      this.wave = new Wave();
      this.wave.fromElement('audio-element', 'canvas', {
        type: 'dualbars',
        colors: ['#373737', '#373737'],
      });
    },
    play() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        console.log(this.wave);
        this.isTimerPlaying = true;
      } else {
        this.$refs.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      if (!this.$refs.audio || this.$refs.audio.duration === Infinity) return;
      const width =
        (100 / this.$refs.audio.duration) * this.$refs.audio.currentTime;
      this.barWidth = width + '%';
      this.circleLeft = width + '%';
      let durmin = Math.floor(this.$refs.audio.duration / 60);
      let dursec = Math.floor(this.$refs.audio.duration - durmin * 60);
      let curmin = Math.floor(this.$refs.audio.currentTime / 60);
      let cursec = Math.floor(this.$refs.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = '0' + durmin;
      }
      if (dursec < 10) {
        dursec = '0' + dursec;
      }
      if (curmin < 10) {
        curmin = '0' + curmin;
      }
      if (cursec < 10) {
        cursec = '0' + cursec;
      }
      this.duration = durmin + ':' + dursec;
      this.currentTime = curmin + ':' + cursec;
    },
    updateBar(x) {
      const progress = this.$refs.progress;
      const maxduration = this.$refs.audio.duration;
      const position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + '%';
      this.circleLeft = percentage + '%';
      this.$refs.audio.currentTime = (maxduration * percentage) / 100;
      this.$refs.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.$refs.audio.pause();
      this.updateBar(e.pageX);
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.src = this.src;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
        }
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-vizualiser {
  display: block;
  width: 100%;
}

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}

.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-size: cover;
  @media screen and (max-width: 700px), (max-height: 500px) {
    flex-wrap: wrap;
    flex-direction: column;
  }
}

.player {
  &-controls {
    flex: 1;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 576px), (max-height: 500px) {
      flex-direction: row;
      padding-left: 0;
      width: 100%;
      flex: unset;
    }

    &__item {
      display: inline-flex;
      font-size: 30px;
      padding: 5px;
      margin-bottom: 10px;
      color: #acb8cc;
      cursor: pointer;
      width: 50px;
      height: 50px;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s ease-in-out;

      @media screen and (max-width: 576px), (max-height: 500px) {
        font-size: 26px;
        padding: 5px;
        margin-right: 10px;
        color: #acb8cc;
        cursor: pointer;
        width: 40px;
        height: 40px;
        margin-bottom: 0;
      }

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #fff;
        transform: scale(0.5);
        opacity: 0;
        box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
        transition: all 0.3s ease-in-out;
        transition: all 0.4s cubic-bezier(0.35, 0.57, 0.13, 0.88);
      }
    }
  }
}

[v-cloak] {
  display: none;
}

[v-cloak] > * {
  display: none;
}

.progress-element {
  width: 100%;
  user-select: none;

  &__top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__duration {
    color: #71829e;
    font-weight: 700;
    font-size: 20px;
    opacity: 0.5;
  }
  &__time {
    margin-top: 2px;
    color: #71829e;
    font-weight: 700;
    font-size: 16px;
    opacity: 0.7;
  }
}

.progress__bar {
  height: 6px;
  width: 100%;
  cursor: pointer;
  background-color: #d0d8e6;
  display: inline-block;
  border-radius: 10px;
}

.progress__current {
  height: inherit;
  width: 0;
  background-color: #a3b3ce;
  border-radius: 10px;
}
</style>
