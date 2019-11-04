import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview';
import routes from './route';
import VueI18n from 'vue-i18n';
// import store from './store';
import filters from './utils/util';
import db from './utils/db';
import logger from './utils/logger';
import 'iview/dist/styles/iview.css';
import './assets/less/common.less';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index';
// 升级脚本
import './utils/upgrade';

import axios from 'axios';
import qs from 'qs';
Vue.use(VueI18n); // 使用国际化全局挂载
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(iView);
Object.keys(filters).forEach(k => Vue.filter(k, filters[ k ]));

const i18n = new VueI18n({
    locale:'CH',
    messages: {
        'CH': require('./Language/CH.json'),
        'EN': require('./Language/EN.json')
    }
})
Vue.config.productionTip = false;

const router = new VueRouter({
  routes,
});

Vue.prototype.$db = db;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$logger = logger;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App),
});
