<template>
  <div class="feed-images-carousel">
    <vue-glide ref="slider" v-model="active" :options="options">
      <vue-glide-slide
        v-for="(memory, i) in data"
        :key="i"
        class="memory-slide"
      >
        <NuxtLink :to="getLinkUrl(memory)" class="memory-preview">
          <div class="memory-preview__image-container">
            <img
              class="memory-preview__image"
              :src="getMemoryPreview(memory)"
              alt="Image du souvenir"
            />
          </div>
          <div class="memory-preview__body">
            <h4 class="memory-preview__name">{{ memory.name }}</h4>
            <p class="memory-preview__date">{{ getMemoryDate(memory.date) }}</p>
            <div class="memory-preview-container">
              <img
                :src="getInstrumentThumbnail(memory)"
                class="memory-preview__img"
                alt="Image de l'instrument"
              />
              <div>
                <p>
                  {{ memory.instrument.name }} - {{ memory.instrument.brand }}
                </p>
                <p>de {{ memory.instrument.owner.username }}</p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </vue-glide-slide>
    </vue-glide>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'FeedMemoryCarousel',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      active: 0,
      options: {
        perView: 1,
        gap: 10,
        rewind: false,
      },
    };
  },

  mounted() {
    if (this.data.length !== 1) return;
    this.$refs.slider.glide.destroy();
  },
  methods: {
    getMemoryPreview(memory) {
      return memory.contents.find((c) => c.type === 'media')?.file?.path;
    },

    getMemoryDate(date) {
      return dayjs(date).format('MMMM YYYY');
    },

    getInstrumentThumbnail(memory) {
      if (!memory.instrument.images.length) return;
      return memory.instrument.images[0]?.path;
    },
    getLinkUrl(memory) {
      return `/instrument/${memory.instrument.id}/souvenir/${memory.id}`;
    },
  },
};
</script>

<style scoped lang="scss">
.feed-images-carousel {
  display: block;
  width: 100%;
  //margin: 20px 0;
  //padding: 16px;
  //background-color: $white;
  border-radius: 4px;
  overflow-wrap: break-word;
  //box-shadow: $shadow--second;

  .glide__slides {
    //padding: 0 16px;
  }
}
[data-glide-el='controls'] {
  z-index: 5;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
}

.memory-slide {
  padding: 16px;
}

.memory-preview {
  display: block;
  padding: 10px 10px 10px 10px;
  background-color: #fff;
  box-shadow: $shadow--third;
  border-radius: 4px;
}

.memory-preview__image-container {
  height: 348px;
  overflow: hidden;
  border-radius: 4px;
}
.memory-preview__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.memory-preview__body {
  padding-top: 12px;
}
.memory-preview__name {
  font-family: $font-secondary;
  font-size: 16px;
}
.memory-preview__date {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 300;
  text-transform: capitalize;
}

.memory-preview-container {
  display: flex;
  align-items: center;
  margin-top: 15px;
}
.memory-preview-container p {
  font-size: 12px;
}
.memory-preview-container p:first-child {
  font-weight: bold;
}
.memory-preview__img {
  margin-right: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
</style>
