<template>
  <div class="header">
    <div class="header__titlebar">
      <!-- Minimize -->
      <div class="minimize" @click="minimizeLauncher">
        <img src="@/assets/images/minimize.svg" svg-inline alt="minimize">
      </div>
      <!-- Close -->
      <div class="close" @click="closeLauncher">
        <img src="@/assets/images/close.svg" svg-inline alt="close">
      </div>
    </div>
    <!-- Logo Here -->
    <div class="header__logo__shadow"></div>
    <img class="header__logo" src="@/assets/images/logo.svg" svg-inline alt="">
  </div>
</template>

<script>
/* eslint-disable */
import { remote } from 'electron';
const currentWindow = remote.BrowserWindow.getFocusedWindow();
/* eslint-enable */

export default {
  name: 'Header',
  methods: {
    minimizeLauncher() {
      currentWindow.minimize();
    },
    closeLauncher() {
      currentWindow.destroy();
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  &__logo {
    margin: 30px;
    width: 300px;
    outline: none;
  }

  &__titlebar{
    -webkit-app-region: no-drag;
    position: absolute;
    right: 0;
    top:  0;
    display: flex;
    border-radius: 2px;
    overflow: hidden;
    z-index: 1;
    margin: 10px;

    div {
      position: relative;
      display: block;
      width: 48px;
      height: 28px;
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

}
</style>
