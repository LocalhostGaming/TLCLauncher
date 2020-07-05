<template>
  <div class="auth">
    <p class="title">{{currentPage}}</p>

    <lost-alert type="error" v-if="alert.error">{{alert.error}}</lost-alert>

    <div class="login" v-if="currentPage == 'SIGN IN'">
      <!-- Form -->
      <form @submit.prevent="submitLogin">
        <!-- Username -->
        <lost-input
          class="input"
          v-model="form.username"
          placeholder="Username"
          :disabled="onSubmit"
          :state="inputState.username">
        </lost-input>

        <!-- Password -->
        <lost-input
          class="input"
          v-model="form.password"
          placeholder="Password"
          password
          :disabled="onSubmit"
          :state="inputState.password">
        </lost-input>

        <!-- Remember Me -->
        <lost-checkbox
          v-if="true"
          v-model="form.remember"
          @check="form.remember = !form.remember"
          :disabled="onSubmit">
          Remember me
        </lost-checkbox>

        <!-- Submit Button -->
        <lost-button
          class="button primary"
          style="width: 100%"
          :disabled="onSubmit"
          :loading="onSubmit">
          SUBMIT
        </lost-button>
      </form>
    </div>

    <div
      class="forgot-password"
      v-if="currentPage == 'RESET PASSWORD' ||
            currentPage == 'RESET CODE' ||
            currentPage == 'NEW PASSWORD'   ||
            currentPage == 'RESET SUCCESS'">

      <div class="reset-success" v-if="currentPage == 'RESET SUCCESS'">
        <lost-alert class="alert" type="success">Successfully changed password.</lost-alert>
        <lost-button class="primary" @click="backToLogin">BACK TO LOGIN</lost-button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitResetPassword" v-if="currentPage != 'RESET SUCCESS'">
        <!-- Email -->
        <lost-input
          class="input"
          v-model="form.email"
          placeholder="Email"
          :disabled="onSubmit"
          :state="inputState.email"
          v-if="currentPage === 'RESET PASSWORD'">
        </lost-input>

        <div class="email" v-if="currentPage === 'RESET CODE'">
          Your reset code was sent to
          <p>{{resetPasswordEmail}}</p>
        </div>

        <!-- Resend Code Input -->
        <lost-input
          class="input"
          v-model="form.code"
          placeholder="Reset Code"
          :disabled="onSubmit"
          :state="inputState.code"
          v-if="currentPage === 'RESET CODE'">
        </lost-input>

        <!-- Resend Code Link/Timer -->
        <lost-link
          class="resend primary"
          v-if="currentPage === 'RESET CODE'"
          :disabled="resendTime != 0"
          @click="resendResetCode">
          Resend code <span v-if="resendTime != 0">in {{resendTime}}s</span>
        </lost-link>

        <!-- New Password Input -->
        <lost-input
          class="input"
          v-model="form.newPassword"
          placeholder="New Password"
          :disabled="onSubmit"
          :state="inputState.newPassword"
          v-if="currentPage === 'NEW PASSWORD'"
          password>
        </lost-input>
        <!-- Confirm New Password Input -->
        <lost-input
          class="input"
          v-model="form.confirmNewPassword"
          placeholder="Confirm New Password"
          :disabled="onSubmit"
          :state="inputState.confirmNewPassword"
          v-if="currentPage === 'NEW PASSWORD'"
          password>
        </lost-input>

        <!-- Submit Button -->
        <lost-button
          class="button primary"
          style="width: 100%"
          :disabled="onSubmit"
          :loading="onSubmit">
          SUBMIT
        </lost-button>
      </form>
    </div>

    <lost-link
      class="option"
      @click="changePage"
      :disabled="onSubmit"
      v-if="currentPage != 'RESET SUCCESS'">
      {{option}}
    </lost-link>

    <div class="register" v-if="currentPage === 'SIGN IN' || currentPage === 'RESET PASSWORD'">
      <p>To register an account please go to our website.</p>
      <p class="link">tlc.localhostgaming.com</p>
    </div>

  </div>
</template>

<script>
import auth from '@/utils/auth';
import password from '@/utils/password';

