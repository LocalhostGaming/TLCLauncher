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
          v-model="form.rememberMe"
          @check="form.rememberMe = !form.rememberMe"
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

    <div class="forgot-password" v-if="currentPage == 'FORGOT PASSWORD'">
      <!-- Form -->
      <form @submit.prevent="submitForgotPassword">
        <!-- Email -->
        <lost-input
          class="input"
          v-model="form.email"
          placeholder="Email"
          :disabled="onSubmit">
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
      :disabled="onSubmit">
      {{option}}
    </lost-link>

    <div class="register">
      <p>To register an account please go to our website.</p>
      <p class="link">tlc.localhostgaming.com</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

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
  }),
  methods: {
    changePage() {
      if (this.currentPage === 'SIGN IN') {
        this.onForgotPassword();
      } else {
        this.onLogin();
      }
    },
    onLogin() {
      this.currentPage = 'SIGN IN';
      this.option = 'Forgot your password?';

      this.form = {
        username: '',
        password: '',
        rememberMe: false,
      };

      this.inputError = {
        username: '',
        password: '',
      };
    },
    onForgotPassword() {
      this.currentPage = 'FORGOT PASSWORD';
      this.option = 'Remember you password?';

      this.form = {
        email: '',
      };

      this.inputError = {
        email: '',
      };
    },
    submitLogin() {
      this.onSubmit = true;
      this.clearAlerts();

      const data = {
        username: this.form.username,
        password: this.form.password,
      };

      axios.post('https://dev-tlc-api.localhostgaming.com/api/sessions', data)
        .then((response) => {
          const userToken = response.data.token;

          window.saveToken('token.txt', userToken)
            .then(() => {
              this.$emit('loggedIn');
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          this.onSubmit = false;
          this.handleErrors(error.response.data);
          // this.alert.error = error.response.data.message;
        });
    },
    submitForgotPassword() {
      this.onSubmit = true;
      this.clearAlerts();
    },
    validateForm() {
      // const form = Object.keys(this.form);

      // form.map((key) => {

      //   console.log(key, obj[key]);

      // });
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
  watch: {
    currentPage() {
      this.clearAlerts();
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
