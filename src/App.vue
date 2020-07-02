<template>
  <div id="app" v-if="enabled">

    <!-- Left Container -->
    <div class="container left">
      <!-- Username -->
      <transition name="fade">
        <div class="user" v-if="user">
          <lost-link class="signout error" @click="logout">SIGN OUT</lost-link>
        </div>
      </transition>

      <!-- Carousel -->
      <div class="slide" :style="`opacity: ${slideOpacity}`">
        <lost-carousel :images="images" :start="carousel"></lost-carousel>
      </div>

      <!-- Play Button -->
      <div class="play">
        <div class="wrapper" :style="`opacity: ${playOpacity};`" @click="connectToServer">
          <img src="@/assets/img/playbutton.svg" svg-inline alt="playbutton">
        </div>
        <div class="citizen" v-if="user" :style="`opacity: ${playOpacity};`">
          <p class="name"><span>as</span> {{user.citizen.firstName}} {{user.citizen.lastName}}</p>
        </div>
      </div>

      <div class="scrollable" :style="`bottom: ${bottom}%`">
        <!-- City Vector -->
        <img class="city" src="@/assets/img/city.svg" svg-inline alt="city">

        <!-- Login Form -->
        <div class="login">

          <!-- TLC Logo -->
          <div class="logo-wrapper">
            <img class="logo" src="@/assets/img/logo.svg" svg-inline alt="city">
          </div>

          <div class="loading-status" v-if="!auth">
            <div class="wrapper">
              <p>{{loadingStatus}}</p>
              <p class="username" v-if="user">{{user.username}}</p>
              <img src="@/assets/img/three-dots.svg" svg-inline alt="">
            </div>
          </div>

          <!-- Form -->
          <Auth v-if="auth" @loggedIn="login"></Auth>
        </div>
      </div>
    </div>

    <!-- Right Container -->
    <div class="container right">
      <!-- Title Bar Buttons -->
      <div class="title-bar-buttons">
        <!-- Minimize -->
        <div class="minimize" @click="minimizeWindow">
          <img src="@/assets/img/minimize.svg" svg-inline alt="minimize">
        </div>
        <!-- Close -->
        <div class="close" @click="closeWindow">
          <img src="@/assets/img/close.svg" svg-inline alt="close">
        </div>
      </div>

      <!-- Background Overlay -->
      <div class="bg-overlay">
        <img src="@/assets/img/text-bg.svg" svg-inline alt="">
      </div>

      <!-- Credits -->
      <p>Powered by <span>LOCALHOST GAMING</span></p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

import Auth from './components/Auth.vue';

