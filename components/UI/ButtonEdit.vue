<template>
  <button
    class="u-button--back edit"
    :class="{ light, absolute }"
    @click="back"
  >
    <IconEdit />
  </button>
</template>

<script>
import IconEdit from '@/assets/svg/ic_edit.svg?inline';

export default {
  name: 'ButtonEdit',
  components: {
    IconEdit,
  },
  props: {
    emit: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
    absolute: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    back() {
      if (this.link) {
        this.$router.push(this.link);
        return;
      }
      if (this.emit) {
        this.$emit('back');
        return;
      }
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.u-button--back.edit {
  padding: 8px;
}
.u-button--back.edit svg {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
