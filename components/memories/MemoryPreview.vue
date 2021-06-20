<template>
  <component
    :is="linkUrl ? 'nuxt-link' : 'div'"
    :to="linkUrl"
    class="memory-preview"
    @click="$emit('click')"
  >
    <client-only>
      <nuxt-link
        v-if="editable && isOwner"
        :to="editLinkUrl"
        class="memory-preview__edit u-button--action"
      >
        <IconEdit />
      </nuxt-link>
    </client-only>
    <div v-if="thumbnail" class="memory-preview__image-container">
      <img
        class="memory-preview__image"
        :src="thumbnail"
        alt="Image du souvenir"
      />
    </div>
    <div class="memory-preview__body">
      <h4 class="memory-preview__name">{{ data.name }}</h4>
      <p class="memory-preview__date">{{ date }}</p>
    </div>
  </component>
</template>

<script>
import dayjs from 'dayjs';
import IconEdit from '@/assets/svg/ic_edit.svg?inline';

export default {
  name: 'MemoryPreview',
  components: { IconEdit },
  props: {
    link: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,

      name: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    linkUrl() {
      let { id } = this.$route.params;
      if (!id) {
        id = this.data.instrumentId;
      }
      return `/instrument/${id}/souvenir/${this.data.id}`;
    },
    editLinkUrl() {
      return `${this.linkUrl}/edit`;
    },
    user() {
      return this.$store.state.user;
    },
    isOwner() {
      return this.data.createdBy === this.$auth.$state.user?._id;
    },
    thumbnail() {
      return this.data.contents.find((c) => c.type === 'media')?.file?.path;
    },
    date() {
      return dayjs(this.data.date).format('MMMM YYYY');
    },
  },
};
</script>
