<template>
  <div class="onboarding__container" :class="{ light: active % 2 === 1 }">
    <vue-glide
      ref="slider"
      v-model="active"
      :options="options"
      class="onboarding__image-container"
    >
      <vue-glide-slide
        v-for="(board, i) in boards"
        :key="i"
        class="onboarding__image-preview"
        :style="{
          backgroundImage: `url(${board.image})`,
        }"
      >
        <div class="o-container onboarding__content-container">
          <div>
            <h2 class="onboarding__content-title">
              {{ board.title }}
            </h2>
            <p class="onboarding__content-text">{{ board.content }}</p>
          </div>
        </div>
      </vue-glide-slide>

      <template slot="control" class="onboarding__controls o-container">
        <NuxtLink
          v-if="!$auth.loggedIn"
          to="/connexion"
          class="u-button u-button--primary half onboarding__begin-button"
          :class="{ visible: active === boards.length - 1 }"
          >Commencer</NuxtLink
        >
        <button
          v-for="(board, i) in boards"
          :key="i"
          :data-glide-dir="`=${i}`"
          :class="{ selected: active === i, light: active % 2 === 1 }"
          class="onboarding__control"
        ></button>
      </template>
    </vue-glide>
  </div>
</template>

<script>
export default {
  name: 'Onboarding',
  layout: 'none',

  data() {
    return {
      active: 0,
      options: {
        perView: 1,
        gap: 0,
        rewind: false,
      },

      boards: [
        {
          title: 'Capture',
          content:
            'Enregistrez de façon instantanée vos moments forts dans votre galerie Memory Motel.',
          image: '/img/onboarding_1.png',
        },
        {
          title: 'Raconte',
          content:
            'Construisez l’histoire de votre instrument en ajoutant vos souvenirs à votre motel.',
          image: '/img/onboarding_2.png',
        },
        {
          title: 'Découvre',
          content:
            'Partagez vos meilleurs souvenirs sur votre motel et découvrez l’histoire des instruments des autres passionnés.',
          image: '/img/onboarding_3.png',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
[data-glide-el='controls'] {
  z-index: 5;
  margin-left: 7%;
}

.onboarding__container {
  height: 100vh;
  transition: background-color 0.7s ease;
  &.light {
    background-color: $gray-darkest;
  }
}

.onboarding__image-container .glide__track {
  height: 85vh;
}

.onboarding__content-container {
  position: absolute;
  width: 100vw;
  top: 70%;
}

.onboarding__image-preview {
  height: 100vh;
  background-repeat: no-repeat;
  background-position-x: 50%;

  &:nth-child(even) {
    .onboarding__content-title {
      color: $background;
    }
    .onboarding__content-text {
      color: $background;
    }
  }
}

.onboarding__image-preview[data-glide-index='0'] {
  background-position-y: 22px;
}

.onboarding__control {
  width: 18px;
  height: 4px;
  border-radius: 4px;
  background-color: rgba($gray-darkest, 0.5);
  border: none;
  margin: 0 2px;

  &.selected {
    width: 36px;
    background-color: rgba($gray-darkest, 1);
    &.light {
      background-color: rgba($background, 1);
    }
  }
  &.light {
    background-color: rgb(155, 152, 141);
  }
}

.onboarding__content-title {
  line-height: 1.2;
  font-family: YoungSerif, Arial, sans-serif;
  font-weight: 900;
  color: $gray-darkest;
}

.onboarding__content-text {
  font-family: $font-primary;
  margin-top: 30px;
  color: $gray-darkest;
}

.onboarding__begin-button {
  width: 50%;
  visibility: hidden;
  &.visible {
    visibility: visible;
  }
}
</style>