export default {
  data: () => ({
    currentPage: 'SIGN IN',
    form: {},
    inputState: {},
    alert: {
      error: '',
    },
    option: 'Forgot your password?',
    onSubmit: false,

    resetPasswordEmail: null,
    resendTime: 90,
    resendTimer: null,
  }),
  methods: {
    changePage() {
      if (this.currentPage === 'SIGN IN') {
        this.onResetPassword();
      } else {
        this.onLogin();
      }
    },

    onLogin() {
      this.currentPage = 'SIGN IN';
      this.option = 'Forgot your password?';
      clearInterval(this.timer);

      this.form = {
        username: '',
        password: '',
        remember: false,
      };

      this.inputState = {
        username: {},
        password: {},
      };
    },

    onResetPassword() {
      this.currentPage = 'RESET PASSWORD';
      this.option = 'Return to Login';
      clearInterval(this.timer);

      this.form = {
        email: '',
      };

      this.inputState = {
        email: {},
      };
    },

    onResetCode(email) {
      this.currentPage = 'RESET CODE';
      this.option = 'Return to Login';
      this.resetPasswordEmail = email;
      this.resendTime = 90;

      this.form = {
        code: '',
        email,
      };

      this.inputState = {
        code: {},
      };

      this.startResetCodeTimer();
    },

    onNewPassword(code, email) {
      this.currentPage = 'NEW PASSWORD';
      this.option = 'Return to Login';
      clearInterval(this.timer);

      this.form = {
        code,
        email,
        newPassword: '',
        confirmNewPassword: '',
      };

      this.inputState = {
        newPassword: {},
        confirmNewPassword: {},
      };
    },

    submitLogin() {
      this.onSubmit = true;
      this.clearAlerts();

      auth.login(this.form)
        .then(() => {
          this.$emit('loggedIn');
        })
        .catch((error) => {
          this.onSubmit = false;
          this.handleErrors(error.response.data);
        });
    },

    resendResetCode() {
      this.clearAlerts();

      const { email } = this.form;

      const data = {
        email,
      };

      password.request(data)
        .then(() => {
          this.onSubmit = false;
          this.resendTime = 90;
          this.startResetCodeTimer();
        })
        .catch((error) => {
          this.onSubmit = false;
          this.handleErrors(error.response.data);
        });
    },

    startResetCodeTimer() {
      this.timer = setInterval(() => {
        if (this.resendTime !== 0) {
          this.resendTime -= 1;
        }
      }, 1000);
    },

    submitResetPassword() {
      this.onSubmit = true;
      this.clearAlerts();

      if (this.currentPage === 'NEW PASSWORD') { // ON NEW PASSWORD
        const {
          newPassword,
          confirmNewPassword,
          code,
          email,
        } = this.form;

        // If Password input doesn't match
        if (newPassword !== confirmNewPassword) {
          this.onSubmit = false;
          this.inputState.confirmNewPassword = {
            type: 'error',
            message: 'Password do not match.',
          };
          return;
        }

        // if confirmPassword is Empty
        if (!newPassword) {
          this.onSubmit = false;
          this.inputState.confirmNewPassword = {
            type: 'error',
            message: 'confirmPassword is not allowed to be empty',
          };

          return;
        }

        const data = {
          code,
          email,
          newPassword,
        };

        password.reset(data)
          .then(() => {
            this.onSubmit = false;
            this.currentPage = 'RESET SUCCESS';
          })
          .catch((error) => {
            this.onSubmit = false;
            this.handleErrors(error.response.data);
          });
      } else if (this.currentPage === 'RESET CODE') { // ON RESET CODE
        const {
          code,
          email,
        } = this.form;

        password.code(this.form)
          .then((response) => {
            const { isCodeValid } = response.data;
            this.onSubmit = false;

            if (isCodeValid) {
              this.onNewPassword(code, email);
            } else {
              this.inputState.code = {
                type: 'error',
                message: 'Invalid Reset Code',
              };
            }
          })
          .catch((error) => {
            this.onSubmit = false;
            this.handleErrors(error.response.data);
          });
      } else { // ON REQUEST RESET PASSWORD
        const {
          email,
        } = this.form;

        password.request(this.form)
          .then(() => {
            this.onSubmit = false;
            this.onResetCode(email);
          })
          .catch((error) => {
            this.onSubmit = false;
            this.handleErrors(error.response.data);
          });
      }
    },

    backToLogin() {
      this.onLogin();
    },

    handleErrors(error) {
      if (error.details) {
        error.details.forEach((value) => {
          this.inputState[value.field] = {
            type: 'error',
            message: value.message,
          };
        });
      } else {
        this.alert.error = error.message;
      }
    },

    clearAlerts() {
      this.alert.error = '';
      this.inputState = {};
    },
  },
  mounted() {
    this.onLogin();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {
    currentPage() {
      this.clearAlerts();
    },
    resendTime(value) {
      if (value === 0) {
        clearInterval(this.timer);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
  width: 300px;
  margin: 0 auto;
  margin-top: 32px;
  text-align: left;

  .title {
    font-size: 16px;
    text-align: center;
    color: color(text);
    font-weight: 600;
    margin-bottom: 14px;
  }

  form {
    .button {
      margin-top: 18px;
    }
  }

  .forgot-password {

    .reset-success {
      padding-top: 12px;
      .alert {
        text-align: center;
      }
      button {
        margin-top: 8px;
        width: 100%;
      }
    }

    .resend {
      color: color(text);
      font-size: 13px;
      float: right;
      margin-right: 4px;
    }

    .email {
      padding: 10px 0;
      text-align: center;
      font-size: 13px;
      color: darken(color(text), 15%);

      p {
        color: color(text);
        font-size: 14px;
        font-weight: 500;
      }
    }
    .code {
      margin-bottom: 15px;
    }
  }

  .option {
    margin-top: 4px;
    text-align: center;
  }

  .register {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;

    p {
      color: color(text);
      margin: 0;
      line-height: 1.3;
    }

    .link {
      font-size: 14px;
      font-weight: 600;
      background-image: -webkit-linear-gradient(color(primary), color(primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
