<template>
  <div class="empty-instrument">
    <img src="~/assets/img/illu_face-mer.png" alt="Face à la mere" />
    <h3 class="empty__title">"Face à la mer !"</h3>
    <p class="empty__author">Calogero</p>
    <p class="empty__description">
      C’est bien vide ici...<br />
      Ajoute un instrument en favoris en cliquant sur le coeur d’un instrument
      qui te plaît !
    </p>
  </div>
</template>

<script>
export default {
  name: 'EmptyInstrument',
};
</script>

<style lang="scss" scoped>
.empty-instrument {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 70px auto 0;
  width: 90%;
  grid-column-start: 1;
  grid-column-end: 3;

  & h3 {
    margin-top: 50px;
  }
  & p {
    margin-top: 5px;
  }
  & p:last-child {
    margin-top: 35px;
  }
}
.empty__title {
  font-family: $font-primary;
  font-weight: 700;
  margin: 52px 0 0 0;
}
.empty__author {
  font-size: 12px;
  color: $gray-darkest;
  margin-top: 0;
}
.empty__description {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  margin-top: 32px;
}
</style>
