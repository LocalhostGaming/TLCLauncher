<template>
  <div id="app" v-if="enabled">

    <div class="bg-overlay2" v-if="devBlogs">
      <img src="@/assets/img/text-bg2.svg" svg-inline alt="">
    </div>

    <!-- Left Container -->
    <div class="container left">
      <!-- Username -->
      <div class="user" v-if="!auth" :style="`opacity: ${playOpacity};`">
        <lost-link class="signout error" @click="logout">SIGN OUT</lost-link>
      </div>

      <!-- Carousel -->
      <div class="slide" :style="`opacity: ${slideOpacity}`">
        <lost-carousel :start="carousel"></lost-carousel>
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

          <transition-group name="fade">
            <div class="loading-status" v-if="!auth" key="1">
              <div class="wrapper">

                <!-- Discord Alert -->
                <div v-if="discord.alert">
                  <lost-alert  class="warning alert" title="WARNING">
                    {{discord.alert}}
                  </lost-alert>
                  <div class="alert-options">
                    <!-- Link to Discord Button -->
                    <lost-button
                    class="info small"
                    @click="linkDiscord"
                    :disabled="loading.logout">
                    LINK NOW
                    </lost-button>
                    <!-- Logout Button -->
                    <lost-button
                      class="error small"
                      @click="logout"
                      :loading="loading.logout">
                      SIGN OUT
                    </lost-button>
                  </div>
                </div>

                <!-- Welcome User -->
                <p v-if="!discord.alert || loading.discord">{{loadingStatus}}</p>
                <div v-if="!discord.alert">
                  <p class="username" v-if="user">{{user.username}}</p>
                </div>
                <img
                  v-if="!discord.alert || loading.discord"
                  src="@/assets/img/three-dots.svg"
                  svg-inline
                  alt="">
              </div>
            </div>

            <!-- Form -->
            <Auth v-if="auth" @loggedIn="checkUserSession" key="2"></Auth>
          </transition-group>
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
      <div class="bg-overlay" v-if="!devBlogs">
        <img src="@/assets/img/text-bg.svg" svg-inline alt="">
      </div>

      <Blogs @blogs="onDevBlogs"></Blogs>

      <!-- Credits -->
      <p>Powered by <span>LOCALHOST GAMING</span></p>
    </div>

  </div>
</template>

<script>
import user from '@/utils/user';
import discord from '@/utils/discord';
import fivem from '@/utils/fivem';

import Auth from './components/Auth.vue';
import Blogs from './components/Blogs.vue';

