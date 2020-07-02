<template>
  <div :class="`lost-alert ${type}`">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'error', 'info'].indexOf(value) !== -1,
    },
  },
};
</script>

<style lang="scss" scoped>
div.lost-alert{
  margin: 8px 0;
  padding: 4px 10px;
  border-radius: size(componentBorderRadius);
  color: rgb(243, 243, 243);

  span {
    font-size: 12px;
  }

  &.primary {
    color: color(text) !important;
    background: rgba(color(primary), 0.9);
    border: solid 2px darken(color(primary), 5%)
  }

  &.error {
    background: rgba(color(error), 0.9);
    border: solid 2px darken(color(error), 5%)
  }

  &.success {
    background: rgba(color(success), 0.9);
    border: solid 2px darken(color(success), 5%)
  }

  &.info {
    background: rgba(color(info), 0.9);
    border: solid 2px darken(color(info), 5%)
  }
}
</style>
