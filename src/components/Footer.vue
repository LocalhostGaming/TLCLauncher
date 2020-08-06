<template>
  <div class="footer">
    <!-- City -->
    <transition name="fade">
      <img
        v-if="launcherState === 'auth'"
        class="footer__city"
        src="@/assets/images/city.svg"
        svg-inline
        alt="">
    </transition>

    <!-- Version and Localhost -->
    <div class="footer__detail">
      <p class="footer__detail__version">VERSION 2.0</p>
      <p class="footer__detail__company">
        POWERED BY
        <span>LOCALHOST GAMING</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    launcherState: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  &__city {
    width: 420px;
    display: block;
    margin: 0 auto;
    outline: none;

    path {
      fill: darken(color(dark-lighter), 6%);
    }
  }

  &__detail {
    background: lighten(color(dark-lighter), 0%);
    width: 100%;
    display: flex;

    padding: 1px 10px;

    font-weight: 600;
    font-size: 9pt;
    letter-spacing: 0.5px;

    color: color(disabled);

    &__company{
      margin-left: auto;
      font-weight: 400;
      span {
        font-weight: 600;
      }
    }

  }
}
</style>