export default {
  name: 'App',
  components: {
    Auth,
    Blogs,
  },
  data: () => ({
    enabled: true,
    devBlogs: false,
    bottom: 0,
    slideOpacity: 0,
    playOpacity: 0,
    carousel: false,
    loadingStatus: 'Loading',
    user: null,
    auth: false,

    discord: {
      alert: null,
    },

    loading: {
      logout: false,
      discord: false,
    },

    listener: null,
    process: null,
  }),
  methods: {
    onAuth() {
      this.auth = true;
      this.bottom = 0;
      this.slideOpacity = 0;
      this.playOpacity = 0;
      this.carousel = false;

      setTimeout(() => {
        this.user = null;
      }, 500);
    },

    onPlay() {
      this.carousel = true;
      this.bottom = -67;
      this.slideOpacity = 1;

      setTimeout(() => {
        this.playOpacity = 1;
        this.auth = false;
      }, 700);
    },

    async checkUserSession() {
      await user.me()
        .then((response) => {
          // to show loading
          this.auth = false;

          // Check if there is discord account linked
          discord.me()
            .then(() => {
              this.user = response.data;
              this.loadingStatus = 'Welcome';

              setTimeout(() => {
                this.onPlay();
              }, 2000);
            })
            .catch((err) => {
              if (err.response.data.statusCode === 404) {
                this.discord.alert = 'You need to link your Discord Account first.';
              }
            });
        })
        .catch((error) => {
          const status = error.response.data.statusCode;
          if (status === 401) this.onAuth();
        });
    },

    connectToServer() {
      try {
        this.checkUserSession();
      } catch (e) {
        window.ERROR(e);
      }

      if (this.user) {
        user.play()
          .then(() => {
            fivem.connect();
            window.minimizeToTrayCurrentWindow();

            this.process = setInterval(() => {
              window.fivemProcess()
                .then((result) => {
                  if (result.length === 0) {
                    window.showCurrentWindow(this.process);
                  }
                });
            }, 1000);
          })
          .catch((error) => {
            window.ERROR(error);
          });
      }
    },

    linkDiscord() {
      this.loadingStatus = 'Waiting for Discord Authorization';
      this.discord.alert = false;
      this.loading.discord = true;

      discord.requestAuthorization()
        .then((response) => {
          const { url } = response.data;
          window.openExternalBrowser(url);
        })
        .catch((error) => {
          window.ERROR(error);
        });
    },

    async logout() {
      this.onAuth();
      this.loading.logout = true;
      this.loadingStatus = 'Loading';

      await user.logout()
        .then(() => {
          this.loading.logout = false;
        })
        .catch((error) => {
          window.ERROR(error);
          this.loading.logout = false;
        });
    },

    onDevBlogs(value) {
      this.devBlogs = value;
    },

    minimizeWindow() {
      window.minimizeCurrentWindow();
    },

    closeWindow() {
      window.closeCurrentWindow();
    },
  },
  mounted() {
    this.checkUserSession();

    const listener = window.addEventListener('discord', () => {
      this.loadingStatus = 'Logging in your Account';
      this.checkUserSession();
    });

    this.listener = listener;
  },
  destroyed() {
    window.removeEventListener('discord', this.listener, false);
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: font(primary);
  display: inline-flex;
  /* border-radius: 8px; */
  background: lighten(color(dark), 0.5%);
  background: color(dark);
  width: 100vw;
  height: 100vh;

  -webkit-app-region: drag;

  .bg-overlay2 {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    opacity: 0.4;

    svg {
      width: 120%;
      height: 105%;
      outline: none;
      position: absolute;
      margin-right: 50px;
    }
  }

  .container {
    width: size(containerWidth);
    height: size(containerHeight);

    &.left {
      position: relative;
      background: color(primary);
      margin: 12px 6px 12px 12px;
      overflow: hidden;
      border-radius: 2px 2px 0 0;
      -webkit-app-region: no-drag;

      .user {
        width: 100%;
        position: absolute;
        top: 6px;
        z-index: 1;
        font-size: 13px;
        transition: opacity 0.2s ease-in-out;

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
          transition: opacity 0.2s ease-in-out, transform 0.2s;
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
          transition: opacity 0.2s ease-in-out;

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
            font-size: 14px;

            .wrapper {
              margin: 0 auto;
              padding: 0 4em;
              align-self: center;

              .alert {
                text-align: left;
                width: 100%;
              }

              .alert-options {
                width: 100%;
                display: flex;
                justify-content: space-between;

                button {
                  width: 48.5%;

                  .info {
                    margin-right: 4px;
                  }
                  .error {
                    margin-left: 4px;
                  }
                }
              }

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
        background: color(dark-lighter);
        position: absolute;
        right: 0;
        top:  0;
        display: flex;
        border-radius: 2px;
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
            transition: all 0.2s;
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
        width: size(containerWidth);
        height: size(containerHeight);
        overflow: hidden;
        position: absolute;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        svg {
          width: auto;
          height: 100%;
          outline: none;
          position: absolute;
          // margin-left: 20px;
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

        span {
          font-size: 13px;
          font-family: 'Ubuntu';
          color: lighten(color(disabled), 20%);
          font-weight: 600;
        }
      }
    }
  }

  .fade-enter-active {
    transition: opacity .2s;
    transition-delay: 0.5s;
  }
  .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
