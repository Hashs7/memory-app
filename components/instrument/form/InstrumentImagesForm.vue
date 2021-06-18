<template>
  <div class="o-section__pictures o-page__outside">
    <div class="instrument-pictures">
      <template v-if="data">
        <draggable
          v-model="images"
          tag="div"
          class="instrument-pictures__draggable"
          v-bind="draggableOptions"
          draggable=".instrument-picture"
        >
          <div v-for="img in images" :key="img._id" class="instrument-picture">
            <img class="instrument-picture__img" :src="img.path" alt="" />
            <button class="instrument-picture__remove" @click="remove(img._id)">
              x
            </button>
          </div>
        </draggable>
      </template>
      <ButtonSquare
        class="instrument-picture add"
        @click.native="$emit('showGallery')"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import ButtonSquare from '../../UI/ButtonSquare';

export default {
  name: 'InstrumentImagesForm',
  components: {
    ButtonSquare,
    draggable,
  },
  data() {
    return {
      ops: {
        vuescroll: {
          locking: true,
        },
      },
      draggableOptions: {
        animation: 200,
        direction: 'horizontal',
        delay: 200,
      },
    };
  },
  computed: {
    ...mapState('instrument', ['data']),
    images: {
      get() {
        return this.$store.state.instrument.data?.images ?? [];
      },
      set(newValue) {
        this.$store.commit('instrument/setImages', newValue);
      },
    },
  },
  methods: {
    remove(_id) {
      this.$store.commit('instrument/removeImage', _id);
    },
  },
};
</script>

<style lang="scss">
.o-section__pictures {
  .__view {
    display: flex;
    padding: 0 16px 8px 16px;
  }
}

.instrument-pictures {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;

  &__draggable {
    display: flex;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    visibility: hidden;
  }
}

.instrument-picture {
  position: relative;
  width: 156px;
  height: 156px;
  margin-right: 12px;
  overflow: hidden;
  user-select: none;

  &:first-child {
    margin-left: 12px;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
  }

  &.add {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
    margin-left: 0;
  }

  &.sortable-ghost {
    border: 2px dashed $gray-darkest;
    background: transparent;

    .instrument-picture__img {
      visibility: hidden;
    }

    .instrument-picture__remove {
      visibility: hidden;
    }
  }

  &.sortable-drag {
    opacity: 1 !important;
    box-shadow: 0 0 20px rgba(black, 0.5);
    transform: scale(1.05);
  }

  .instrument-picture__remove {
    z-index: 5;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
