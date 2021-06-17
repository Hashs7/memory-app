<template>
  <div class="o-page">
    <h1 class="o-page__title">Ajouter</h1>
  </div>
</template>

<script>
export default {
  name: 'Capture',
  data() {
    return {
      sections: [
        {
          name: 'new',
          class: 'new',
          nav: 'Nouveau',
        },
        {
          name: 'memories',
          class: 'memories',
          nav: 'Galerie',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
