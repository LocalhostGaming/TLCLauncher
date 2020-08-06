<template>
  <div class="lost-textfield-container">

    <div
      class="lost-textfield"
      :class="[{
        active: isFocused,
        disabled: disabled },
        typeof message === 'string' ? 'error' : '',
        message.type]"
      @click="focus">

      <div
        class="lost-textfield__label"
        v-if="!solo"
        :class="{ active: isFocused, disabled: disabled }"
        v-bind:style="labelStyle"
        @click="focus">
        {{ label }}
      </div>

      <div
        class="lost-textfield__label"
        v-if="solo && !value"
        :class="{ disabled: disabled }"
        @click="focus">
        {{ label }}
      </div>

      <div
        class="lost-textfield__eye"
        :class="{ active: showpass }"
        v-if="password && value"
        @mousedown="showPassword(true)"
        @mouseup="showPassword(false)"
        @mouseleave="showPassword(false)">
        <img src="@/assets/images/show-password.svg" svg-inline alt="">
      </div>

      <input
        class="lost-textfield__input"
        :class="{ disabled: disabled, solo: solo }"
        :type="password && !showpass ? 'password' : 'text'"
        spellcheck="false"
        ref="input"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @focus="inputFocused(true)"
        @blur="inputFocused(false)"
        :disabled="disabled">

    </div>

    <div class="lost-textfield-message" v-if="typeof message === 'object' && message">

      <div class="lost-textfield-message__message" :class="[ message.type ]">
        {{ message.message }}
      </div>

    </div>

    <div class="lost-textfield-message" v-if="typeof message === 'string' && message">

      <div class="lost-textfield-message__message error">
        {{ message }}
      </div>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    password: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    message: {},
  },
  computed: {
    labelStyle() {
      let style = {};

      if (this.isFocused || this.value) {
        style = {
          transform: 'scale(0.75, 0.75)',
          margin: '0',
        };
      }

      return style;
    },
  },
  data: () => ({
    isFocused: false,
    showpass: false,
  }),
  methods: {
    focus() {
      this.$refs.input.focus();
      this.$emit('focus');
    },
    inputFocused(value) {
      this.$emit('focus');
      this.isFocused = value;
    },
    showPassword(value) {
      if (!this.disabled) {
        this.showpass = value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.lost-textfield-container {

}

.lost-textfield {
  min-width: 150px;

  background: color(light);

  padding: 4px 16px;
  border-radius: 1.5pt;
  cursor: text;

  transition: 0.2s;

  &.disabled {
    background: color(disabled);
    cursor: default;

    &__eye {
      cursor: default !important;
    }
  }

  &.active {
    box-shadow: 0 0 0 1.5pt color(primary);
  }

  &.error {
    box-shadow: 0 0 0 1.5pt color(error) !important;
  }

  &__label {
    font-size: 10pt;
    color: #6E6E6E;
    font-weight: 600;
    position: absolute;
    z-index: 1;
    cursor: text;
    transition: 0.2s ease;

    margin: 9px 0;

    transform-origin: left;

    &.active {
      color: color(primary);
    }

    &.disabled {
      cursor: default;
    }
  }

  &__input {
    width: 100%;
    padding: 0;

    margin-top: 16px;

    font-size: 11pt;
    font-weight: 600;
    font-family: font(primary);

    background: transparent;
    color: color(dark);

    &.solo {
      margin: 8px 0;
    }

    &.disabled {
      &::selection {
          background: transparent;
      }
    }
  }

  &__eye {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    position: absolute;
    cursor: pointer;
    z-index: 1;
    right: 12px;
    margin-top: 8px;

    svg {
      outline: none;
    }

    &.active {
      path {
        fill: color(dark-lighter);
      }
      circle {
        fill: color(dark-lighter);
      }
    }

    path {
      fill: lighten(color(dark-lighter), 20%);
    }
    circle {
      fill: lighten(color(dark-lighter), 20%);
    }
  }
}

.lost-textfield-message {
  &__message {
    font-size: 9pt;
    font-weight: 600;
    line-height: 1;

    margin-top: 4pt;

    &.primary {
      color: color(primary);
    }

    &.success {
      color: color(success);
    }

    &.error {
      color: color(error);
    }

    &.info {
      color: color(info);
    }

    &.warning {
      color: color(warning);
    }

  }

}
</style>
