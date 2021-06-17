<template>
  <div class="text-content memory-content">
    <div class="memory-text-card">
      <div class="memory-text-card__pattern">
        <textarea v-model="html" class="memory-text-card__text"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextCreation',
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    html: {
      get() {
        return this.$store.state.memory.data.contents[this.index].content;
      },
      set(value) {
        this.$store.commit('memory/updateContent', {
          index: this.index,
          value,
        });
      },
    },
  },
};
</script>

<style lang="scss">
.editr {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: none;
}

.editr--content {
  flex-grow: 1;
}

.editr--toolbar {
  order: 2;
  border-bottom: none;
  border-radius: 0 0 $radius $radius;
}
</style>
