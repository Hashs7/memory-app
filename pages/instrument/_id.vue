<template>
  <div class="instrument">
    <ButtonBack link="/motel" class="instrument__back" />

    <button
      v-if="isOwner"
      class="btn-edit absolute"
      @click="showActions = true"
    >
      Modifier
    </button>
    <button
      v-else
      :class="{ selected: isFavorite }"
      class="instrument-preview__fav btn-edit absolute"
      @click.prevent.stop="addToWish"
    >
      <IconHeart />
    </button>

    <div v-if="instrument">
      <ImagesCarousel v-if="thumbnail" :data="instrument.images" />
      <div class="instrument__container o-page__container">
        <Sonority v-if="instrument.sonority" :media="instrument.sonority" />

        <div class="instrument__head">
          <h1 class="instrument__title">{{ instrument.name }}</h1>
          <h2
            v-if="instrument.brand || instrument.specification"
            class="instrument__description"
          >
            <span v-if="instrument.brand">{{ instrument.brand }}</span>
            <span v-if="instrument.brand && instrument.specification"> - </span>
            <span v-if="instrument.specification">
              {{ instrument.specification }}
            </span>
          </h2>
        </div>

        <div v-if="!isOwner" class="instrument__owner">
          <UserPreview :user="instrument.owner" />
        </div>

        <InstrumentModal
          v-if="isOwner && showActions"
          @close="showActions = false"
        >
          <OwnerActions :instrument="instrument" @update="updateInstrument" />
        </InstrumentModal>

        <div v-if="!isOwner" class="instrument__not-owner"></div>
      </div>

      <MemoriesTimeline
        :data="instrument.timeline"
        :buy-date="instrument.buyDate"
        :instrument-image="instrument.images[0]"
        :allow-add="isOwner"
      />

      <NuxtChild
        v-if="instrument"
        :is-owner="isOwner"
        :instrument="instrument"
      />
    </div>
  </div>
</template>

<script>
import IconHeart from '@/assets/svg/ic_heart.svg?inline';
import UserPreview from '@/components/user/UserPreview';
import ImagesCarousel from '@/components/instrument/ImagesCarousel';
import OwnerActions from '@/components/instrument/OwnerActions';
import ButtonBack from '@/components/UI/ButtonBack';
import MemoriesTimeline from '@/components/memories/timeline/MemoriesTimeline';
import Sonority from '@/components/instrument/Sonority';
import InstrumentModal from '@/components/instrument/InstrumentModal';
import illu from '~/assets/img/illu_spiderweb.png';

export default {
  components: {
    InstrumentModal,
    Sonority,
    MemoriesTimeline,
    ButtonBack,
    OwnerActions,
    ImagesCarousel,
    UserPreview,
    IconHeart,
  },
  layout(ctx) {
    let layout = 'default';
    if (ctx.route.params.memoryId) {
      layout = 'none';
    }
    return layout;
  },
  scrollToTop: false,
  data() {
    return {
      illu,
      instrument: null,
      showActions: false,
    };
  },
  async fetch() {
    try {
      this.instrument = (
        await this.$api.getInstrumentById(this.$route.params.id)
      )?.data;
    } catch (e) {
      await this.$router.push('/404/');
    }
  },
  fetchOnServer: false,
  computed: {
    isOwner() {
      return this.instrument?.owner?._id === this.$auth.$state.user?._id;
    },
    isFavorite() {
      if (this.isOwner) return false;
      return this.$auth.$state.user?.wishList?.includes(this.$route.params.id);
    },
    thumbnail() {
      return this.instrument.images[0]?.path;
    },
  },
  methods: {
    async addToWish() {
      try {
        const res = await this.$api.toggleInstrumentToWishlist(
          this.instrument.id
        );
        this.$auth.setUser(res.data);
      } catch (e) {
        throw new Error(e);
      }
    },
    back() {
      this.$router.go(-1);
    },
    updateInstrument(data) {
      this.instrument = data;
    },
  },
};
</script>

<style lang="scss">
.instrument {
  position: relative;
  overflow-x: hidden;
}

.instrument__back {
  z-index: 5;
  position: absolute;
  top: 18px;
  left: 18px;
}

.instrument__container {
  position: relative;
  z-index: 1;
  padding-top: 22px;
}

.instrument__head {
  text-align: center;
  margin-bottom: 20px;
}

.instrument__title {
  font-size: 26px;
}

.instrument__description {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 400;
  font-family: $font-primary;
}

.instrument__owner {
  text-align: center;
  margin-bottom: 20px;
}
</style>
