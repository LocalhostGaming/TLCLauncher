<template>
  <div class="login__form">
    <!-- Username Textfield -->
    <ValidationProvider name="username" rules="required" v-slot="{ errors }">
      <lost-textfield
        class="login__form__username"
        label="USERNAME"
        v-model="value.username"
        :message="errors[0] || message.username"
        @focus="$emit('focus', 'username')"
        :disabled="loading">
      </lost-textfield>
    </ValidationProvider>

    <!-- Password Textfield -->
    <ValidationProvider name="password" rules="required|min:8" v-slot="{ errors }">
      <lost-textfield
        class="login__form__password"
        label="PASSWORD"
        password
        v-model="value.password"
        :message="errors[0] || message.password"
        @focus="$emit('focus', 'password')"
        :disabled="loading">
      </lost-textfield>
    </ValidationProvider>

    <!-- Remember Me Checkbox -->
    <lost-checkbox
      class="login__form__remember"
      label="Remember me"
      v-model="value.remember"
      :disabled="loading">
    </lost-checkbox>
  </div>
</template>

<script>
import {
  lostTextfield,
  lostCheckbox,
} from '@/components/Global/';

export default {
  name: 'login-form',
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
    'lost-checkbox': lostCheckbox,
  },
};
</script>

<style lang="scss" scoped>
.login__form {
  &__username {
    margin: 10px 0;
  }

  &__password {
    margin: 10px 0;
  }
}
</style>
