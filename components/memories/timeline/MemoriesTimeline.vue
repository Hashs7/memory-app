<template>
  <section class="memories-timeline">
    <div class="memories-timeline__slider-wrap">
      <div ref="slider" class="memories-timeline__slider">
        <template v-for="(step, i) in memorySteps">
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

import MemoryPreview from '@/components/memories/MemoryPreview';
import { findIndexOfClosest } from '../../../helpers';

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
    sortedMemories() {
      return this.memories.slice().sort((a, b) => {
        if (dayjs(a.date).isBefore(b.date)) return -1;
        if (dayjs(a.date).isAfter(b.date)) return 1;
        return 0;
      });
    },
    timelineSteps() {
      return this.getTimelineSteps();
    },
    memorySteps() {
      return this.timelineSteps.filter((s) => s.type !== 'empty');
    },
  },

  mounted() {
    const sliderStep = this.$refs.slider.childNodes[0];
    const sliderStepSize =
      sliderStep.clientWidth +
      parseInt(window.getComputedStyle(sliderStep)?.marginLeft) +
      parseInt(window.getComputedStyle(sliderStep)?.marginRight);
    const stripStep = this.$refs.steps[0];
    const stripStepSize =
      stripStep.clientWidth +
      parseInt(window.getComputedStyle(stripStep)?.marginLeft) +
      parseInt(window.getComputedStyle(stripStep)?.marginRight);

    const stripPositions = this.memorySteps.map(
      (s) => stripStepSize * s.position * -1
    );
    const sliderPositions = this.memorySteps.map(
      (s, i) => sliderStepSize * i * -1
    );

    const bindSliderPositionToStrip = (sliderPosition) => {
      const position = sliderPosition / sliderStepSize;
      const positionIndex = Math.floor(position * -1);
      const offsetPercentage = Math.abs(position % 1) || 0;
      const offset =
        (stripPositions[positionIndex + 1] - stripPositions[positionIndex]) *
          offsetPercentage || 0;
      return stripPositions[positionIndex] + offset;
    };

    const bindStripPositionToSlider = (stripPosition) => {
      const positionIndex = findIndexOfClosest(stripPositions, stripPosition);
      const offsetPercentage =
        (stripPosition /
          (stripPositions[positionIndex + 1] - stripPositions[positionIndex])) %
          1 || 0;
      const offset = sliderStepSize * offsetPercentage;
      return sliderPositions[positionIndex] - offset;
    };

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
        gsap.set(document.querySelector('.memories-timeline__strip'), {
          x: bindSliderPositionToStrip(this.x),
        });
      },
      onThrowUpdate() {
        gsap.set(document.querySelector('.memories-timeline__strip'), {
          x: bindSliderPositionToStrip(this.x),
        });
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
      snap: stripPositions,
      onDrag() {
        gsap.set(document.querySelector('.memories-timeline__slider'), {
          x: bindStripPositionToSlider(this.x),
        });
      },
      onThrowUpdate() {
        gsap.set(document.querySelector('.memories-timeline__slider'), {
          x: bindStripPositionToSlider(this.x),
        });
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
    getTimelineSteps() {
      const steps = [];
      let previousMemory = this.memories[0];

      const addToSteps = (step, repeat = 1) => {
        for (let i = 0; i < repeat; i++) {
          steps.push({
            ...step,
            position: steps.length,
          });
        }
      };

      const emptyStep = (unit) => {
        return {
          type: 'empty',
          unit,
          data: null,
        };
      };

      this.sortedMemories.forEach((memory, index) => {
        if (index > 0) {
          const daysBetween = dayjs(memory.date).diff(previousMemory.date, 'd');
          // plus performant que le switch : https://stackoverflow.com/a/12259830
          if (daysBetween < 7) {
            addToSteps(emptyStep('day'), daysBetween);
          } else if (daysBetween < 30) {
            addToSteps(emptyStep('day'));
            addToSteps(emptyStep('week'), Math.floor(daysBetween / 7));
            addToSteps(emptyStep('day'));
          } else if (daysBetween < 365) {
            addToSteps(emptyStep('day'));
            addToSteps(emptyStep('week'));
            addToSteps(emptyStep('month'), Math.floor(daysBetween / 30));
            addToSteps(emptyStep('week'));
            addToSteps(emptyStep('day'));
          } else {
            addToSteps(emptyStep('day'));
            addToSteps(emptyStep('week'));
            addToSteps(emptyStep('month'));
            addToSteps(emptyStep('year'), Math.floor(daysBetween / 365));
            addToSteps(emptyStep('month'));
            addToSteps(emptyStep('week'));
            addToSteps(emptyStep('day'));
          }
        }
        addToSteps({
          date: memory.date,
          type: 'memory',
          data: memory,
        });

        previousMemory = memory;
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

    &--day {
      height: 70%;
    }
    &--week {
      height: 50%;
    }
    &--month {
      height: 30%;
    }
    &--year {
      height: 10%;
    }
  }
}
</style>
