<template>
  <section class="instru-tunnel__section">
    <div class="instru-tunnel__text">
      <h2>Son plus bel accord</h2>
      <p>
        Enregistre le son que fait ton instrument sur un accord de ton choix !
      </p>
    </div>
    <img
      class="instru-tunnel__img"
      src="~/assets/img/tunnel_sonority.png"
      alt="Sonority instrument"
    />
    <AudioRecorder hide-actions />
  </section>
</template>

<script>
import AudioRecorder from '../../gallery/audio/AudioRecorder';

export default {
  name: 'CreationStep3',
  components: {
    AudioRecorder,
  },
};
</script>

<style lang="scss">
.instru-tunnel__section {
  .audio-recorder {
    flex-grow: 1;
    display: flex;
  }

  .audio-recorder__container {
    color: $gray-darkest;
    margin: auto;
  }
}
</style>
