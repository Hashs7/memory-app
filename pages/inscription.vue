<template>
  <div class="o-page o-page--register o-page__container">
    <div class="o-page__header">
      <div class="logo"><IconLogo /></div>
      <span class="o-page__title">Création de compte</span>
      <h1 class="o-page__subtitle">Commençons par vous !</h1>
    </div>
    <RegisterForm />
  </div>
</template>

<script>
import RegisterForm from '../components/user/RegisterForm';
import IconLogo from '~/assets/svg/ic_logo.svg?inline';

export default {
  name: 'Register',
  components: {
    RegisterForm,
    IconLogo,
  },
  layout: 'none',
};
</script>
