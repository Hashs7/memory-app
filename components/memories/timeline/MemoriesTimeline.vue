<template>
  <section class="memories-timeline">
    <div ref="slider" class="memories-timeline__slider-wrap">
      <div ref="slider" class="memories-timeline__slider">
        <MemoryPreview
          v-for="memory in memories"
          :key="memory.id"
          :data="memory"
          class="memories-timeline__memory"
        />
      </div>
    </div>
    <div class="memories-timeline__controls">
      <div class="memories-timeline__controls-top">
        <span class="memories-timeline__cursor memories-timeline__cursor--top">
          <IconTriangle class="memories-timeline__cursor-icon" />
        </span>
      </div>

      <div ref="stripWrap" class="memories-timeline__strip-wrap">
        <div ref="strip" class="memories-timeline__strip">
          <span
            v-for="(step, i) in timelineSteps"
            :key="i"
            ref="steps"
            class="memories-timeline__step"
            :class="`memories-timeline__step--${step.type}`"
          />
        </div>
      </div>
      <div class="memories-timeline__controls-bottom">
        <span
          class="memories-timeline__cursor memories-timeline__cursor--bottom"
        >
          <IconTriangle class="memories-timeline__cursor-icon" />
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import IconTriangle from '@/assets/svg/ic_triangle.svg?inline';
import gsap from 'gsap';
import dayjs from 'dayjs';
import { Draggable } from 'gsap/Draggable';
import MemoryPreview from '@/components/memories/MemoryPreview';

gsap.registerPlugin(Draggable);

export default {
  name: 'MemoriesTimeline',
  components: { MemoryPreview, IconTriangle },
  props: {
    memories: {
      type: Array,
      required: true,
    },
  },
  computed: {
    firstMemory() {
      return this.memories.reduce((memo, val) => {
        return dayjs(val.date).isBefore(dayjs(memo.date)) ? val : memo;
      });
    },
    lastMemory() {
      return this.memories.reduce((memo, val) => {
        return dayjs(val.date).isAfter(dayjs(memo.date)) ? val : memo;
      });
    },
    timelineSteps() {
      return this.getTimelineSteps(this.firstMemory.date, this.lastMemory.date);
    },
  },

  mounted() {
    Draggable.create(this.$refs.slider, {
      type: 'x',
    });
    Draggable.create(this.$refs.strip, {
      type: 'x',
      bounds: {
        minX: this.$refs.strip.clientWidth * -1 + 13,
        maxX: 0,
      },
      onDragEnd() {
        gsap.to(this.target, {
          x: Math.round(this.x / 13) * 13,
          duration: 0.5,
          ease: 'power2.out',
        });
      },
      /*
      liveSnap: {
        x: (value) => {
          return Math.round(value / 13) * 13;
        },
      }, */
    });
  },
  methods: {
    getTimelineSteps(startDate, stopDate) {
      const steps = [];
      const stopDateObject = dayjs(stopDate);
      let currentDate = dayjs(startDate);
      // Create steps array with all days
      while (currentDate.isBefore(stopDateObject)) {
        steps.push({
          date: currentDate.toISOString(),
          type: 'empty',
          data: null,
        });
        currentDate = currentDate.add(1, 'day');
      }
      this.memories.forEach((memory) => {
        const stepIndex = steps.findIndex((s) => s.date === memory.date);
        if (stepIndex > -1) {
          steps[stepIndex].type = 'memory';
          steps[stepIndex].data = memory;
        }
      });
      return steps;
    },
  },
};
</script>

<style lang="scss" scoped>
$step-width: 3px;
$step-margin: 5px;

.memories-timeline {
  &__slider {
    display: inline-flex;
    overflow: hidden;
    align-items: center;
    flex-wrap: nowrap;
  }

  &__memory {
    margin: 0 7px;
    flex-shrink: 0;
  }

  &__controls {
    margin-top: 14px;
    line-height: 0;
    &-top,
    &-bottom {
      display: flex;
      justify-content: center;
    }
  }

  &__cursor {
    &-icon {
      width: 10px;
      height: 10px;
    }

    &--top {
      margin-bottom: 2px;
    }
    &--bottom {
      margin-top: 2px;
      .memories-timeline__cursor-icon {
        transform: rotate(180deg);
      }
    }
  }

  &__strip-wrap {
    overflow: hidden;
  }

  &__strip {
    display: inline-flex;
    align-items: center;
    height: 44px;
    margin: 0 calc(50% - #{$step-margin} - 1px);
  }

  &__step {
    width: $step-width;
    height: 100%;
    margin: 0 $step-margin;
    border-radius: 3px;
    background-color: $gray-darkest;
    flex-shrink: 0;
    opacity: 0.4;

    &--memory {
      opacity: 1;
    }

    &--empty {
      height: 20%;
    }
  }
}
</style>
