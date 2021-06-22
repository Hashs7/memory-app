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
            editable
            class="memories-timeline__item memories-item--memory"
          />
          <TimelineHandoverCard
            v-else-if="step.type === 'handover'"
            :key="i"
            :data="step.data"
            class="memories-timeline__item memories-item--handover"
          />
          <div
            v-else-if="step.type === 'birth'"
            :key="i"
            class="memories-timeline__item memories-timeline__item--birth"
          >
            <div class="memories-timeline__birth">
              <div class="memories-timeline__birth-image-container">
                <img
                  v-if="step.data.image"
                  class="memories-timeline__birth-image"
                  :src="step.data.image.path"
                />
              </div>
              <div class="memories-timeline__birth-body">
                <h4 class="memories-timeline__birth-text">Naissance</h4>
              </div>
            </div>
          </div>
          <div
            v-else-if="step.type === 'add'"
            :key="i"
            :class="[
              'memories-timeline__item',
              `memories-timeline__item--${step.type}`,
            ]"
          >
            <NuxtLink :to="addMemoryRoute" class="memories-timeline__add">
              <IconAdd class="memories-timeline__add-icon" />
              <h4 class="memories-timeline__add-title">Ajoute un memory !</h4>
              <span class="memories-timeline__add-text">
                Cliques sur cette carte et crée un nouveau memory.
              </span>
            </NuxtLink>
          </div>
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
    <div class="memories-timeline__date">
      <span
        v-for="(step, i) in memorySteps"
        :key="i"
        class="memories-timeline__date-text"
      >
        {{ calendarDate(step.date) }}
      </span>
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
import IconAdd from '@/assets/svg/ic_add.svg?inline';
import gsap from 'gsap';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Draggable } from 'gsap/Draggable';
import MemoryPreview from '@/components/memories/MemoryPreview';
import { findIndexOfClosest } from '../../../helpers';
import TimelineHandoverCard from './cards/TimelineHandoverCard';
dayjs.extend(calendar);

export default {
  name: 'MemoriesTimeline',
  components: { TimelineHandoverCard, MemoryPreview, IconTriangle, IconAdd },
  props: {
    buyDate: {
      type: String,
      required: true,
    },
    instrumentImage: {
      type: Object,
      default: null,
    },
    allowAdd: {
      type: Boolean,
      default: false,
    },
    data: {
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
    timelineSteps() {
      return this.getTimelineSteps();
    },
    memorySteps() {
      return this.timelineSteps.filter((s) => s.type !== 'empty');
    },
    addMemoryRoute() {
      const { id } = this.$route.params;
      return `/instrument/${id}/souvenir/creation`;
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
      let previousEvent = this.data[0];

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

      addToSteps({
        date: this.buyDate,
        type: 'birth',
        data: {
          image: this.instrumentImage,
        },
      });

      this.data.forEach((event, index) => {
        if (index > 0) {
          const daysBetween = dayjs(event.data.date).diff(
            previousEvent.data.date,
            'd'
          );
          // plus performant que le switch : https://stackoverflow.com/a/12259830
          if (daysBetween < 7) {
            if (daysBetween > 0) addToSteps(emptyStep('day'), daysBetween - 1);
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
          date: event.data.date,
          type: event.type,
          data: event.data,
        });

        previousEvent = event;
      });

      if (this.allowAdd) {
        addToSteps({
          date: Date.now(),
          type: 'add',
          data: null,
        });
      }

      return steps;
    },
    calendarDate(date) {
      return dayjs(date).calendar(null, {
        sameDay: "[Aujourd'hui]", // The same day ( Today at 2:30 AM )
        nextDay: '[Demain]', // The next day ( Tomorrow at 2:30 AM )
        nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
        lastDay: '[Hier]', // The day before ( Yesterday at 2:30 AM )
        lastWeek: 'dddd', // Last week ( Last Monday at 2:30 AM )
        sameElse: 'DD MMMM YYYY', // Everything else ( 7/10/2011 )
      });
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
  margin: 12px 0 20px 0;

  &__slider-wrap {
  }

  &__slider {
    display: inline-flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: nowrap;
    margin: 0 calc(50% - #{$slide-margin} - #{$slide-width} / 2);
    height: 420px;
  }

  &__item {
    margin: 0 $slide-margin;
    flex-shrink: 0;
    flex-grow: 1;
    width: $slide-width;
    height: 100%;

    &--empty {
      display: inline-block;
    }
  }

  &__birth {
    display: inline-flex;
    flex-direction: column;
    align-items: self-start;
    justify-content: flex-start;
    height: 100%;
    padding: 8px;
    background-color: #ffffff;
    border-radius: 4px;
    word-wrap: break-word;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);

    &-image-container {
      flex: 1;
      min-height: 232px;
      overflow: hidden;
      border-radius: 4px;
    }

    &-image {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    &-body {
      margin-top: 12px;
    }

    &-text {
      font-family: YoungSerif, 'serif';
      font-size: 16px;
    }
  }

  &__add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: $background;
    border: 8px solid white;
    border-radius: 3px;
    padding: 20px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  }

  &__add-title {
    font-family: $font-secondary;
    font-size: 20px;
    text-align: center;
  }

  &__add-text {
    margin-top: 12px;
    text-align: center;
    font-size: 16px;
  }

  &__add-icon {
    margin-bottom: 30px;
    height: 40px;
    width: 40px;
  }

  &__date {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 23px;

    &-text {
      display: inline-block;
      font-size: 12px;
      text-align: center;
      width: $slide-width / 2;
      flex-shrink: 0;
      margin: 0 $slide-margin;
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

    &--add {
      opacity: 0.2;
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
