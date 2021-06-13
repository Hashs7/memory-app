<template>
  <div>
    <section class="main-content o-layout--default">
      <nuxt />
    </section>
    <Tabbar />
  </div>
</template>

<script>
import Tabbar from '@/components/layout/Tabbar';

export default {
  name: 'LayoutDefault',
  components: {
    Tabbar,
  },
};
</script>

<style>
.o-layout--default {
  margin: 0 0 72px 0;
}
</style>
