<template>
  <button
    :class="`lost-button ${loading || disabled ? 'disabled' : ''}`"
    :disabled="loading || disabled"
    @click="$emit('click')">
    <img v-if="loading" class="loading" src="@/assets/img/loading.svg" svg-inline alt="">
    <span v-if="!loading">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    disabled: Boolean,
  },
};
</script>

<style lang="scss" scoped>
button.lost-button {
  height: 40px;
  font-size: 12px;
  outline: none;
  border: none;
  transition: background 0.2s;
  cursor: pointer;
  border: solid 1px lighten(color(disabled), 20%);
  border-radius: size(componentBorderRadius);
  color: rgb(34, 34, 34);
  font-family: font(primary);

  .loading {
    margin-top: 4px;
    width: 20px;
    height: auto;
  }

  &.disabled {
    cursor: default;

    .loading {
      path {
        fill: lighten(color(disabled), 10%);
      }
    }
  }

  &.large {
    height: 42px;
    font-size: 13px;
  }

  &.small {
    height: 32px;
    font-size: 11px;
  }

  &:hover {
    background: darken(color(light), 15%);
  }

  &:active {
    background: darken(color(light), 5%);
  }

  /* PRIMARY */
  &.primary {
    background: color(primary);
    border: solid 1px darken(color(primary), 3%);
    color: color(text);

    &.disabled {
      background: darken(color(primary), 15%) !important;
      border: solid 1px darken(color(primary), 15%);
    }

    &:hover {
      background: darken(color(primary), 10%);
    }

    &:active {
      background: darken(color(primary), 5%);
    }

  }

  /* SUCCESS */
  &.success {
    background: color(success);
    border: solid 1px darken(color(success), 3%);
    color: rgb(245, 245, 245);

    &.disabled {
      background: darken(color(success), 15%) !important;
      border: solid 1px darken(color(success), 15%);
    }

    &:hover {
      background: darken(color(success), 10%);
    }

    &:active {
      background: darken(color(success), 5%);
    }
  }

  /* ERROR */
  &.error {
    background: color(error);
    border: solid 1px darken(color(error), 3%);
    color: rgb(245, 245, 245);

    &.disabled {
      background: darken(color(error), 15%) !important;
      border: solid 1px darken(color(error), 15%);
    }

    &:hover {
      background: darken(color(error), 10%);
    }

    &:active {
      background: darken(color(error), 5%);
    }

  }

  /* INFO */
  &.info {
    background: color(info);
    border: solid 1px darken(color(info), 3%);
    color: rgb(245, 245, 245);

    &.disabled {
      background: darken(color(info), 15%) !important;
      border: solid 1px darken(color(info), 15%);
    }

    &:hover {
      background: darken(color(info), 10%);
    }

    &:active {
      background: darken(color(info), 5%);
    }
  }

}
</style>
