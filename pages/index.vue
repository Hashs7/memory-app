<template>
  <div class="o-page o-page--intro">
    <div class="logo"><IconLogo /></div>
    <div class="o-page__container">
      <header class="o-page__head">
        <h1 class="title">Memory Motel</h1>
        <h2 class="subtitle">Votre instrument à tellement à raconter</h2>
      </header>
    </div>
    <IconPartition class="icon--partition" />
    <client-only>
      <div class="o-page__actions">
        <NuxtLink
          v-if="!$auth.loggedIn"
          to="/connexion"
          class="u-button u-button--background half"
        >
          <span class="u-button__content">Se connecter</span>
          <IconOutline class="u-button__bg" />
        </NuxtLink>
        <NuxtLink
          v-if="!$auth.loggedIn"
          to="/onboarding"
          class="u-button u-button--background u-button--primary half dark"
        >
          <span class="u-button__content">S'inscrire</span>
          <IconBackground class="u-button__bg" />
        </NuxtLink>
        <NuxtLink v-else to="/motel" class="u-button--background dark">
          <span class="u-button__content">S'inscrire</span>
          <IconBackgroundFull class="u-button__bg" />
        </NuxtLink>
      </div>
    </client-only>
  </div>
</template>

<script>
import IconBackground from '~/assets/svg/button/btn_background-half.svg?inline';
import IconBackgroundFull from '~/assets/svg/button/btn_background-large.svg?inline';
import IconOutline from '~/assets/svg/button/btn_outline-half.svg?inline';
import IconLogo from '~/assets/svg/ic_logo.svg?inline';
import IconPartition from '~/assets/svg/ic_partition.svg?inline';

export default {
  components: {
    IconBackground,
    IconBackgroundFull,
    IconOutline,
    IconLogo,
    IconPartition,
  },
  layout: 'none',
  asyncData({ $auth, redirect }) {
    if (!$auth.loggedIn) return;
    redirect({
      name: 'instrument',
    });
  },
};
</script>

<style lang="scss" scoped>
.o-page__head {
  max-width: 262px;
  text-align: center;
  margin: auto;
}
.o-page--intro {
  background-image: url('~/assets/img/scratches.png');
}

.o-page__container {
  margin: auto;
}

.o-page__actions {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 44px;
  left: 28px;
  right: 28px;
}

.logo {
  position: absolute;
  top: 120px;
  left: 0;
  right: 0;
  width: 135px;
  margin: auto;
}

.o-page--intro .u-button {
  width: 100%;
  margin-top: 0 !important;
}

.o-page--intro .u-button.half {
  width: calc(50% - 4px);
  padding: 0;
}

.icon--partition {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
  transform: translateY(20px);
}

.title {
  display: block;
  margin-bottom: 12px;
  font-size: 18px;
  font-family: $font-primary;
  font-weight: 300;
}
.subtitle {
  margin-top: 0 !important;
  font-size: 24px;
}
</style>
