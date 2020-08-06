<template>
  <div class="discord">
    <div class="discord__warning" v-if="!waiting">
      <h3>ALERT</h3>
      <p>You need to link your discord account first</p>
    </div>

    <div class="discord__message" v-if="waiting">
      <p>Waiting for discord authorization</p>
    </div>

    <lost-button
      class="discord__button"
      color="discord"
      @click="onLinkDiscordRequest"
      :loading="waiting"
      small>
      LINK DISCORD
      <div><img src="@/assets/images/discord.svg" svg-inline alt=""></div>
    </lost-button>

    <p class="discord__signout">
      <lost-link @click="$emit('signout')">
        SIGN OUT
      </lost-link>
    </p>

  </div>
</template>

<script>
/* eslint-disable */
import { remote, ipcRenderer } from 'electron';
/* eslint-enable */

import { lostButton, lostLink } from '@/components/Global/';

import { axios } from '@/utils/';

export default {
  name: 'discord',
  components: {
    'lost-button': lostButton,
    'lost-link': lostLink,
  },
  data: () => ({
    waiting: false,
  }),
  methods: {
    async onLinkDiscordRequest() {
      this.waiting = true;
      try {
        const { data } = await axios.get('/profile/integrations/discord/authorization-url?intent=launcher');
        const { url } = data;
        remote.shell.openExternal(url);
      } catch (error) {
        console.error(error.message);
      }
    },

    async checkDiscordAuth(url) {
      if (url !== null) {
        const { code, state } = this.getParams(url[0]);
        this.linkDiscordAccount(code, state);
      }
    },

    async linkDiscordAccount(code, state) {
      try {
        const payload = {
          code, state,
        };

        await axios.post('profile/integrations/discord', payload);

        this.$emit('success');
      } catch (error) {
        const { status } = error.response;
        if (status === 406) {
          this.$emit('success');
        }
        console.error(error.message);
      }
    },

    getParams(url) {
      const params = {};
      const parser = document.createElement('a');
      parser.href = url;
      const query = parser.search.substring(1);
      const vars = query.split('&');

      vars.forEach((variable) => {
        const arr = variable.split('=');
        const key = arr[0];
        const value = arr[1];

        params[key] = value;
      });

      return params;
    },
  },
  mounted() {
    ipcRenderer.on('protocol-params', (event, url) => {
      this.checkDiscordAuth(url);
    });
  },
};
</script>

<style lang="scss" scoped>
.discord {
  text-align: center;

  &__warning {
    color: color(text);
    font-size: 10pt;
    font-weight: 400;
    margin-bottom: 20px;
  }

  &__message {
    color: color(text);
    font-size: 10pt;
    font-weight: 400;
    margin-bottom: 20px;
  }

  &__button {
    margin: 0 auto;
    width: 320px;
    position: relative;
    display: inline-block;

    div {
      display: inline;
      position: relative;
      padding-left: 2px;
      padding-right: 6px;

      svg {
        position: absolute;
        width: 16px;
        fill: color(text) !important;
      }
    }
  }

  &__signout {
    font-weight: 600;
    color: color(disabled);
    margin-top: 50px;

    .lost-link {
      &:hover {
        color: color(error)
      }
    }
  }
}
</style>
