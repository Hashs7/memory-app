<template>
  <ValidationObserver v-slot="{ invalid }" tag="div" class="form-observer">
    <form class="register__form" @submit.prevent="submit">
      <div class="register__container">
        <div class="form__group">
          <label>
            <ValidationProvider
              v-slot="{ errors }"
              name="surnom"
              rules="required|min:4|max:32"
            >
              <input
                v-model="username"
                placeholder="Surnom"
                type="text"
                class="form__input"
                :class="{ error: errors.length }"
              />
              <!--              <span class="form__error">{{ errors[0] }}</span>-->
            </ValidationProvider>
          </label>
        </div>
        <div class="form__group">
          <label class="form__field--half">
            <ValidationProvider
              v-slot="{ errors }"
              name="prénom"
              rules="required|min:4|max:20"
            >
              <input
                v-model="firstName"
                placeholder="Prénom"
                type="text"
                class="form__input"
                :class="{ error: errors.length }"
              />
              <!--              <span class="form__error">{{ errors[0] }}</span>-->
            </ValidationProvider>
          </label>
          <label class="form__field--half">
            <ValidationProvider
              v-slot="{ errors }"
              name="nom"
              rules="required|min:4|max:20"
            >
              <input
                v-model="lastName"
                class="form__input"
                placeholder="Nom"
                type="text"
                :class="{ error: errors.length }"
              />
              <!--              <span class="form__error">{{ errors[0] }}</span>-->
            </ValidationProvider>
          </label>
        </div>
        <div class="form__group">
          <label>
            <ValidationProvider
              v-slot="{ errors }"
              name="email"
              rules="required|email"
            >
              <input
                v-model="email"
                autocomplete="username"
                placeholder="Email"
                class="form__input"
                type="email"
                :class="{ error: errors.length }"
              />
              <!--              <span class="form__error">{{ errors[0] }}</span>-->
            </ValidationProvider>
          </label>
        </div>
        <div class="form__group">
          <label>
            <ValidationProvider
              v-slot="{ errors }"
              name="mot de passe"
              :rules="{ regex, required: true, min: 8 }"
            >
              <input
                v-model="password"
                placeholder="Mot de passe"
                class="form__input"
                type="password"
                :class="{ error: errors.length }"
              />
              <!--              <span class="form__error">{{ errors[0] }}</span>-->
            </ValidationProvider>
          </label>
        </div>
      </div>
      <div class="form__actions">
        <button
          :disabled="invalid"
          :class="[invalid]"
          type="submit"
          class="u-button u-button--background dark"
        >
          <span class="u-button__content">S'inscrire</span>

          <BtnBackground class="u-button__bg" />
        </button>
        <NuxtLink to="/connexion" class="u-button u-button--background">
          <span class="u-button__content">J'ai déjà un compte</span>
          <BtnOutline class="u-button__bg" />
        </NuxtLink>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import BtnBackground from '@/assets/svg/button/btn_background-large.svg?inline';
import BtnOutline from '@/assets/svg/button/btn_outline.svg?inline';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  name: 'RegisterForm',
  components: {
    ValidationProvider,
    ValidationObserver,
    BtnBackground,
    BtnOutline,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    };
  },
  computed: {
    regex() {
      return /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    },
  },
  methods: {
    async submit(e) {
      e.preventDefault();
      try {
        await this.$api.register({
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
          password: this.password,
        });

        const response = await this.$auth.loginWith('local', {
          data: {
            username: this.email,
            password: this.password,
          },
        });
        this.$auth.setUser(response.data.user);
        this.redirect();
      } catch (e) {
        this.notifyError(e.response.data.message);
      }
    },

    redirect() {
      if (this.$store.getters['handover/pendingHandover']) {
        this.redirectHandover();
        return;
      }
      // Redirect to personal instruments
      this.$router.push({
        name: 'instrument-creation-tunnel',
      });
    },

    redirectHandover() {
      // user came from handover
      const id = this.$store.state.handover.instrumentId;
      const { token } = this.$store.state.handover;
      this.$router.push({
        name: 'passation-reception',
        params: { id },
        query: { token },
      });
    },

    notifyError(message) {
      this.$buefy.toast.open({
        message,
        type: 'is-danger',
      });
    },
  },
};
</script>

<style scoped>
.form-observer {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
