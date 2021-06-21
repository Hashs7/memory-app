<template>
  <div class="timeline-handover-card">
    <div class="timeline-handover-card__head">
      <div class="timeline-handover-card__users">
        <div
          class="timeline-handover-card__user timeline-handover-card__user--old"
        >
          <img
            v-if="oldUserThumbnail"
            class="timeline-handover-card__user-thumbnail"
            :src="oldUserThumbnail"
            alt=""
          />
          <IconUser v-else class="timeline-handover-card__user-empty" />
        </div>
        <div
          class="timeline-handover-card__user timeline-handover-card__user--new"
        >
          <img
            v-if="newUserThumbnail"
            class="timeline-handover-card__user-thumbnail"
            :src="newUserThumbnail"
            alt=""
          />
          <IconUser v-else class="timeline-handover-card__user-empty" />
        </div>
      </div>
    </div>
    <div class="timeline-handover-card__body">
      <h4 class="timeline-handover-card__title">Passation !</h4>
      <span class="timeline-handover-card__date">Le {{ date }}</span>
      <p class="timeline-handover-card__text">
        L'instrument est maintenant à :<br />
        <strong>{{ data.newUser.firstName }}</strong> !
      </p>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import IconUser from '@/assets/svg/ic_user.svg?inline';

export default {
  name: 'TimelineHandoverCard',
  components: { IconUser },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    date() {
      return dayjs(this.data.date).format('D MMMM YYYY');
    },
    oldUserThumbnail() {
      return this.data.oldUser?.thumbnail?.path;
    },
    newUserThumbnail() {
      return this.data.newUser?.thumbnail?.path;
    },
  },
};
</script>

<style lang="scss" scoped>
$user-size: 140px;

.timeline-handover-card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: self-start;
  justify-content: flex-start;
  margin: 20px 0;
  padding: 8px;
  border: 8px solid $white;
  background-color: $background-lighter;
  border-radius: 4px;
  word-wrap: break-word;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);

  &__head {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/img/handover_background.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    margin-bottom: 20px;
  }

  &__users {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: $user-size / -2;
    margin-left: $user-size / -2;
  }

  &__user {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: $user-size;
    height: $user-size;
    border-radius: 100%;
    border: 3px solid $background-lighter;
    background-color: $gray-darker;
    overflow: hidden;

    &--new {
      top: 30px;
      left: 30px;
      z-index: +1;
    }

    &--old {
      top: -30px;
      left: -30px;
    }

    &-empty {
      height: 70px;
      width: 70px;
      fill: $white;
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  &__title {
    font-family: $font-secondary;
    font-size: 20px;
  }

  &__date {
    font-size: 12px;
    opacity: 0.4;
  }

  &__text {
    margin: 20px 0 10px 0;
    text-align: center;
  }
}
</style>
