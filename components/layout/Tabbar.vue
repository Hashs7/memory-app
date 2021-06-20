<template>
  <nav class="tabbar">
    <div class="tabbar__container">
      <div
        v-for="(navItem, i) in nav"
        :key="i"
        class="tabbar__item"
        :class="[
          navItem.slug,
          { 'tabbar__item--current': $route.path === navItem.path },
        ]"
      >
        <nuxt-link
          v-if="navItem.slug !== 'add'"
          :to="navItem.path"
          class="tabbar__item"
        >
          <span class="tabbar__icon">
            <component :is="navItem.icon" />
          </span>
          <span class="tabbar__text">{{ navItem.label }}</span>
        </nuxt-link>
        <div v-else class="tabbar__item">
          <span class="tabbar__icon">
            <component :is="navItem.icon" />
          </span>
          <span class="tabbar__text">{{ navItem.label }}</span>
          <input
            ref="file"
            type="file"
            class="file"
            capture="environment"
            accept="video/*,image/*"
            @change="previewImg"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import IconMotel from '@/assets/svg/nav/ic_nav-motel.svg?inline';
import IconGallery from '@/assets/svg/nav/ic_nav-gallery.svg?inline';
import IconDiscover from '@/assets/svg/nav/ic_nav-discover.svg?inline';
import IconProfile from '@/assets/svg/nav/ic_nav-profile.svg?inline';
import IconAdd from '@/assets/svg/ic_add.svg?inline';

export default {
  name: 'Tabbar',
  components: {
    IconMotel,
    IconDiscover,
    IconProfile,
    IconGallery,
    IconAdd,
  },
  data() {
    return {
      nav: [
        {
          slug: 'motel',
          label: 'Mon motel',
          path: '/motel',
          icon: 'IconMotel',
        },
        {
          slug: 'gallery',
          label: 'Galerie',
          path: '/galerie',
          icon: 'IconGallery',
        },
        {
          slug: 'add',
          label: 'Capturer',
          path: '/capture',
          icon: 'IconAdd',
        },
        {
          slug: 'discover',
          label: 'Découvrir',
          path: '/decouvrir',
          icon: 'IconDiscover',
        },
        {
          slug: 'profile',
          label: 'Profil',
          path: '/profil',
          icon: 'IconProfile',
        },
      ],
    };
  },
  created() {
    this.updateMemoryPath();
    this.updateProfilePath();
  },
  methods: {
    updateMemoryPath() {
      if (!this.$store.state.motel.user.length) return;
      const { id } = this.$store.state.motel.user[0];
      const motelNav = this.nav.find((n) => n.slug === 'motel');
      motelNav.path = `/instrument/${id}`;
    },

    updateProfilePath() {
      if (!this.$auth.loggedIn) return;
      const motelNav = this.nav.find((n) => n.slug === 'profile');
      motelNav.path = `/${this.$auth.$state.user.username}`;
    },

    previewImg(event) {
      const fileReader = new FileReader();
      [...event.target.files].forEach((f) => {
        fileReader.readAsDataURL(f);
        fileReader.addEventListener('loadend', (e) => this.uploadImg(e, f));
      });
    },

    async uploadImg(event, file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await this.$api.uploadFile(formData);
        this.$store.commit('gallery/addMedia', data.response);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style lang="scss">
.tabbar {
  z-index: 100;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background-color: $background;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  // TODO fix height

  &__item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    svg {
      opacity: 0.5;
    }
    path {
      fill: rgb(55, 55, 55);
    }

    &--current:not(.add) {
      position: relative;
      &:after {
        content: '';
        height: 2px;
        position: absolute;
        top: -14px;
        left: 0;
        right: 0;
        margin: auto;
        background-color: $black;
      }
    }
    &--current .tabbar__text,
    &--current svg {
      opacity: 1;
    }
  }

  &__icon {
    width: 22px;
    height: 22px;
    margin-bottom: 8px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__text {
    opacity: 0.5;
    line-height: 1;
    font-size: 12px;
  }
}

.tabbar__container {
  //margin: auto;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 14px 0 8px 0;
}

.tabbar__item {
  width: 56px;
  position: relative;

  .file {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
  }
}

/*.tabbar__item.add {
  opacity: 1;

  .tabbar__icon {
    display: flex;
    position: absolute;
    top: 0;
    width: 48px;
    height: 48px;
    background-color: $gray-darkest;
    border-radius: 4px;
    transform: translateY(-24px);

    svg {
      opacity: 1;
      margin: auto;
      width: 22px;
      height: 22px;
    }
    rect {
      fill: $background;
    }
  }
}*/
</style>
