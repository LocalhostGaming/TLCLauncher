import Vue from 'vue';

import {
  ValidationObserver, ValidationProvider, extend, localize,
} from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import * as rules from 'vee-validate/dist/rules';

import App from './App.vue';

import './assets/scss/main.scss';

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

localize('en', en);

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
