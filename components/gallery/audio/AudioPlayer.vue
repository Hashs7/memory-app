<template>
  <div :class="{ light }" class="player">
    <div v-if="visualizer" class="visualizer">
      <canvas id="canvas" class="audio-visualizer"></canvas>
    </div>
    <audio
      id="audio-element"
      ref="audio"
      :src="media ? media.path : ''"
      muted
      controls
    >
      Sorry, your browser doesn't support embedded videos.
    </audio>

    <div v-if="progressBar" ref="progress" class="progress-element">
      <div class="progress__bar" @click="clickProgress">
        <div class="progress__current" :style="{ width: barWidth }"></div>
      </div>
      <p class="progress__top">
        <span class="progress__time">{{ currentTime }}</span>
        <span class="progress__duration">{{ duration }}</span>
      </p>
    </div>

    <div v-if="controls" class="player__top">
      <div class="player-controls">
        <div class="player-controls__item" @click="play">
          <span v-if="isTimerPlaying">
            <Pause />
          </span>
          <span v-else>
            <Play />
          </span>
        </div>
      </div>
    </div>

    <div v-cloak></div>
  </div>
</template>

<script>
import Play from '@/assets/svg/player/ic_play.svg?inline';
import Pause from '@/assets/svg/player/ic_pause.svg?inline';
import Wave from '@/helpers/audio';

export default {
  name: 'AudioPlayer',
  components: {
    Play,
    Pause,
  },
  props: {
    visualizer: {
      type: Boolean,
      default: false,
    },
    progressBar: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    },
    controls: {
      type: Boolean,
      default: false,
    },
    media: {
      type: Object,
      default: () => {},

      src: {
        type: Object,
        default: () => {},
      },
    },
  },
  data() {
    return {
      circleLeft: null,
      barWidth: null,
      duration: '00:00',
      currentTime: '00:00',
      isTimerPlaying: false,
      currentTrackIndex: 0,
      transitionName: null,
    };
  },
  mounted() {
    console.log(this.$refs.audio);
    this.$refs.audio.loadedmetadata = () => {
      this.generateTime();
    };

    this.$refs.audio?.addEventListener('durationchange', (e) => {
      this.generateTime();
    });
    this.$refs.audio.ontimeupdate = () => {
      this.generateTime();
    };

    this.$refs.audio?.addEventListener('ended', () => {
      this.isTimerPlaying = false;
    });

    if (!this.visualizer) return;
    this.enableVisualizer();
  },
  methods: {
    enableVisualizer() {
      const canvas = document.getElementById('canvas');
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
        this.$refs.audio.muted = false;
        this.$refs.audio.play();
        this.isTimerPlaying = true;
        this.$emit('play');
      } else {
        this.$refs.audio.pause();
        this.isTimerPlaying = false;
        this.$emit('pause');
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
  },
};
</script>

<style lang="scss" scoped>
.audio-vizualiser {
  display: block;
  width: 100%;
}

#audio-element {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  z-index: -1;
}

.icon {
  display: inline-block;
}

.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-size: cover;
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

.player-controls__item {
  text-align: center;
  margin: -8px 0 8px 0;
}

.progress__top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 8px;
  line-height: 1;
}

.progress__bar {
  height: 6px;
  width: 100%;
  cursor: pointer;
  background-color: rgba($gray-darkest, 0.4);
  display: inline-block;
  border-radius: 10px;
}

.progress__current {
  height: inherit;
  width: 0;
  background-color: $gray-darkest;
  border-radius: 10px;
  transition: 0.5s ease;
}

.player.light {
  .progress__bar {
    background-color: rgba(#faf4de, 0.4);
  }

  .progress__current {
    background-color: #faf4de;
  }

  path,
  rect {
    fill: #faf4de;
  }
}
</style>
