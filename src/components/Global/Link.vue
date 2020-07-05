<template>
  <p :class="`lost-link ${disabled ? ' disabled' : ''} ${type}`" v-on:click="clicked">
    <span>
      <slot></slot>
    </span>
  </p>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'error', 'info'].indexOf(value) !== -1,
    },
    disabled: Boolean,
  },
  methods: {
    clicked() {
      if (!this.disabled) {
        this.$emit('click');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
p.lost-link {
  color: color(light);
  font-size: 13px;

  span {
    transition: color 0.2s;
    cursor: pointer;
  }

  &.disabled span{
    color: color(disabled) !important;
    cursor: default;

    &:hover {
      color: color(disabled) !important
    }

    &:active {
      color: color(disabled) !important
    }
  }

  &.primary span{
    &:hover {
      color: color(primary);
    }

    &:active {
      color: darken(color(primary), 10%);
    }
  }

  &.success span{
    &:hover {
      color: color(success);
    }

    &:active {
      color: darken(color(success), 10%);
    }
  }

  &.error span{
    &:hover {
      color: color(error);
    }

    &:active {
      color: darken(color(error), 10%);
    }
  }

  &.info span{
    &:hover {
      color: color(info);
    }

    &:active {
      color: darken(color(info), 10%);
    }
  }

}

</style>
