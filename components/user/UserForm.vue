<template>
  <form ref="form" @submit="submit">
    <div class="round-upload">
      <FileUpload ref="files" :multiple="false" />
    </div>
    <div class="form__group">
      <label>
        <input
          v-model="user.firstName"
          class="form__input"
          placeholder="Prénom"
          name="firstName"
          type="text"
        />
      </label>
    </div>
    <div class="form__group">
      <label>
        <input
          v-model="user.lastName"
          placeholder="Nom"
          class="form__input"
          name="lastName"
          type="text"
        />
      </label>
    </div>
    <div class="form__group">
      <label>
        <input
          v-model="user.username"
          class="form__input"
          placeholder="Pseudo"
          name="username"
          type="text"
        />
      </label>
    </div>
    <button type="submit" class="u-button u-button--primary">Valider</button>
  </form>
</template>

<script>
import FileUpload from '../UI/FileUpload';

export default {
  name: 'UserForm',
  components: { FileUpload },
  data() {
    return {
      user: {
        firstName: null,
        lastName: null,
        username: null,
      },
    };
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.user = { ...this.$auth.$state.user };
    }
  },
  methods: {
    async submit(e) {
      e.preventDefault();
      const formData = new FormData(this.$refs.form);
      const file = this.$refs.files.dropFiles;
      if (file) {
        formData.append('thumbnail', file);
      }
      try {
        await this.$api.updateUser(formData);
        await this.$auth.fetchUser();
        this.redirect();
      } catch (e) {
        this.notifyError();
      }
    },
    redirect() {
      this.$router.push({
        name: 'profil',
      });
    },
    notifyError() {
      this.$buefy.toast.open({
        message: 'Impossible de modifier votre profil',
        type: 'is-danger',
      });
    },
  },
};
</script>

<style scoped></style>
