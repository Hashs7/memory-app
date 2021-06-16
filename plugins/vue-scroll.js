import Vue from 'vue';
import vuescroll from 'vuescroll';

Vue.use(vuescroll, {
  ops: {
    // The global config
    locking: true,
    bar: {
      background: 'rgba(0,0,0, .3)',
    },
  },
  name: 'vue-scroll',
});
