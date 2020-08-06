<template>
  <span
    class="lost-link"
    :class="{ disabled: disabled }"
    @click="$emit('click')">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'lost-link',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.lost-link {
  cursor: pointer;
  color: color(text);
  font-size: 10pt;
  transition: color 0.2s;

  &:hover {
    color: color(primary);
  }

  &.disabled {
    cursor: default;

    &:hover {
      color: color(text);
    }
  }
}
</style>