export default {
  name: 'App',
  components: {
    Auth,
  },
  data: () => ({
    enabled: true,
    bottom: 0,
    slideOpacity: 0,
    playOpacity: 0,
    transitioning: false,
    images: [
      '@/assets/img/slide/slide1.svg',
    ],
    carousel: false,
    auth: false,
    loadingStatus: 'Loading',
    user: null,
    userToken: null,
  }),
  methods: {
    onAuth() {
      this.bottom = 0;
      this.slideOpacity = 0;
      this.playOpacity = 0;
      this.carousel = false;
      this.auth = true;
      this.user = null;
      this.userToken = null;
    },
    onPlay() {
      this.carousel = true;
      this.bottom = -64;
      this.slideOpacity = 1;

      setTimeout(() => {
        this.playOpacity = 1;
        this.auth = false;
      }, 700);
    },
    login() {
      this.checkUserToken()
        .then((response) => {
          this.user = response;

          this.loadingStatus = 'Welcome';
          this.auth = false;

          setTimeout(() => {
            this.onPlay();
          }, 2000);
        })
        .catch((error) => {
          const status = error.statusCode;

          if (status === 401) {
            this.onAuth();
          }
        });
    },
    logout() {
      window.removeToken('token.txt');
      this.onAuth();
    },
    checkUserToken() {
      const promise = new Promise((resolve, reject) => {
        window.readToken('token.txt')
          .then((token) => {
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            axios.get('https://dev-tlc-api.localhostgaming.com/api/users/me', config)
              .then((response) => {
                const res = response.data;

                resolve(res);
              })
              .catch((error) => {
                const err = error.response.data;

                reject(err);
              });
          })
          .catch(() => {
            this.onAuth();
          });
      });

      return promise;
    },
    connectToServer() {
      if (!this.user) {
        this.onAuth();
        return;
      }

      this.checkUserToken()
        .then(() => {
          window.location.href = 'fivem://connect/rp.localhostgaming.com';
          window.minimizeToTrayCurrentWindow();
        })
        .catch((error) => {
          const status = error.statusCode;

          if (status === 401) {
            this.onAuth();
          }
        });
    },
    minimizeWindow() {
      window.minimizeCurrentWindow();
      // this.read();
    },
    closeWindow() {
      window.closeCurrentWindow();
    },
    read() {
      window.readToken('token.txt')
        .then((res) => {
          console.log(res);
        });
    },
    write() {
      window.saveToken('token.txt', 'asd-tesssst')
        .then((res) => {
          console.log(res);
        });
    },
    register() {
      // const token = '';
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // };

      // const data = {
      //   username: 'blood',
      //   // email: 'davidperalta16@gmail.com',
      //   password: 'password',
      // };

      // const citizen = {
      //   citizen: {
      //     firstName: 'Primo',
      //     lastName: 'Shelby',
      //     dob: '1995-07-01',
      //     height: 160,
      //     gender: 'Male',
      //   },
      // };

      // axios.patch('https://dev-tlc-api.localhostgaming.com/api/users/me', citizen, config)
      //   .then((response) => {
      //     console.log(response);
      //   });
    },
  },
  mounted() {
    // this.register();
    this.login();
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Poppins';
  display: inline-flex;
  background: color(dark);
  border-radius: 8px;
  width: 100vw;
  height: 100vh;
  -webkit-app-region: drag;

  .container {
    width: size(containerWidth);
    height: size(containerHeight);

    &.left {
      position: relative;
      background: color(primary);
      margin: 12px 6px 12px 12px;
      overflow: hidden;
      border-radius: 6px 6px 0 0;
      -webkit-app-region: no-drag;

      .user {
        width: 100%;
        position: absolute;
        top: 6px;
        z-index: 1;
        font-size: 13px;

        .signout {
          color: color(text);
          font-size: 13px;
          font-weight: 600;
          position: absolute;
          right: 10px;

          span {
            &:hover {
              color: white !important;
            }
          }
        }
      }

      .slide {
        width: size(containerWidth);
        border-radius: 6px;
        position: absolute;
        transition: opacity 0.9s;

        img {
          width: size(containerWidth);
          transition: opacity 0.9s;
        }
      }

      .play {
        height: 80%;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        .wrapper {
          transition: opacity 0.5s ease-in-out, transform 0.2s;
          display: flex;
          cursor: pointer;

          &:hover {
            transform: scale(1.1, 1.1);
          }

          &:active {
            transform: scale(1.05, 1.05);
          }

          svg {
            z-index: 1;
            height: 46px;
            width: auto;
            outline: none;
          }
        }

        .citizen {
          display: block;
          z-index: 1;
          color: color(text);
          text-align: center;
          font-size: 16px;
          transition: opacity 0.5s ease-in-out;

          .name {
            font-weight: 700;

            span {
              font-weight: 500;
            }
          }
        }
      }

      .scrollable {
        position: absolute;
        transition: all 0.9s ease-in-out;

        .city {
          width: size(containerWidth);
          display: block;
          user-select: none;
        }

        .login {
          height: 521px;
          background: hsl(0%, 0%, 13%);
          text-align: center;

          .logo-wrapper{
            background: hsl(0%, 0%, 13%);
            width: 100%;
            text-align: center;
            padding-top: 18px;

            .logo {
              width: 300px;
            }
          }

          .loading-status {
            height: 50%;
            color: darken(color(text), 10%);
            display: flex;
            font-size: 13px;

            .wrapper {
              margin: 0 auto;
              align-self: center;

              .username {
                font-weight: 600;
                font-size: 18px;
              }

              svg {
                width: 35px
              }
            }
          }
        }
      }
    }

    &.right {
      position: relative;
      margin: 12px 12px 12px 6px;

      .title-bar-buttons {
        position: absolute;
        right: 0;
        top:  0;
        display: flex;
        border-radius: 0 6px 0 0;
        overflow: hidden;
        z-index: 1;
        -webkit-app-region: no-drag;

        div {
          position: relative;
          display: block;
          width: 36px;
          height: 24px;
          transition: background 0.2s;
          cursor: pointer;
        }

        .minimize {
          &:hover {
            background: lighten(color(dark-lighter), 10%);

            svg path {
              fill: color(light);
            }
          }

          svg {
            transition: all 0.5s;
            top: 65%;
            left: 54%;
            transform: translate(-50%, -50%);
            position: absolute;
            bottom: 0;
            width: 14px;
            height: 7px;
            outline: none;

            path {
              transition: all 0.2s;
            }
          }
        }

        .close {
          position: relative;

          &:hover {
            background: color(error);

            svg g {
              fill: color(light);
            }
          }

          svg {
            top: 58%;
            left: 52%;
            transform: translate(-50%, -50%);
            position: absolute;
            width: 14px;
            height: 14px;
            outline: none;

            g {
              transition: all 0.2s;
            }
          }
        }
      }

      .bg-overlay {
        svg {
          width: auto;
          height: 100%;
          outline: none;
          position: absolute;
        }
      }

      button {
        position: absolute;
        z-index: 1;
      }

      p {
        font-size: 12px;
        z-index: 1;
        position: absolute;
        bottom: 0;
        right: 5px;
        color: color(disabled);
        font-family: 'Poppins';

        span {
          font-size: 14px;
          font-family: 'Ubuntu';
          color: lighten(color(disabled), 20%);
          font-weight: 600;
        }
      }
    }
  }

  .fade-enter-active {
    transition: opacity .5s;
    transition-delay: 3s;
  }
  .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
