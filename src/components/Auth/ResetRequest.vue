<template>
  <div class="reset-form">
    <!-- Email -->
    <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
      <lost-textfield
        class="reset-form__email"
        label="EMAIL"
        v-model="value.email"
        :message="errors[0] || message.email"
        @focus="$emit('focus', 'email')"
        :disabled="loading">
      </lost-textfield>
    </ValidationProvider>
  </div>
</template>

<script>
import {
  lostTextfield,
} from '@/components/Global/';

export default {
  name: 'reset-form',
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
.reset-form {
  &__email {
    margin: 10px 0;
  }
}
</style>
