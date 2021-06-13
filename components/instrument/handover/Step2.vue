<template>
  <div class="step step-2">
    <nav class="o-section__head tab-nav">
      <button class="tab-nav__item current">
        <span>Scannez le code</span>
      </button>
    </nav>
    <div class="handover__qrcode">
      <canvas ref="canvas" class="canvas" width="172px" height="172px"></canvas>
      <Background class="background" />
    </div>
    <p class="">Faites-lui scanner !</p>
    <p class="">Faites scanner ce code unique au nouveau propriétaire</p>
    <ClipboardCopy v-if="url" :value="url">Copier le lien</ClipboardCopy>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import ClipboardCopy from '../../layout/ClipboardCopy';
import Background from '~/assets/svg/qrcode-background.svg?inline';

export default {
  name: 'Step2',
  components: {
    ClipboardCopy,
    Background,
  },
  data() {
    return {
      url: '',
    };
  },
  computed: {
    token() {
      return this.$store.state.handover.senderToken;
    },
  },
  watch: {
    token() {
      this.showQRCode();
    },
  },
  methods: {
    async showQRCode() {
      this.url = `${window.location.href}/reception?token=${this.token}`;
      await QRCode.toCanvas(this.$refs.canvas, this.url, {
        color: {
          light: '#0000',
          dark: '#373737',
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.step-2 {
  text-align: center;
}
.handover__qrcode {
  position: relative;
  display: inline-flex;
  padding: 32px;
  margin: auto;

  .canvas {
    margin: auto;
    position: relative;
    z-index: 1;
    border-radius: 8px;
    box-shadow: $shadow--third;
    background-color: $background;
  }
  .background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
