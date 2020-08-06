<template>
  <div class="auth">
    <ValidationObserver v-slot="{ handleSubmit }">
      <!-- Form -->
      <form class="auth__form" @submit.prevent="handleSubmit(onSubmit)">
        <h3 class="auth__form__title">{{ form.title }}</h3>

        <div class="auth__form__alert" v-if="formAlert.message">
          <p class="auth__form__alert__message" :class="[ formAlert.type ]">
            {{ formAlert.message }}
          </p>
        </div>

        <!-- Login -->
        <login
          v-model="form.data"
          v-if="form.type === 0"
          :message="form.message"
          @focus="onTextfieldFocus"
          :loading="form.loading">
        </login>

        <!-- Reset Password -->
        <reset-request
          v-model="form.data"
          v-if="form.type === 1"
          :message="form.message"
          @focus="onTextfieldFocus"
          :loading="form.loading">
        </reset-request>

        <!-- Reset  Code -->
        <reset-code
          v-model="form.data"
          v-if="form.type === 2"
          :message="form.message"
          @focus="onTextfieldFocus"
          :loading="form.loading">
        </reset-code>

        <!-- Change Password-->
        <change-password
          v-model="form.data"
          v-if="form.type === 3"
          :message="form.message"
          @focus="onTextfieldFocus"
          :loading="form.loading">
        </change-password>

        <!-- Form Button -->
        <lost-button
          class="auth__form__button"
          :loading="form.loading">
          {{ form.button }}
        </lost-button>
        <p class="auth__form__reset">
          <lost-link
            @click="changeForm(form.link.type)"
            v-if="form.link"
            :disabled="form.loading">
            {{ form.link.message }}
          </lost-link>
        </p>

        <!-- Registration Link -->
        <p class="auth__form__link">
          Don't have an TLC account?
          <lost-link
            class="link"
            :disabled="form.loading"
            @click="signUp">
            Sign Up
          </lost-link>
        </p>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
/* eslint-disable */
import { remote } from 'electron';
/* eslint-enable */

import Login from '@/components/Auth/Login.vue';
import ResetRequest from '@/components/Auth/ResetRequest.vue';
import ResetCode from '@/components/Auth/ResetCode.vue';
import ChangePassword from '@/components/Auth/ChangePassword.vue';

import { lostButton, lostLink } from '@/components/Global/';

import { axios, file } from '@/utils/';
import path from 'path';

