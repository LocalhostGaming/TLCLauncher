import Vue from 'vue';
import App from './App.vue';

// Sass
import '@/assets/scss/main.scss';

import '@/components/Global/index';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
