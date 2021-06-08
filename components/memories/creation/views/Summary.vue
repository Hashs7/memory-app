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

      <div class="o-cells"></div>

      <TabSections :sections="sections" />
      <Visibility />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Visibility from '@/components/memories/creation/form/Visibility';
import MemoryPreview from '@/components/memories/MemoryPreview';
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
