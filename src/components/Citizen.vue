<template>
  <div class="citizen">
    <div class="citizen__warning">
      <h3>ALERT</h3>
      <p>You need a Visa to enter the city.</p>
    </div>

    <lost-button
      class="citizen__button"
      color="primary"
      @click="applyVisa"
      small>
      APPLY NOW
    </lost-button>

    <p class="citizen__signout">
      <lost-link @click="$emit('signout')">
        SIGN OUT
      </lost-link>
    </p>

  </div>
</template>

<script>
/* eslint-disable */
import { remote } from 'electron';
/* eslint-enable */

import { lostButton, lostLink } from '@/components/Global/';

export default {
  name: 'citizen',
  components: {
    'lost-button': lostButton,
    'lost-link': lostLink,
  },
  data: () => ({
    waiting: false,
  }),
  methods: {
    applyVisa() {
      remote.shell.openExternal('https://tlc.localhostgaming.com/');
    },
  },
};
</script>

<style lang="scss" scoped>
.citizen {
  text-align: center;

  &__warning {
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
