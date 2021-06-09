<template>
  <div class="u-loader"></div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style scoped>
.u-loader {
  width: 50px;
  height: 40px;
  --c: linear-gradient(
    #373737 calc(50% - 10px),
    rgba(0, 0, 0, 0) 0 calc(50% + 10px),
    #373737 0
  );
  background: var(--c) 0% 100%, var(--c) 50% 100%, var(--c) 100% 100%;
  background-size: calc(100% / 3 - 6px) calc(200% + 20px);
  background-repeat: no-repeat;
  animation: loading 1s infinite linear;
}
@keyframes loading {
  33% {
    background-position: 0% 50%, 50% 100%, 100% 100%;
  }
  50% {
    background-position: 0% 0%, 50% 50%, 100% 100%;
  }
  66% {
    background-position: 0% 0%, 50% 0%, 100% 50%;
  }
  100% {
    background-position: 0% 0%, 50% 0%, 100% 0%;
  }
}
</style>
