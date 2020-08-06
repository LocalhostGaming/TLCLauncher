<template>
  <div
    class="lost-checkbox-container"
    :class="{ disabled: disabled }"
    @click="change()"
    @mouseenter="onMouserEnter()"
    @mouseleave="onMouserLeave()"
    tabindex="0">
    <div
      class="lost-checkbox"
      :class="{ active: value }">
      <svg
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       v-if="value || hover">
        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
      </svg>
    </div>
    <p class="lost-checkbox-label">
      {{ label }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hover: false,
  }),
  methods: {
    change() {
      if (!this.disabled) {
        this.$emit('input', !this.value);
      }
    },
    onMouserEnter() {
      if (!this.disabled) {
        this.hover = true;
      }
    },
    onMouserLeave() {
      this.hover = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.lost-checkbox-container{
  display: inline-flex;
  color: color(text);
  cursor: pointer;
  outline: none;

  &:focus {
    .lost-checkbox {
      box-shadow: 0 0 0 1.5pt color(primary);
    }
  }

  &.disabled {
    cursor: default;
    .lost-checkbox {
      background: color(disabled) !important;
      box-shadow: none;

      svg {
        path {
          fill: color(dark-lighter) !important;
        }
      }
    }
    .lost-checkbox-label {
      color: color(disabled) !important;
    }
  }

  &:hover {
    .lost-checkbox {
      background: color(dark-light);
    }
  }

  .lost-checkbox {
    width: 16px;
    height: 16px;
    background: color(light);
    border-radius: 1.5pt;

    transition: box-shadow 0.2s;

    &.active {
      svg {
        path {
          fill: color(primary);
        }
      }
    }

    svg {
      transition: 0.2s;
      display: flex;
      margin: 2.5px auto;
      width: 12px;
      height: 12px;
      path {
        transition: 0.2s;
        fill: color(disabled);
      }
    }
  }

  .lost-checkbox-label {
    align-self: center;
    margin-left: 5pt;
    font-size: 10pt;
    font-weight: 500;

    line-height: 1;
  }
}

</style>
