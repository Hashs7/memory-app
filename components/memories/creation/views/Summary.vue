<template>
  <div class="o-page o-page--summary">
    <div class="o-page__header o-page__header-nav">
      <ButtonBack emit @back="$emit('back')" />
    </div>
    <div class="o-page__body">
      <p class="summary__title">Publication du Memory</p>
      <div class="memory-preview" @click="$emit('open-form')">
        <div v-if="thumbnail" class="memory-preview__image-container">
          <img
            class="memory-preview__image"
            :src="thumbnail"
            alt="Image du souvenir"
          />
        </div>
        <div class="memory-preview__body">
          <input
            v-model="name"
            name="name"
            type="text"
            class="memory-preview__name"
            placeholder="Cliquez pour ajouter un titre"
            required
          />
        </div>
      </div>

      <label class="o-cells__label">Quand a eu lieu ce Memory ?</label>
      <div class="form__group">
        <input
          v-model="date"
          class="slider__date-input form__input v-select"
          type="date"
          placeholder="Sélectionner une date"
        />
      </div>

      <label class="o-cells__label">Qui peut voir ce Memory ?</label>
      <Visibility />

      <button
        class="summary__submit u-button u-button--primary"
        @click="$emit('submit')"
      >
        <span>Enregistrer</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import dayjs from 'dayjs';
import Visibility from '@/components/memories/creation/form/Visibility';
import ButtonBack from '@/components/UI/ButtonBack';

export default {
  name: 'Summary',
  components: {
    Visibility,
    ButtonBack,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('memory', { memory: 'data' }),
    thumbnail() {
      return this.$store.state.memory.data.contents.find(
        (c) => c.type === 'media'
      )?.file?.path;
    },
    name: {
      get() {
        return this.$store.state.memory.data?.name;
      },
      set(newValue) {
        this.$store.commit('memory/updateName', newValue);
      },
    },
    date: {
      get() {
        return dayjs(this.$store.state.memory.data?.date).format('YYYY-MM-DD');
      },
      set(newValue) {
        this.$store.commit('memory/updateDate', dayjs(newValue).toDate());
      },
    },
  },
  methods: {
    ...mapMutations('memory', ['updateDate']),
    handleChanges(value) {
      this.$store.commit('memory/updateMemory', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.o-page__body {
  padding-bottom: 20px;
}

.memory-preview {
  margin: 26px 16px;
  width: auto;
}
.memory-preview__image-container {
  height: 336px;
}
.summary__title {
  text-align: center;
  font-weight: 500;
}
.memory-preview__body {
  padding: 14px 0 4px 0;
}
.memory-preview__name {
  font-size: 18px;
  font-family: $font-secondary;
  padding: 0;
  width: 100%;

  &::placeholder {
    font-size: 18px;
    font-family: $font-secondary;
    color: rgba(0, 0, 0, 0.4);
  }
}

.summary__submit {
  width: 100%;
  margin-top: 30px;
}
</style>
