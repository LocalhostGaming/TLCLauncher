<template>
  <div
    :class="`lost-checkbox ${disabled ? 'disabled' : ''} ${type}`"
    @click="disabled ? '' : $emit('check')">
    <input type="checkbox" :disabled="disabled" v-bind:checked="value">
    <div :class="`checkmark ${disabled ? 'disabled' : ''} ${type}`"></div>
    <p>
      <slot></slot>
    </p>
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
    disabled: Boolean,
    value: Boolean,
  },
};
</script>

<style lang="scss" scoped>
div.lost-checkbox{
  display: flex;
  cursor: pointer;
  color: color(light);
  font-size: 13px;
  font-family: 'Poppins';

  &:hover {
    .checkmark {
      background-color: lighten(color(disabled), 20%);
    }
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    margin: 0;
    &:checked ~ .checkmark {
      background: color(primary);
    }

    &:checked ~ .checkmark:after {
      display: block;
    }
  }

  .checkmark {
    position: relative;
    display: block;
    background-color:white;
    width: 14px;
    height: 14px;
    margin: 2px 5px 2px 0;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 2px;

    &:after {
      content: "";
      position: absolute;
      display: none;
    }

    &:after {
      width: 3px;
      height: 8px;
      position: absolute;

      top: 1px;
      left: 4.2px;
      border: solid color(text);
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  p {
    transition: color 0.2s;
  }

  /* DISABLED */
  &.disabled {
    cursor: default;
    input {
      cursor: default;
    }
    .checkmark {
      cursor: default;
      background: darken(color(disabled), 30%) !important;
    }
    p {
      color: color(disabled) !important;
    }
  }

  /* PRIMARY */
  &.primary {
    input {
      &:checked ~ .checkmark {
        background: color(primary);
      }
    }

    p {
      &:hover {
        color: color(primary);
      }

      &:active {
        color: darken(color(primary), 15%);
      }
    }
  }

  /* SUCCESS */
  &.success {
    input {
      &:checked ~ .checkmark {
        background: color(success);
      }
    }

    p {
      &:hover {
        color: color(success);
      }

      &:active {
        color: darken(color(success), 15%);
      }
    }
  }

  /* ERROR */
  &.error {
    input {
      &:checked ~ .checkmark {
        background: color(error);
      }
    }

    p {
      &:hover {
        color: color(error);
      }

      &:active {
        color: darken(color(error), 15%);
      }
    }
  }

  /* INFO */
  &.info {
    input {
      &:checked ~ .checkmark {
        background: color(info);
      }
    }

    p {
      &:hover {
        color: color(info);
      }

      &:active {
        color: darken(color(info), 15%);
      }
    }
  }
}
</style>
