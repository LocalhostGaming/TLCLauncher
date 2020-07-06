<template>
  <ul class="carousel">
    <li v-for="(image, index) in images" :key="index">
      <img
        :class="active === index ? 'active' : ' '"
        :src="require(`@/assets/img/slide/slide${image}.jpg`)"
        :alt="`slide${image}`">
    </li>
  </ul>
</template>

<script>
export default {
  name: 'carousel',
  props: {
    start: {
      type: Boolean,
    },
  },
  data: () => ({
    timer: null,
    active: -1,
    images: [1, 2, 3, 4, 5, 6],
  }),
  methods: {
    startCarousel() {
      const rand = Math.floor(Math.random() * this.images.length);
      this.active = rand;

      this.timer = setInterval(() => {
        if (this.active === this.images.length - 1) {
          this.active = 0;
        }
        this.active += 1;
      }, 6000);
    },
    stopCarousel() {
      clearTimeout(this.timer);
      this.timer = null;
    },
  },
  watch: {
    start() {
      if (this.start) {
        this.startCarousel();
      } else {
        this.stopCarousel();
      }
    },
  },
  mounted() {
    if (this.start) {
      this.startCarousel();
    } else {
      this.stopCarousel();
    }
  },
};
</script>

<style lang="scss" scoped>
ul, li {
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    opacity: 0;
    transition: opacity 2s;
    -webkit-user-drag: none;

    &.active {
      opacity: 1;
    }
  }
}
</style>
