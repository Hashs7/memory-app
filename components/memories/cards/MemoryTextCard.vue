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

<style lang="scss" scoped>
.memory-text-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  padding: 80px 25px 90px 25px;
  background-color: $background;
}

.memory-text-card__pattern {
  width: 100%;
  height: auto;
  min-height: 30%;
  max-height: 100%;
  overflow: hidden;
  background-image: repeating-linear-gradient(
    transparent 0px,
    transparent 40px,
    rgba($gray-darkest, 0.4) 41px
  );
  background-position: 0 -4px;
}

.memory-text-card__text {
  font-size: 16px;
  font-weight: 400;
  line-height: 41px;
}
</style>
