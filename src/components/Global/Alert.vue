<template>
  <div :class="`lost-alert ${type}`">
    <p class="title" v-if="title">{{title}}</p>
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
      required: false,
      validator: (value) => ['primary', 'success', 'error', 'info'].indexOf(value) !== -1,
    },
    title: {
      type: String,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
div.lost-alert{
  margin: 8px 0;
  padding: 8px 10px;
  border-radius: size(componentBorderRadius);
  color: color(text);

  .title {
    font-weight: 600;
    font-size: 10px;
    line-height: 1;
    margin-top: 4px;
  }

  span {
    font-size: 12px;
  }

  &.primary {
    color: color(text) !important;
    background: rgba(color(primary), 0.9);
    border: solid 2px darken(color(primary), 5%)
  }

  &.warning {
    color: color(text) !important;
    background: rgba(color(warning), 0.9);
    border: solid 2px darken(color(warning), 5%)
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
