<template>
  <div
    ref="card"
    v-hammer:pan="pan"
    v-hammer:panend="panEnd"
    class="memory-card"
  >
    <slot />
  </div>
</template>

<script>
import gsap from 'gsap';

export default {
  name: 'MemoryCard',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      SWIPE_DISTANCE: 150,
      xMax: null,
      yMax: null,
      origin: {
        x: null,
        y: null,
      },
    };
  },
  watch: {
    active(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        gsap.to(this.$refs.card, { x: 0, y: 0, rotate: 0, duration: 0.3 });
      }
    },
  },
  mounted() {
    const { x, y, width, height } = this.$refs.card.getBoundingClientRect();
    this.origin = { x, y };
    this.xMax = x + width * 1.5;
    this.yMax = y + height;
  },
  methods: {
    pan(e) {
      gsap.set(this.$refs.card, {
        x: Math.min(e.deltaX, 0),
        y: e.deltaY,
        rotate: -e.deltaY / 20,
      });
    },
    panEnd(e) {
      if (
        e.additionalEvent === 'panright' ||
        e.distance < this.SWIPE_DISTANCE
      ) {
        // Reset card postion
        gsap.to(this.$refs.card, { x: 0, y: 0, rotate: 0 });
        return;
      }
      this.$emit('swipe');
      gsap.to(this.$refs.card, {
        x: -this.xMax - 50,
        y: e.deltaY * 3,
        rotate: e.deltaY < 0 ? 35 : -35,
        overwrite: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.memory-card {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  padding: 32px;
  background-color: #fff;
  transform-origin: center;
  box-shadow: $shadow--first;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: $black;
    opacity: 0.4;
    z-index: +1;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
  }

  &.media {
    padding: 0;
    user-select: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      user-select: none;
    }

    &.video {
      display: flex;
      align-items: center;
      background-color: #000;
      user-select: none;
    }
  }

  &.active {
    z-index: 10;

    &:after {
      opacity: 0;
    }
  }
  &.next {
    transform: scale(1);
    z-index: 9;
  }
  &.next--second {
    transform: scale(1);
    z-index: 8;
  }
  &.previous {
    transform: scale(1) translateX(-24px);
    z-index: 9;
  }
  &.previous--second {
    transform: scale(0.96) translateX(-44px);
    z-index: 8;
  }
}

.memory__description {
  font-size: 16px;
  line-height: 1.4;
  font-weight: 400;
  margin-bottom: 16px;
}

.memory-card__tag-container {
  font-size: 0;
}
.memory-card__tag {
  display: inline-block;
  padding: 8px 10px;
  line-height: 1;
  font-size: 14px;
  font-weight: 400;
  background-color: $background-darker;
  border-radius: 4px;
  margin-right: 4px;
}
</style>
