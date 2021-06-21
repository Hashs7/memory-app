<template>
  <div class="o-page--create-content">
    <div class="o-page">
      <div class="o-page__header o-page__header-nav">
        <button class="u-button--back chevron" @click="$emit('back')">
          <IconChevron />
        </button>
        <button class="u-button--back transparent">
          <IconVisibility />
        </button>
      </div>

      <div class="memory__infos">
        <p class="memory__title-input">{{ instrumentName }}</p>
      </div>

      <form class="o-page__body">
        <div class="slider">
          <draggable
            v-model="contents"
            class="slider__draggable"
            draggable=".slider__item"
            v-bind="draggableOptions"
          >
            <div
              v-for="(content, i) in contents"
              :key="content.id"
              class="slider__item"
            >
              <component
                :is="contentType[content.type].component"
                :key="i"
                :value="content"
                :index="i"
              />
              <button
                type="button"
                class="slider__close"
                @click="removeItem(i)"
              >
                x
              </button>
            </div>
          </draggable>

          <SliderAdd />
        </div>
      </form>

      <MediaModal v-if="modal.show">
        <component :is="modalComponent" select-files @selected="addContent" />
      </MediaModal>

      <div class="o-page__footer actions">
        <button
          type="button"
          class="button u-button u-button--round actions__theme"
          @click="showThemes = !showThemes"
        >
          <IconNote />
        </button>
        <button
          type="button"
          class="u-button--round actions__submit"
          @click="$emit(edit ? 'back' : 'next')"
        >
          <IconCheck />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapActions, mapGetters, mapState } from 'vuex';
import SliderAdd from '@/components/memories/creation/slider/SliderAdd';
import TextContent from '@/components/memories/creation/contents/TextContent';
import AudioContent from '@/components/memories/creation/contents/AudioContent';
import MediaContent from '@/components/memories/creation/contents/MediaContent';
import ThemeSelector from '@/components/memories/creation/ThemeSelector';
import MemoryPreview from '@/components/memories/MemoryPreview';
import IconCheck from '@/assets/svg/ic_check.svg?inline';
import IconNote from '@/assets/svg/ic_note.svg?inline';
import IconChevron from '@/assets/svg/ic_chevron.svg?inline';
import IconVisibility from '@/assets/svg/ic_visibility.svg?inline';
import { CONTENT_TYPE } from '@/const/memory';
// eslint-disable-next-line no-unused-vars
import AudioGallery from '../../../gallery/audio/AudioGallery';
// eslint-disable-next-line no-unused-vars
import Gallery from '../../../gallery/Gallery';
import MediaModal from '../MediaModal';

export default {
  name: 'ContentForm',
  components: {
    MediaModal,
    ThemeSelector,
    SliderAdd,
    TextContent,
    AudioContent,
    AudioGallery,
    MediaContent,
    MemoryPreview,
    IconCheck,
    IconNote,
    IconChevron,
    IconVisibility,
    draggable,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      instrument: null,
      contentType: CONTENT_TYPE,
      showThemes: false,
      draggableOptions: {
        animation: 200,
        direction: 'horizontal',
        delay: 200,
      },
    };
  },
  async fetch() {
    this.instrument = (
      await this.$api.getInstrumentById(this.$route.params.id)
    )?.data;
  },
  computed: {
    ...mapGetters('memory', ['contents']),
    ...mapState('memory', ['modal']),
    modalComponent() {
      if (this.modal.type === 'audio') {
        return 'AudioGallery';
      }
      if (this.modal.type === 'media') {
        return 'Gallery';
      }
      return null;
    },
    name: {
      get() {
        return this.$store.state.memory.data.name;
      },
      set(value) {
        this.$store.commit('memory/updateName', value);
      },
    },
    contents: {
      get() {
        return this.$store.getters['memory/contents'];
      },
      set(newValue) {
        this.$store.commit('memory/setContents', newValue);
      },
    },
    instrumentName() {
      return this.instrument?.name;
    },
  },
  methods: {
    ...mapActions('memory', ['addContent']),
    removeItem(index) {
      this.$store.commit('memory/removeContent', index);
    },
  },
};
</script>

<style lang="scss">
.o-page--create-content {
  max-height: calc(100vh - 72px);
  background-repeat: repeat;
  background-image: url('~/assets/svg/ic_grid.svg');

  .o-page {
    background-color: transparent;
  }

  .o-page__body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.o-layout--none .o-page--create-content {
  max-height: 100vh;
}

.o-page__footer {
  display: flex;
  justify-content: space-between;
}

.memory__infos {
  text-align: center;
}

.memory__title {
  width: 100%;
}
.memory__title-input {
  text-align: center;
  width: 100%;
  background-color: transparent;
  font-size: 24px;
  font-family: $font-secondary;

  &::placeholder {
    font-size: 24px;
    font-family: $font-secondary;
  }
}

.slider {
  display: flex;
  align-items: center;
  overflow: auto;
  padding: 16px 24px;
  height: 100%;

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
}

.slider__draggable {
  display: flex;
}

.slider__transition {
  display: flex;
}

.slider__item {
  position: relative;
  //min-width: calc(100vw - 60px);
  //height: calc((100vw - 60px) * (16 / 9));
  min-width: 300px;
  width: 300px;
  height: calc(300px * (16 / 9));
  //margin: 20px 12px;
  margin-right: 12px;
  box-shadow: $shadow--first;
  border-radius: $radius;
  background-color: $white;

  &.sortable-ghost {
    border: 2px dashed $gray-darkest;
    background: transparent;
    .memory-content {
      visibility: hidden;
    }
    .slider__close {
      visibility: hidden;
    }
  }

  &.sortable-drag {
    opacity: 1 !important;
    box-shadow: 0 0 20px rgba(black, 0.5);
    transform: scale(1.05);
  }
}

.slider__close {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: $white;
  box-shadow: $shadow--second;
  border: none;
  transform: translate(25%, -25%);
}

.themes {
  z-index: 20;
  margin-top: 124px;
}

.themes__container {
  position: relative;
  z-index: 20;
  padding: 22px;
  border-radius: 24px 24px 0 0;
  box-shadow: $shadow--first;
  background-color: $white;
}

.themes__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 12px;
  grid-row-gap: 12px;
}

.actions {
  margin-bottom: 17px;
  padding: 0 19px;
  &__submit,
  &__theme {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    box-shadow: 0 0 9px rgba(0, 0, 0, 0.13);
    height: 48px;
    border: none;
    outline: none;
    background-color: $gray-darkest;

    svg {
      width: 18px;
    }
  }
  &__theme {
    background: $background;
    border: 3px solid $gray-darkest;
  }

  &__submit {
    background-color: $gray-darkest;
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
