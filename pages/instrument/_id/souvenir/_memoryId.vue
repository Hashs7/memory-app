<template>
  <div :class="[memory.template]" class="o-page--memory">
    <div class="o-page__container">
      <div class="memory__head">
        <div class="memory__actions">
          <div class="memory__sound">
            <button class="memory__sound-btn u-button u-button--icon">
              <IconSoundButton />
            </button>
            <svg class="memory__sound-title" height="14">
              <text x="0" y="10">Un Super Artiste - Une musique du turfu</text>
            </svg>
          </div>
          <button class="memory__close u-button" @click="closeMemory">
            <IconCross class="icon" />
          </button>
        </div>
        <div
          v-if="index === 0 && memory.name"
          ref="intro"
          class="memory__intro"
        >
          <h2 class="memory__name">{{ memory.name }}</h2>
          <p v-if="formatedDate" class="memory__date">{{ formatedDate }}</p>
        </div>
      </div>
      <div class="memory-slider">
        <MemoryCard
          v-for="(c, i) in contents"
          :key="i"
          ref="cards"
          :class="[c.type, mediaType(c.file), getClass(i), c.component]"
          class="memory--content"
          @swipe="next"
        >
          <img
            v-if="mediaType(c.file) === 'image'"
            :src="c.file.path"
            :alt="memory.name"
            draggable="false"
          />
          <video
            v-else-if="mediaType(c.file) === 'video'"
            :src="c.file.path"
            loop
            @click="toggleVideoMute"
          />
          <span v-else-if="c.type !== 'media'">
            <p v-html="c.content"></p>
          </span>
        </MemoryCard>
      </div>
      <transition name="fade">
        <div v-show="index > 0" class="memory__controls">
          <span
            v-for="(c, i) in contents"
            :key="i"
            class="memory__controls-item"
            :class="{ 'memory__controls-item--current': i === index }"
            @click="select(i)"
          ></span>
        </div>
      </transition>
    </div>
  </div>
</template>

<router>
  path: /instrument/:id/souvenir/:memoryId
</router>

<script>
import MemoryCard from '@/components/memories/MemoryCard';
import IconCross from '@/assets/svg/ic_cross.svg?inline';
import IconSoundButton from '@/assets/svg/ic_sound-btn.svg?inline';
import dayjs from 'dayjs';
import gsap from 'gsap';
// import UserPreview from '@/components/user/UserPreview';

export default {
  components: { /* UserPreview, */ MemoryCard, IconCross, IconSoundButton },
  props: {
    instrument: {
      type: Object,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      index: 0,
    };
  },
  computed: {
    memory() {
      const { memoryId } = this.$route.params;
      return this.instrument?.memories.find((m) => m.id === memoryId);
    },

    formatedDate() {
      return this.memory.date
        ? dayjs(this.memory.date).format('DD/MM/YYYY')
        : null;
    },

    closeMemoryRoute() {
      const { id } = this.$route.params;
      return `/instrument/${id}`;
    },

    contents() {
      return this.memory.contents;
    },
  },
  mounted() {
    document.body.style.overflow = 'hidden';

    if (this.memory.name) {
      gsap.from(this.$refs.intro.children, {
        y: 30,
        alpha: 0,
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.2,
      });
    }
  },
  beforeDestroy() {
    this.removeBodyStyle();
  },
  methods: {
    mediaType(file) {
      return file?.mimetype.split('/')[0];
    },

    previous() {
      if (this.index === 0) return;
      this.index--;
    },

    next() {
      if (this.index >= this.contents.length - 1) {
        this.removeBodyStyle();
        this.$router.push(this.closeMemoryRoute);
        return;
      }

      this.handleMediaBeforeIndexChange();

      this.index++;

      this.handleMediaAfterIndexChange();
    },

    closeMemory() {
      this.$router.push(this.closeMemoryRoute);
    },

    removeBodyStyle() {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    },

    toggleVideoMute(e) {
      e.target.muted = !e.target.muted;
    },

    select(index) {
      this.handleMediaBeforeIndexChange();
      this.index = index;
      this.handleMediaAfterIndexChange();
    },

    getClass(contentIndex) {
      let setClass = '';
      switch (contentIndex) {
        case this.index:
          setClass = 'active';
          break;
        case this.index - 1:
          setClass = 'previous';
          break;
        case this.index - 2:
          setClass = 'previous--second';
          break;
        case this.index + 1:
          setClass = 'next';
          break;
        case this.index + 2:
          setClass = 'next--second';
          break;
      }
      return setClass;
    },

    handleMediaBeforeIndexChange() {
      // Stop video before next card
      if (this.mediaType(this.contents[this.index].file) === 'video') {
        this.$refs.cards[this.index].$el.querySelector('video')?.pause();
      }
    },

    handleMediaAfterIndexChange() {
      // Start video when appearing
      if (this.mediaType(this.contents[this.index].file) === 'video') {
        this.$refs.cards[this.index].$el.querySelector('video')?.play();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.o-page--memory {
  z-index: 200;
  display: flex;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .o-page__container {
    position: relative;
    padding: 0;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
  }
}

.memory__title {
  font-size: 20px;
  margin-bottom: 12px;
  color: $black;
}
.memory__head {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 24px 0 24px;
  z-index: 30;
  background-image: linear-gradient(rgba(black, 0.7), rgba(black, 0));
}

.memory__actions {
  display: flex;
  align-items: center;
}

.memory__close {
  background: none;
  border: none;
  margin-left: auto;
  padding: 0;

  svg {
    width: 15px;
    height: 15px;
    fill: $background;
  }
}

.memory__intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 30px;
  width: 80%;
}

.memory__name {
  color: $background;
  text-align: center;
}

.memory__date {
  color: $white;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  margin-top: 16px;
}

.memory__sound {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  max-width: 60%;
}

.memory__sound-title {
  margin-left: 8px;
  width: 100%;

  text {
    font-family: $font-primary;
    font-size: 12px;
    fill: $background;
    animation-name: text-banner;
    animation-duration: 30s;
    animation-iteration-count: infinite;
    animation-delay: 5s;
  }
}

.memory__sound-btn {
  svg {
    width: 34px;
    height: 34px;
  }
}

.memory-slider {
  position: relative;
  height: auto;
  flex-grow: 1;
}

.memory__controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 60px;
  display: flex;
  justify-content: center;
  z-index: 30;
  width: 100%;
}

.memory__controls-item {
  width: 18px;
  height: 4px;
  border-radius: 4px;
  background-color: rgba($background, 0.5);
  border: none;
  margin: 0 2px;
  transition: width 0.3s ease;

  &--current {
    width: 36px;
    background-color: rgba($background, 1);
  }
}

// Templates
.o-page--memory {
  &.sardines {
  }
}

@keyframes text-banner {
  0%,
  30% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
