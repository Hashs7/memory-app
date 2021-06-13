<template>
  <div class="o-page o-page--summary">
    <div class="o-page__header o-page__header-nav">
      <ButtonBack emit @back="$emit('back')" />
      <button class="o-page__header-btn primary" @click="$emit('submit')">
        <template v-if="!edit">Poster</template>
        <template v-else>Enregistrer</template>
      </button>
    </div>
    <div class="o-page__body">
      <MemoryPreview :data="memory" @click="edit ? $emit('open-form') : ''" />

      <div class="o-cells">
        <div class="form__group">
          <b-field>
            <label class="o-cells__label">Nom du souvenir</label>
            <b-input
              v-model="name"
              name="name"
              type="text"
              placeholder="Nom du souvenir"
              required
            ></b-input>
          </b-field>
        </div>
      </div>

      <div class="o-cells">
        <label class="o-cells__label">Date du souvenir</label>
        <input
          v-model="date"
          class="slider__date-input"
          type="date"
          placeholder="Sélectionner une date"
        />
      </div>

      <TabSections :sections="sections" />
      <Visibility />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Visibility from '@/components/memories/creation/form/Visibility';
import MemoryPreview from '@/components/memories/MemoryPreview';
import dayjs from 'dayjs';
import ButtonBack from '../../../UI/ButtonBack';
import TabSections from '../../../layout/TabSections';

export default {
  name: 'Summary',
  components: {
    TabSections,
    Visibility,
    ButtonBack,
    MemoryPreview,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sections: [
        {
          nav: 'Paramètres de confidentialité',
        },
      ],
    };
  },
  computed: {
    ...mapState('memory', { memory: 'data' }),
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

<style scoped>
.o-page__body {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
