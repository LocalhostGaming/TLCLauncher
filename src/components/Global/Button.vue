<template>
  <button
    class="lost-button"
    v-bind:class="[
      color,
      {
        disabled: disabled || loading,
        outline: outline,
        text: text,
        small: small,
      },
    ]"
    :disabled="disabled"
    @click="$emit('click')"
    tabindex="0">
    <div class="name">
      <slot v-if="!loading"></slot>
      <img v-if="loading" src="@/assets/images/loading.svg" svg-inline alt="">
    </div>
  </button>
</template>

<script>
export default {
  props: {
    outline: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.lost-button {
  width: 100%;
  height: 46px;

  display: block;
  border-radius: 1.5pt;
  cursor: pointer;

  font-family: font(primary);
  font-size: 10pt;
  font-weight: 600;

  color: color(text);

  &:hover {
    .name {
      transition: transform 0.2s ease;
      transform: scale(1, 1);
    }
  }

  &:active {
    .name {
      transition: transform 0.2s ease;
      transform: scale(0.95, 0.95);
    }
  }

  &.small {
    height: 34px;
    font-size: 9pt;
  }

  &.disabled {
    background: lighten(color(dark), 12%) !important;
    color: color(disabled);
    cursor: default;

    &:hover {
      background: darken(color(primary), 5%);
    }

    &:active {
      background: lighten(color(primary), 5%);
      .name {
        transform: scale(1, 1) !important;
      }
    }
  }

  &.primary {
    background: color(primary);
    transition: background 0.2s;

    // &:focus {
    //   box-shadow: 0 0 0 1.5pt lighten(color(primary), 8%);
    // }

    &:hover {
      background: darken(color(primary), 5%);
    }

    &:active {
      background: lighten(color(primary), 5%);
    }
  }

  &.warning {
    background: color(warning);
    transition: background 0.2s;

    &:hover {
      background: darken(color(warning), 5%);
    }

    &:active {
      background: lighten(color(warning), 5%)
    }
  }

  &.error {
    background: color(error);
    transition: background 0.2s;

    &:hover {
      background: darken(color(error), 5%);
    }

    &:active {
      background: lighten(color(error), 5%)
    }
  }

  &.success {
    background: color(success);
    transition: background 0.2s;

    &:hover {
      background: darken(color(success), 5%);
    }

    &:active {
      background: lighten(color(success), 5%)
    }
  }

  &.info {
    background: color(info);
    transition: background 0.2s;

    &:hover {
      background: darken(color(info), 5%);
    }

    &:active {
      background: lighten(color(info), 5%)
    }
  }

  &.discord {
    background: color(discord);
    transition: background 0.2s;

    // &:focus {
    //   box-shadow: 0 0 0 1.5pt lighten(color(primary), 8%);
    // }

    &:hover {
      background: darken(color(discord), 5%);
    }

    &:active {
      background: lighten(color(discord), 5%);
    }
  }
}
</style>
