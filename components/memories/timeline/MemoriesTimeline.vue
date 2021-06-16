<template>
  <section class="memories-timeline">
    <div class="memories-timeline__slider-wrap">
      <div ref="slider" class="memories-timeline__slider">
        <template v-for="(step, i) in timelineSteps">
          <MemoryPreview
            v-if="step.type === 'memory'"
            :key="i"
            :data="step.data"
            class="memories-timeline__item memories-item--memory"
          />
          <div
            v-else
            :key="i"
            class="memories-timeline__item memories-timeline__item--empty"
          ></div>
        </template>
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
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Draggable } from 'gsap/Draggable';

import MemoryPreview from '@/components/memories/MemoryPreview';

dayjs.extend(isSameOrBefore);
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
    const stripStepSize = 13;
    const sliderStepSize = 304;

    Draggable.create(this.$refs.slider, {
      type: 'x',
      edgeResistance: 0.9,
      bounds: {
        minX: this.$refs.slider.clientWidth * -1 + sliderStepSize,
        maxX: 0,
      },
      onMove() {
        const strip = document.querySelector('.memories-timeline__strip');
        gsap.set(strip, {
          x: gsap.utils.mapRange(
            this.target.clientWidth * -1 + sliderStepSize,
            0,
            strip.clientWidth * -1 + stripStepSize,
            0,
            this.x
          ),
        });
      },
      onDragEnd() {
        const strip = document.querySelector('.memories-timeline__strip');
        const xTarget = gsap.utils.snap(
          sliderStepSize,
          gsap.utils.clamp(
            this.target.clientWidth * -1 + sliderStepSize,
            0,
            this.x * (this.deltaX * 0.1 + 1) * -1
          )
        );
        gsap.to(this.target, {
          x: xTarget,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: () => {
            gsap.set(strip, {
              x: gsap.utils.mapRange(
                this.target.clientWidth * -1 + sliderStepSize,
                0,
                strip.clientWidth * -1 + stripStepSize,
                0,
                this.x
              ),
            });
          },
        });
        gsap.to(strip, {
          x: gsap.utils.mapRange(
            this.target.clientWidth * -1 + sliderStepSize,
            0,
            strip.clientWidth * -1 + stripStepSize,
            0,
            xTarget
          ),
          duration: 0.5,
          ease: 'power2.out',
        });
      },
    });
    Draggable.create(this.$refs.strip, {
      type: 'x',
      edgeResistance: 0.9,
      bounds: {
        minX: this.$refs.strip.clientWidth * -1 + stripStepSize,
        maxX: 0,
      },
      onMove() {
        const slider = document.querySelector('.memories-timeline__slider');
        gsap.set(slider, {
          x: gsap.utils.mapRange(
            this.target.clientWidth * -1 + stripStepSize,
            0,
            slider.clientWidth * -1 + sliderStepSize,
            0,
            this.x
          ),
        });
      },
      onDragEnd() {
        const slider = document.querySelector('.memories-timeline__slider');
        const xTarget = gsap.utils.snap(stripStepSize, this.x);
        gsap.to(this.target, {
          x: xTarget,
          duration: 0.5,
          ease: 'power2.out',
        });
        gsap.to(slider, {
          x: gsap.utils.mapRange(
            this.target.clientWidth * -1 + stripStepSize,
            0,
            slider.clientWidth * -1 + sliderStepSize,
            0,
            xTarget
          ),
          duration: 0.5,
          ease: 'power2.out',
        });
      },
    });
  },
  methods: {
    getTimelineSteps(startDate, stopDate) {
      const steps = [];
      const stopDateObject = dayjs(stopDate);
      let currentDate = dayjs(startDate);
      // Create steps array with all days
      while (currentDate.isSameOrBefore(stopDateObject)) {
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
$slide-width: 290px;
$slide-margin: 7px;
$step-width: 3px;
$step-margin: 5px;

.memories-timeline {
  margin: 12px 0 0 0;

  &__slider-wrap {
  }

  &__slider {
    display: inline-flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: nowrap;
    margin: 0 calc(50% - #{$slide-margin} - #{$slide-width} / 2);
  }

  &__item {
    display: inline-block;
    margin: 0 $slide-margin;
    flex-shrink: 0;
    width: $slide-width;
    height: 100%;

    &--empty {
      display: inline-block;
      background: red;
    }
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