export default {
  name: 'Auth',
  components: {
    login: Login,
    'reset-request': ResetRequest,
    'reset-code': ResetCode,
    'change-password': ChangePassword,
    'lost-button': lostButton,
    'lost-link': lostLink,
  },
  data: () => ({
    form: {},
    formAlert: {},
  }),
  methods: {
    changeForm(formType, ...args) {
      this.clearAlerts();

      switch (formType) {
        case 1:
          this.onResetPasswordRequest();
          break;
        case 2:
          this.onResetPasswordCode(args[0]);
          break;
        case 3:
          this.onChangePassword(args[0], args[1]);
          break;
        default:
          this.onLogin();
          break;
      }
    },

    onSubmit() {
      this.clearAlerts();
      this.form.loading = true;

      const { type } = this.form;

      switch (type) {
        case 1:
          this.onSubmitResetPasswordRequest();
          break;
        case 2:
          this.onSubmitResetPasswordCode();
          break;
        case 3:
          this.onSubmitChangePassword();
          break;
        default:
          this.onSubmitLogin();
          break;
      }
    },

    onLogin() {
      this.form = {
        type: 0,
        title: 'SIGN IN',
        button: 'PROCEED',
        link: {
          type: 1,
          message: 'Forgot your passsword?',
        },
        data: {
          username: null,
          password: null,
          remember: false,
        },
        message: {
          username: {},
          password: {},
        },
        loading: false,
      };
    },

    onResetPasswordRequest() {
      this.form = {
        type: 1,
        title: 'RESET PASSWORD',
        button: 'SUBMIT',
        link: {
          type: 0,
          message: 'Return to login',
        },
        data: {
          email: null,
        },
        message: {
          email: {},
        },
        loading: false,
      };
    },

    onResetPasswordCode(email) {
      this.form = {
        type: 2,
        title: 'RESET PASSWORD CODE',
        button: 'SUBMIT',
        link: {
          type: 0,
          message: 'Return to login',
        },
        data: {
          email,
          code: null,
        },
        message: {
          code: {},
        },
        loading: false,
      };
    },

    onChangePassword(email, code) {
      this.form = {
        type: 3,
        title: 'CHANGE PASSWORD',
        button: 'SUBMIT',
        link: {
          type: 0,
          message: 'Return to login',
        },
        data: {
          email,
          code,
          newPassword: null,
          confirmNewPassword: null,
        },
        message: {
          newPassword: {},
          confirmNewPassword: {},
        },
        loading: false,
      };
    },

    async onSubmitLogin() {
      try {
        const { data } = await axios.post('/sessions', this.form.data);

        this.form.loading = false;

        const tempPath = remote.app.getPath('temp');
        const filePath = path.join(tempPath, 'tlc.json');

        file.write(filePath, data);

        this.$emit('success');
      } catch (error) {
        this.form.loading = false;
        const { data } = error.response;
        this.handleErrors(data);
      }
    },

    async onSubmitResetPasswordRequest() {
      try {
        const { data } = this.form;
        const { email } = this.form.data;

        if (!email) {
          this.form.message.email = {
            type: 'error',
            message: 'Email is required',
          };
          this.form.loading = false;
          return;
        }

        await axios.post('/users/password-resets', data);

        this.changeForm(2, email);
      } catch (error) {
        this.form.loading = false;

        if (error.response) {
          const { data } = error.response;
          this.handleErrors(data);
        }
      }
    },

    async onSubmitResetPasswordCode() {
      try {
        const { data } = this.form;
        const { email, code } = data;

        const response = await axios.post('/users/password-resets/code', data);

        if (!response.data.isCodeValid) {
          let err = new Error();
          err = {
            response: {
              data: {
                details: [
                  {
                    field: 'code',
                    message: 'Invalid reset code',
                  },
                ],
              },
            },
          };

          throw err;
        }

        this.changeForm(3, email, code);
      } catch (error) {
        this.form.loading = false;
        const { data } = error.response;
        this.handleErrors(data);
      }
    },

    async onSubmitChangePassword() {
      try {
        const { data } = this.form;
        const { code, email, newPassword } = data;

        const payload = {
          code,
          email,
          newPassword,
        };

        await axios.patch('/users/password', payload);

        this.changeForm(0);

        this.formAlert = {
          type: 'success',
          message: 'Successfully changed your password.',
        };
      } catch (error) {
        this.form.loading = false;
        const { data } = error.response;
        this.handleErrors(data);
      }
    },

    signUp() {
      remote.shell.openExternal('https://tlc.localhostgaming.com/');
    },

    onTextfieldFocus(field) {
      const { message } = this.form;
      this.formAlert = {};

      if (field in message) {
        message[field] = {};
      }
    },

    clearAlerts() {
      const { message } = this.form;
      Object.keys(message).forEach((key) => {
        message[key] = {};
      });

      this.formAlert = {};
    },

    handleErrors(error) {
      if (error.details) {
        error.details.forEach((value) => {
          this.form.message[value.field] = {
            type: 'error',
            message: value.message,
          };
        });
      } else {
        this.formAlert = {
          type: 'error',
          message: error.message,
        };
      }
    },
  },
  mounted() {
    this.onLogin();
  },
};
</script>

<style lang="scss" scoped>
.auth {
  &__form {

    &__title {
      color: color(text);
      line-height: 1;
    }

    &__alert {
      padding-top: 5pt;

      &__message {
        text-align: left;
        font-size: 10pt;
        font-weight: 600;

        &.error {
          color: color(error);
        }

        &.success {
          color: color(success);
        }

        &.warning {
          color: color(warning);
        }

        &.info {
          color: color(info);
        }

      }

    }

    &__button{
      margin-top: 20px;
      // color: color(text);
    }

    &__reset {
      margin-top: 5px;
      text-align: center;
    }

    &__link {
      cursor: default;
      margin-top: 50px;
      text-align: center;
      color: lighten(color(dark-lighter), 50%);
      font-size: 10pt;

      .link {
        display: inline-block;
        font-weight: 600;
      }
    }
  }
}
</style>
