<template>
  <div id="app" class="app">

    <!-- MAIN CONTAINER -->
    <div class="container">

      <!-- LOGO -->
      <launcher-header class="app__header"></launcher-header>

      <!-- BODY -->
      <transition-group name="fade" tag="div" class="app__body">
        <!-- AUTH -->
        <launcher-auth
          key="auth"
          class="app__body__auth"
          v-if="launcherState === 'auth'"
          @success="checkUserSession('auth')">
        </launcher-auth>

        <!-- LOADING -->
        <launcher-loading
          key="loading"
          class="app__body__loading"
          v-if="launcherState === 'loading'"
          :message="loadingMessage">
        </launcher-loading>

        <launcher-citizen
          key="citizen"
          class="app__body__citizen"
          v-if="launcherState === 'citizen'"
          @signout="onSignout">
        </launcher-citizen>

        <!-- DISCORD -->
        <launcher-discord
          key="discord"
          class="app__body__discord"
          v-if="launcherState === 'discord'"
          @success="checkUserSession('discord')"
          @signout="onSignout">

        </launcher-discord>

        <!-- PLAY -->
        <launcher-play
          key="play"
          class="app__body__play"
          v-if="launcherState === 'play'"
          :user="user"
          @signout="onSignout">
        </launcher-play>
      </transition-group>

      <!-- FOOTER -->
      <launcher-footer
        :launcherState="launcherState"
        class="app__footer">
      </launcher-footer>

    </div>

  </div>
</template>

<script>
/* eslint-disable */
import { remote } from 'electron';
/* eslint-enable */

import Header from '@/components/Header.vue';
import Auth from '@/components/Auth/Main.vue';
import Loading from '@/components/Loading.vue';
import Discord from '@/components/Discord.vue';
import Citizen from '@/components/Citizen.vue';
import Play from '@/components/Play.vue';
import Footer from '@/components/Footer.vue';

import { axios, file } from '@/utils/';
import path from 'path';

export default {
  name: 'TLCLauncher',
  components: {
    'launcher-header': Header,
    'launcher-auth': Auth,
    'launcher-loading': Loading,
    'launcher-discord': Discord,
    'launcher-citizen': Citizen,
    'launcher-play': Play,
    'launcher-footer': Footer,
  },
  data: () => ({
    launcherState: 'loading',
    loadingMessage: 'PLEASE WAIT',
    discordData: {},
    user: null,
  }),
  methods: {
    async checkUserSession(from = null) {
      this.launcherState = 'loading';

      if (from === 'auth' || from === 'discord') {
        // this.loadingMessage = 'LOGGING IN';
      }

      try {
        // Check if there is existing token in temp folder
        await this.checkUserToken();

        this.loadingMessage = 'CHECKING YOUR DISCORD';

        // Check if player has a linked discord account
        const { discriminator } = await this.getPlayerDiscord();

        this.loadingMessage = 'CHECKING YOUR VISA';

        // Get player data
        const {
          role, username, citizenName, hasCitizen,
        } = await this.getPlayerData();

        if (!hasCitizen) {
          this.launcherState = 'citizen';
          return;
        }

        this.loadingMessage = 'LOGGING IN';

        const userData = {
          role,
          username,
          citizenName,
          discriminator,
        };

        this.user = userData;

        this.launcherState = 'play';
      } catch (error) {
        this.launcherState = 'auth';
        console.error(error);
      }
    },

    async getPlayerData() {
      try {
        const { data } = await axios.get('/users/me');
        const { username, hasCitizen } = data;
        const { firstName, lastName } = data.citizen;
        const role = await this.getPlayerRole();

        return {
          role,
          username,
          hasCitizen,
          citizenName: `${firstName} ${lastName}`,
        };
      } catch (error) {
        this.onSignout();
        throw new Error(error);
      }
    },

    async getPlayerRole() {
      try {
        const { data } = await axios.get('/player');
        const { role } = data;
        return role;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPlayerDiscord() {
      try {
        const { data } = await axios.get('/profile/integrations/discord');
        return data;
      } catch (error) {
        this.launcherState = 'discord';
        throw new Error(error);
      }
    },

    async checkUserToken() {
      try {
        // Check if authorized
        await axios.get('/users/me');
      } catch (error) {
        const tempPath = remote.app.getPath('temp');
        const filePath = path.join(tempPath, 'tlc.json');

        await file.remove(filePath);
        throw new Error(error);
      }
    },

    async onSignout() {
      try {
        this.launcherState = 'auth';

        const { status } = await axios.delete('/sessions/current');

        if (status === 202) {
          const tempPath = remote.app.getPath('temp');
          const filePath = path.join(tempPath, 'tlc.json');

          await file.remove(filePath);
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error.message);
      }
    },
  },
  created() {
    this.checkUserSession();
  },
};
</script>

<style lang="scss" scoped>
  .app {
    background-color: color(dark);

    .container {
      width: 100vw;
      height: 100vh;
    }

    &__header {
      -webkit-app-region: drag;
    }

    &__body {
      display: flex;

      &__auth {
        position: absolute;
        width: 320px;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &__loading {
        position: absolute;

        top: 48%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &__citizen {
        position: absolute;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &__discord {
        position: absolute;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &__play {
        position: absolute;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &__footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }
</style>
