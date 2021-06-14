<template>
  <div class="o-page o-page--login">
    <div class="o-page__header">
      <div class="logo"><IconLogo /></div>
      <span class="o-page__title">Connexion au compte</span>
      <h1 class="o-page__subtitle">Bon retour parmis nous !</h1>
    </div>
    <LoginForm v-if="!$auth.loggedIn" />
    <Logout v-else type="submit" class="button"> Me déconnecter </Logout>
    <button class="u-link" @click="resetPassword">Mot de passe oublié</button>
  </div>
</template>

<script>
import Logout from '../components/user/Logout';
import LoginForm from '../components/user/LoginForm';
import IconLogo from '~/assets/svg/ic_logo.svg?inline';

export default {
  name: 'Login',
  components: {
    LoginForm,
    Logout,
    IconLogo,
  },
  layout(ctx) {
    let layout = 'default';
    if (!ctx.$auth.loggedIn) {
      layout = 'none';
    }
    return layout;
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    resetPassword() {},
  },
};
</script>
