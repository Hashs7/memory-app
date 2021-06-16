<template>
  <ValidationObserver
    v-if="!$auth.loggedIn"
    v-slot="{ invalid }"
    tag="div"
    class="form-observer"
  >
    <form class="register__form" @submit.prevent="submit">
      <div class="register__container">
        <div class="form__group">
          <label>
            <ValidationProvider
              v-slot="{ errors }"
              name="email"
              rules="required|email"
            >
              <input
                v-model="login.email"
                autocomplete="username"
                placeholder="Email"
                type="email"
                class="form__input"
                :class="{ error: errors.length }"
              />
              <span class="form__error">{{ errors[0] }}</span>
            </ValidationProvider>
          </label>
        </div>
        <div class="form__group">
          <label>
            <ValidationProvider
              v-slot="{ errors }"
              name="password"
              rules="required|min:8"
            >
              <input
                v-model="login.password"
                placeholder="Mot de passe"
                class="form__input"
                type="password"
                autocomplete="current-password"
                :class="{ error: errors.length }"
              />
              <span class="form__error">{{ errors[0] }}</span>
            </ValidationProvider>
          </label>
        </div>
      </div>
      <div class="form__actions">
        <button
          type="submit"
          :disabled="invalid"
          :class="[invalid]"
          class="u-button u-button--primary"
        >
          Me connecter
        </button>
        <NuxtLink to="/inscription" class="u-button u-button--outline">
          S'inscrire
        </NuxtLink>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  name: 'LoginForm',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      login: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async userLogin() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            username: this.login.email,
            password: this.login.password,
          },
        });
        this.$auth.setUser(response.data.user);
        await this.$auth.fetchUser();
        await this.redirect();
      } catch (e) {
        this.notifyError(e.response.data.message);
      }
    },

    notifyError(message) {
      this.$buefy.toast.open({
        message,
        type: 'is-danger',
      });
    },

    submit(e) {
      e.preventDefault();
      this.userLogin();
    },

    async redirect() {
      if (this.$store.getters['handover/pendingHandover']) {
        // user came from handover
        const id = this.$store.state.handover.instrumentId;
        const { token } = this.$store.state.handover;
        await this.$router.push({
          name: 'passation-reception',
          params: { id },
          query: { token },
        });
        return;
      }
      // Redirect to personal instruments
      await this.$router.push({
        name: 'instrument',
      });
    },
  },
};
</script>

<style scoped>
.form-observer {
  flex-grow: 1;
}
.register__form {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.register__container {
  flex-grow: 1;
}
</style>
