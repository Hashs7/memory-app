<template>
  <div class="o-page o-page--profile-edit">
    <div class="user__header">
      <ButtonBack light class="user-back" />
      <div v-if="isOwner" class="owner">
        <NuxtLink :to="userLink" class="btn-edit fill">Enregistrer</NuxtLink>
      </div>
    </div>
    <div class="user-banner">
      <img src="http://seb-mbp.local:3000/file/guitar1975.jpg" alt="" />
    </div>
    <div class="user-infos">
      <div v-if="user.thumbnail" class="user-thumbnail">
        <img
          :src="user.thumbnail.path"
          :alt="`Photo de profil de ${user.firstName}`"
        />
      </div>
      <div class="o-page__container">
        <div class="user-name">
          <input
            v-model="user.firstName"
            type="text"
            class="editable-input user-firstname"
          />
          <input
            v-model="user.lastName"
            type="text"
            class="editable-input user-lastname"
          />
        </div>
        <p class="user-username">
          <input
            v-model="user.username"
            type="text"
            class="editable-input user-username"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonBack from '../../components/UI/ButtonBack';

export default {
  components: { ButtonBack },
  middleware: 'auth',
  data() {
    return {
      user: {
        firstName: null,
        lastName: null,
        username: null,
      },
    };
  },
  computed: {
    userLink() {
      return {
        name: 'user',
        params: { user: this.user.username },
      };
    },
    name() {
      if (!this.user.firstName) return null;
      let txt = this.user.firstName;
      if (this.user.lastName) {
        txt += ` ${this.user.lastName}`;
      }
      return txt;
    },
    isOwner() {
      return this.$auth.$state.user._id === this.user._id;
    },
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.user = { ...this.$auth.$state.user };
    }
  },
};
</script>

<style lang="scss">
.editable-input {
  text-align: center;
  background-color: $background-darker;
}
.o-page--profile-edit {
  .user-name {
    font-size: 0;
  }

  .user-firstname {
    display: inline-block;
    text-align: right;
    margin-right: 4px;
    width: calc(50% - 4px);
    padding: 8px 4px;
  }
  .user-lastname {
    display: inline-block;
    margin-left: 4px;
    width: calc(50% - 4px);
    padding: 8px 4px;
    text-align: left;
  }
}
</style>
