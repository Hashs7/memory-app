<template>
  <div class="o-page o-page--profile">
    <div class="">
      <h1>Mon compte</h1>
      <div class="user">
        <img
          v-if="user.thumbnail"
          :src="user.thumbnail.path"
          alt=""
          width="100"
          height="100"
          class="user-picture"
        />
        <p>{{ user.firstName }} {{ user.lastName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  middleware: 'auth',
  computed: {
    user() {
      return this.$auth.$state.user;
    },
  },
};
</script>

<style scoped>
.user-picture {
  display: block;
  margin: 16px auto;
  border-radius: 50%;
}
</style>
