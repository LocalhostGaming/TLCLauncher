<template>
  <transition name="fade">
    <div class="play" v-if="user">
      <img
        class="background"
        src="@/assets/images/background.png"
        alt="">
      <div class="play__button__container">
        <div class="play__button">
          <!-- Play Button -->
          <img src="@/assets/images/playbutton.svg" svg-inline alt="" @click="play('citizen')">
          <!-- User Citizen -->
          <p class="play__button__citizen">
            <span>as</span>
            {{ user.citizenName }}
          </p>
        </div>
      </div>
      <div class="play__bottom">
        <p class="play__bottom__dev" v-if="user.role === 'ADMIN'">
          <lost-link @click="play('dev')">
            CONNECT ON LOCALHOST
          </lost-link>
        </p>
        <div class="play__bottom__user">
          <!-- Username -->
          <p class="play__bottom__user__username">{{ user.username }}</p>
          <!-- User Id -->
          <p class="play__bottom__user__discordId">#{{ user.discriminator }}</p>
        </div>
        <p class="play__bottom__signout">
          <lost-link @click="$emit('signout')">
            SIGN OUT
          </lost-link>
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
import { remote } from 'electron';
/* eslint-enable */

import { axios } from '@/utils/';
import { lostLink } from '@/components/Global/';

const currentWindow = remote.BrowserWindow.getFocusedWindow();

export default {
  name: 'play',
  components: {
    'lost-link': lostLink,
  },
  props: {
    user: {
      type: Object,
    },
  },
  methods: {
    async play(role) {
      // Authenticate first
      try {
        await axios.post('/sessions/play/token');

        if (role === 'dev') {
          window.location.href = 'fivem://connect/localhost';
        } else {
          window.location.href = `fivem://connect/${process.env.VUE_APP_FIVEM_SERVER}`;
        }

        currentWindow.minimize();
      } catch (error) {
        const { status } = error.response;
        if (status === 401) {
          this.$emit('signout');
        }
        console.error(error.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.play {
  width: 100%;
  height: 430px;
  position: relative;
  overflow: hidden;

  .background {
    position: absolute;
    z-index: -1;
    height: 100%;
    animation: slide 40s linear 0s alternate infinite none running;

    svg {
      height: 100%;
    }
  }

  @keyframes slide {
    0% {
      transform: translateX(-33%);
    }
    100% {
      transform: translate(0%);
    }
  }

  &__button {
    color: color(text);

    &__container {
      height: 90%;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;

      text-align: center;

    }

    svg {
      width: 300px;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1, 1.1);
      }

      &:active {
        transform: scale(1.05, 1.05);
      }
    }

    span {
      font-weight: 500;
      color: color(text);
    }

    &__citizen {
      font-size: 14pt;
      font-weight: 700;
      color: color(primary);
    }
  }

  &__bottom {
    position: absolute;
    bottom: 0;
    width: 100%;

    display: flex;

    padding: 20px 30px;

    &__dev {
      position: absolute;
      left: 50%;
      top: 48%;
      transform: translate(-50%, -50%);

      .lost-link {
        font-size: 8pt;
      }
    }

    &__user {
      font-weight:  600;
      color: color(text);

      line-height: 1.3;
      font-size: 12pt;

      &__discordId {
        font-size: 10pt;
        font-weight: 500;
        color: color(disabled);
        line-height: 1.3;
      }
    }

    &__signout {
      font-weight: 600;
      color: color(disabled);
      margin-left: auto;
      align-self: center;

      .lost-link {
        font-size: 10pt;
        &:hover {
          color: color(error)
        }
      }
    }
  }

}
</style>
