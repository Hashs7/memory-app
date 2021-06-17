<template>
  <section class="memories-timeline">
    <div class="memories-timeline__slider-wrap">
      <div ref="slider" class="memories-timeline__slider">
        <template v-for="(step, i) in timelineSteps">
          <MemoryPreview
            v-if="step.type === 'memory'"
            :key="i"
            link
            :data="step.data"
            class="memories-timeline__item memories-item--memory"
          />
          <div
            v-else
            :key="i"
            :class="[
              'memories-timeline__item',
              `memories-timeline__item--${step.type}`,
            ]"
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
            :class="[
              `memories-timeline__step--${step.type}`,
              `memories-timeline__step--${step.unit}`,
            ]"
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
import Duration from 'dayjs/plugin/duration';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { bindDraggable } from '@/helpers/timeline';

import MemoryPreview from '@/components/memories/MemoryPreview';

dayjs.extend(isSameOrBefore);
dayjs.extend(Duration);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

export default {
  name: 'MemoriesTimeline',
  components: { MemoryPreview, IconTriangle },
  props: {
    memories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sliderDraggable: null,
      stripDraggable: null,
    };
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
      return this.memories.map((m) => {
        return {
          date: m.date,
          type: 'memory',
          data: m,
        };
      });
      // return this.getTimelineSteps(this.firstMemory.date, this.lastMemory.date);
    },
  },

  mounted() {
    const stripStepSize = 13;
    const sliderStepSize = 304;

    // Initiate slider draggable
    this.sliderDraggable = Draggable.create(this.$refs.slider, {
      type: 'x',
      edgeResistance: 0.9,
      bounds: {
        minX: this.$refs.slider.clientWidth * -1 + sliderStepSize,
        maxX: 0,
      },
      inertia: true,
      overshootTolerance: 1,
      maxDuration: 0.5,
      snap: (value) => {
        return gsap.utils.snap(sliderStepSize, value);
      },
      onDrag() {
        bindDraggable(
          this.target,
          document.querySelector('.memories-timeline__strip'),
          sliderStepSize,
          stripStepSize,
          this.x
        );
      },
      onThrowUpdate() {
        bindDraggable(
          this.target,
          document.querySelector('.memories-timeline__strip'),
          sliderStepSize,
          stripStepSize,
          this.x
        );
      },
    });

    // Initiate strip draggable
    this.stripDraggable = Draggable.create(this.$refs.strip, {
      type: 'x',
      edgeResistance: 0.9,
      bounds: {
        minX: this.$refs.strip.clientWidth * -1 + stripStepSize,
        maxX: 0,
      },
      inertia: true,
      snap: (value) => {
        return gsap.utils.snap(stripStepSize, value);
      },
      onDrag() {
        bindDraggable(
          this.target,
          document.querySelector('.memories-timeline__slider'),
          stripStepSize,
          sliderStepSize,
          this.x
        );
      },
      onThrowUpdate() {
        bindDraggable(
          this.target,
          document.querySelector('.memories-timeline__slider'),
          stripStepSize,
          sliderStepSize,
          this.x
        );
      },
    });

    // Position slider and strip to the end
    gsap.set(this.$refs.slider, {
      x: this.$refs.slider.clientWidth * -1 + sliderStepSize,
    });
    gsap.set(this.$refs.strip, {
      x: this.$refs.strip.clientWidth * -1 + stripStepSize,
    });
  },
  methods: {
    /*
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
      let previousMemory = this.memories[0];
      let previousStepIndex = 0;
      this.memories.forEach((memory, index) => {
        const stepIndex = steps.findIndex((s) => s.date === memory.date);
        if (stepIndex > -1) {
          steps[stepIndex].type = 'memory';
          steps[stepIndex].data = memory;
        }
        if (index > 0) {
          const daysBetween = dayjs(memory.date).diff(previousMemory.date, 'd');
          const betweenSteps = steps.slice(previousStepIndex + 1, stepIndex);

          console.log('réduire les périodes');
          console.log(
            'Nombre de mois : ',
            Math.floor(betweenSteps.length / 30)
          );
          console.log(betweenSteps);
          // while()
          console.log(daysBetween);
          previousMemory = memory;
          previousStepIndex = stepIndex;
        }
      });
      return steps;
    },
     */
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
