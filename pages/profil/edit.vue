<template>
  <form ref="form" class="o-page o-page--profile-edit" @submit="submit">
    <div class="user__header">
      <ButtonBack light class="user-back" />
      <div v-if="isOwner" class="owner">
        <button class="btn-edit fill">Enregistrer</button>
      </div>
    </div>
    <div class="user-infos">
      <div v-if="user.thumbnail" class="user-thumbnail">
        <div class="user-thumbnail__container">
          <input
            ref="file"
            class="u-button__input-file"
            type="file"
            accept="image/*"
            style="opacity: 0"
            @change="previewImg"
          />
          <IconEdit class="edit-icon" />
          <img :src="thumbnail" :alt="`Photo de profil de ${user.firstName}`" />
        </div>
      </div>
      <div class="o-page__container">
        <div class="user-name">
          <input
            v-model="user.firstName"
            name="firstName"
            type="text"
            class="editable-input user-firstname"
          />
          <input
            v-model="user.lastName"
            name="lastName"
            type="text"
            class="editable-input user-lastname"
          />
        </div>
        <p class="user-username">
          @<input
            v-model="user.username"
            type="text"
            name="username"
            class="editable-input user-username"
          />
        </p>
        <p>
          <textarea
            v-model="user.description"
            name="description"
            style="resize: none"
            class="editable-input user-description"
          ></textarea>
        </p>
      </div>
    </div>
  </form>
</template>

<script>
import ButtonBack from '../../components/UI/ButtonBack';
import IconEdit from '~/assets/svg/ic_edit.svg?inline';

export default {
  components: { ButtonBack, IconEdit },
  middleware: 'auth',
  data() {
    return {
      thumbnailPreview: null,
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
    thumbnail() {
      if (this.thumbnailPreview) {
        return this.thumbnailPreview;
      }
      return this.user.thumbnail.path;
    },
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
      const file = this.$refs.file.files[0];
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
      this.$router.push(this.userLink);
    },
    notifyError() {
      this.$buefy.toast.open({
        message: 'Impossible de modifier votre profil',
        type: 'is-danger',
      });
    },
    previewImg() {
      const fileReader = new FileReader();
      const f = this.$refs.file.files[0];
      console.log(f);
      fileReader.readAsDataURL(f);
      fileReader.addEventListener('loadend', (e) => {
        this.thumbnailPreview = fileReader.result;
      });
    },
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
  .user-thumbnail__container {
    position: relative;
    border-radius: 50%;
    height: 100%;
    overflow: hidden;
  }
  .user-username input {
    min-width: 100px;
    text-align: left;
    padding-left: 8px;
  }

  .user-firstname {
    display: inline-block;
    //text-align: right;
    margin-right: 2px;
    width: calc(50% - 2px);
    padding: 8px 4px;
  }
  .user-lastname {
    display: inline-block;
    margin-left: 2px;
    width: calc(50% - 2px);
    padding: 8px 4px;
    //text-align: left;
  }

  .user-thumbnail__container {
    &:after {
      content: '';
      z-index: 4;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba($gray-darkest, 0.5);
    }
  }

  .edit-icon {
    z-index: 5;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .user-description {
    margin-top: 4px;
    max-height: 100px;
    min-height: 100px;
    text-align: left;
  }
}
</style>
