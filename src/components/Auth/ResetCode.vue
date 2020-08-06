<template>
  <div class="reset-code-form">
    <div class="reset-code-form__email">
      Your reset code was sent to
      <p>{{ value.email }}</p>
    </div>

    <!-- Code -->
    <ValidationProvider name="code" rules="required" v-slot="{ errors }">
      <lost-textfield
        class="reset-code-form__code"
        solo
        label="CODE"
        v-model="value.code"
        :message="errors[0] || message.code"
        @focus="$emit('focus', 'code')"
        :disabled="loading">
      </lost-textfield>
    </ValidationProvider>
  </div>
</template>

<script>
import { lostTextfield } from '@/components/Global/';

export default {
  name: 'reset-code-form',
  props: {
    value: {
      type: Object,
    },
    message: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    'lost-textfield': lostTextfield,
  },
};
</script>

<style lang="scss" scoped>
.reset-code-form {
  &__email {
    margin-top: 20px;
    font-size: 10pt;
    color: color(disabled);
    p {
      color: color(text);
      font-weight: 600;
    }
  }

  &__code {
    margin: 10px 0;
  }
}
</style>
