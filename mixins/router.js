export const router = {
  beforeCreate(to, from, next) {
    // const lastRouteName = localStorage.getItem('LS_ROUTE_KEY');
    // const lastActivityAt = localStorage.getItem('LS_LAST_ACTIVITY_AT_KEY');
    localStorage.setItem('LS_ROUTE_KEY', this.$route.name);
    localStorage.setItem('LS_LAST_ACTIVITY_AT_KEY', Date.now());
    // this.isFirstTransition = false;
  },
};
