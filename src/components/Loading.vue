<template>
  <div class="loading">
    <!-- loading message -->
    <p class="loading__message">{{ message }}</p>

    <img class="loading__icon" src="@/assets/images/loading.svg" svg-inline alt="">
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    message: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  &__message {
    color: color(text);
    font-size: 10pt;
    font-weight: 600;
    margin-bottom: 14px;
  }

  svg {
    width: 40px;
    height: 40px;

    circle {
      stroke: color(primary);
      stroke-width: 6px;
    }
  }
}
</style>
