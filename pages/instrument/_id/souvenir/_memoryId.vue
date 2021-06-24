<template>
  <div v-if="memory" :class="[memory.template]" class="o-page--memory">
    <div class="o-page__container">
      <div class="memory__head">
        <div class="memory__actions">
          <transition name="fade">
            <span v-show="index > 0" class="memory__actions__name-small">
              {{ memory.name }}
            </span>
          </transition>
          <button class="memory__close u-button" @click="closeMemory">
            <IconCross class="icon" />
          </button>
        </div>
        <div
          v-if="index === 0 && memory.name && !(contents[0].type !== 'media')"
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
          :active="i === index"
          @swipe="next"
        >
          <MemoryImageCard v-if="mediaType(c.file) === 'image'" :data="c" />
          <MemoryVideoCard
            v-else-if="mediaType(c.file) === 'video'"
            :data="c"
            @toggle-mute="toggleVideoMute"
          />
          <MemoryAudioCard v-else-if="c.type === 'audio'" :data="c" />
          <MemoryTextCard v-else-if="c.type !== 'media'" :data="c" />
        </MemoryCard>
      </div>
      <div class="memory__footer">
        <transition name="fade">
          <div v-if="index > 0" class="memory__controls">
            <button class="memory__previous u-button--action" @click="previous">
              <IconChevron />
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<router>
  path: /instrument/:id/souvenir/:memoryId
</router>

<script>
import MemoryCard from '@/components/memories/MemoryCard';
import IconCross from '@/assets/svg/ic_cross.svg?inline';
import IconChevron from '@/assets/svg/ic_chevron.svg?inline';
import dayjs from 'dayjs';
import gsap from 'gsap';
import MemoryTextCard from '@/components/memories/cards/MemoryTextCard';
import MemoryVideoCard from '@/components/memories/cards/MemoryVideoCard';
import MemoryImageCard from '@/components/memories/cards/MemoryImageCard';
import MemoryAudioCard from '@/components/memories/cards/MemoryAudioCard';

export default {
  components: {
    MemoryAudioCard,
    MemoryImageCard,
    MemoryVideoCard,
    MemoryTextCard,
    MemoryCard,
    IconCross,
    IconChevron,
  },
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
      videosMuted: true,
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
  created() {
    if (this.memory) return;
    this.$router.push({
      name: 'feed',
    });
  },
  mounted() {
    document.body.style.overflow = 'hidden';

    if (this.memory.name && this.contents[0].type === 'media') {
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

      this.handleMediaBeforeIndexChange();
      this.index--;
      this.handleMediaAfterIndexChange();
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
      // Bypass the iOS muted play restriction for next videos
      if (this.videosMuted) {
        this.$refs.cards.forEach((card, index) => {
          if (this.mediaType(this.contents[index].file) === 'video') {
            const video = card.$el.querySelector('video');
            if (video !== e.target) {
              video.play().then(() => {
                video.pause();
                video.muted = false;
              });
            }
          }
        });
      }

      this.videosMuted = false;
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

      // Stop audio before next card
      if (this.mediaType(this.contents[this.index].file) === 'audio') {
        this.$refs.cards[this.index].$el.querySelector('audio')?.pause();
      }
    },

    handleMediaAfterIndexChange() {
      // Start video when appearing
      if (this.mediaType(this.contents[this.index].file) === 'video') {
        const video = this.$refs.cards[this.index].$el.querySelector('video');
        video.play();
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
  min-height: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 24px 0 24px;
  z-index: 30;
  pointer-events: none;
  background-image: linear-gradient(rgba(black, 0.15), rgba(black, 0));
}

.memory__actions {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  pointer-events: auto;
  width: 100%;
  margin-top: 16px;
}

.memory__actions__name-small {
  display: inline-block;
  color: $background;
  font-family: $font-secondary;
  margin-right: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.memory__close {
  background: none;
  border: none;
  margin-left: auto;
  padding: 0;
  line-height: 0;
  height: auto;

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

.memory__sound-audio {
  visibility: hidden;
  height: 0;
  width: 0;
}

.memory__sound-btn {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: calc(34px / 2 - 1px);
    left: 0;
    width: 34px;
    height: 2px;
    background: $background;
    pointer-events: none;
    transform: rotate(45deg);
    transform-origin: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .memory__sound--muted & {
    &:after {
      opacity: 1;
    }
  }
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

.memory__footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  min-height: 30%;
  z-index: 30;
  pointer-events: none;
  background-image: linear-gradient(rgba(black, 0), rgba(black, 0.15));
}

.memory__controls {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;
  pointer-events: auto;
}

.memory__previous {
  @include blurred-background;

  svg {
    fill: $background;
    width: 7px;
    height: 12px;
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
