<template>
  <div :class="`lost-input ${propsState.type}`">

    <!-- Input -->
    <input
      :class="disabled ? 'disabled' : ''"
      :type="propsType"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :disabled="disabled"
      :placeholder="placeholder">

    <!-- Message -->
    <span class="message" v-if="propsState.message">{{propsState.message}}</span>

  </div>
</template>

<script>
export default {
  props: {
    state: Object,
    password: Boolean,
    disabled: Boolean,
    placeholder: String,
    value: String,
  },
  computed: {
    propsState() {
      let data = {
        type: '',
        message: '',
      };

      if (this.state) {
        data = this.state;
      }

      return data;
    },
    propsType() {
      if (this.password) {
        return 'password';
      }

      return 'text';
    },
  },
};
</script>

<style lang="scss" scoped>
div.lost-input {
  font-size: 12px;
  padding: 6px 0;

  input {
    width: 100%;
    padding: 8px 12px;
    border: solid 1px lighten(color(disabled), 20%);
    outline: none;
    color: color(dark);
    font-weight: 400;
    transition: border 0.2s;
    border-radius: size(componentBorderRadius);
    font-size: 13px;

    &:focus {
      border: solid 1px color(primary);
    }

    &.disabled {
      border: solid 1px darken(color(disabled), 30%);
    }
  }

  .message {
    font-size: 11px;
    font-weight: 500;
  }

  &.success {
    padding-bottom: 0;

    input {
      border: solid 1px color(success);
    }

    .message {
      color: color(success);
    }
  }

  &.error {
    padding-bottom: 0;

    input {
      border: solid 1px color(error);
       -moz-outline-radius: 1
    }

    .message {
      color: color(error);
    }
  }
}
</style>
