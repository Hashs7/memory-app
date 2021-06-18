<template>
  <div class="memory-text-card">
    <div class="memory-text-card__pattern">
      <p class="memory-text-card__text" v-html="data.content"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemoryTextCard',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
