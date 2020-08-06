<template>
  <div class="change-password-form">

    <!-- New Password -->
    <ValidationProvider vid="npass" name="new password" rules="required|min:8" v-slot="{ errors }">
      <lost-textfield
        class="change-password-form__new-password"
        password
        label="NEW PASSWORD"
        v-model="value.newPassword"
        :message="errors[0] || message.newPassword"
        @focus="$emit('focus', 'newPassword')"
        :disabled="loading">
      </lost-textfield>
    </ValidationProvider>

    <!-- Confirm New Password -->
    <ValidationProvider
      vid="cnpass"
      name="confirm password"
      rules="required|confirmedBy:@npass|min:8"
      v-slot="{ errors }">
      <lost-textfield
        class="change-password-form__confirm-new-password"
        password
        label="CONFIRM PASSWORD"
        v-model="value.confirmNewPassword"
        :message="errors[0] || message.confirmNewPassword"
        @focus="$emit('focus', 'confirmNewPassword')"
        :disabled="loading">
      </lost-textfield>
    </ValidationProvider>
  </div>
</template>

<script>
import { extend } from 'vee-validate';
import { lostTextfield } from '@/components/Global/';

extend('confirmedBy', {
  params: ['target'],
  // Target here is the value of the target field
  validate(value, { target }) {
    return value === target;
  },
  // here it is its name, because we are generating a message
  message: 'The {_field_} does not match the {target}',
});

export default {
  name: 'change-password-form',
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

<style lang="scss">
.change-password-form {

  &__new-password {
    margin: 10px 0;
  }

  &__confirm-new-password {
    margin: 10px 0;
  }
}
</style>
