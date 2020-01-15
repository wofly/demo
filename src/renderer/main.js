import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview';
import routes from './route';
import VueI18n from 'vue-i18n';
// import store from './store';
import filters from './utils/util';
// import db from './utils/db';
import logger from './utils/logger';
import 'iview/dist/styles/iview.css';
import './assets/less/common.less';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index';
import { app, BrowserWindow, ipcMain, Menu,screen,dialog  } from 'electron';
// 升级脚本
// import '../main/index';
import './utils/upgrade';
import axios from 'axios';
import qs from 'qs';


//=====================================数据库处理=====================================================
import path from 'path';
import { docDir } from './utils/settings';
import sq3 from "sqlite3";
// 将数据存至系统用户目录，防止用户误删程序
export const dbPath = path.join(docDir, 'data.sqlite3');
const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);
//==========================================================================================

Vue.use(VueI18n); // 使用国际化全局挂载
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(iView);

Vue.prototype.$db = db;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$logger = logger;
Object.keys(filters).forEach(k => Vue.filter(k, filters[ k ]));



// 查询设置信息
const SQL = `select * from sys_setting`;
db.get(SQL, (err, res) => {
    if (err) {

    } else {
        if(res){
            console.log(1111,res,store)
            store.commit('updateLanguage',['info_language',res.info_language])//用来控制获取到的数据中英文切换的，0为中文，1为英文
            store.commit('updateLanguage',['language',res.language])//用来控制本地的数据中英文切换的，0为中文，1为英文
            store.commit('updateLanguage',['showWithdraw',res.show_withdraw])//用来控制本地的数据是否展示过期组件，0为是，1为否
            store.commit('updateLanguage',['tax',res.tax])//增值税，
            store.commit('updateLanguage',['currency_type',res.currency_type])//货币种类0是人民币，1为美元
            if(store.state.language == 0){
                i18n.locale = "CH";
            } else if(store.state.language == 1){
                i18n.locale = "EN";
            }
        }
    }
})



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


// 根据电脑分辨率调整窗口
var devInnerWidth= 1920.0 // 开发时的InnerWidth
var scaleFactor = require('electron').screen.getPrimaryDisplay().scaleFactor;
var zoomFactor =  window.innerWidth/devInnerWidth;
require('electron').webFrame.setZoomFactor(zoomFactor);

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

/*登录账号 查看是否超过7添加，判断拦截重新登录*/
router.beforeEach((to,from,next)=> {

    let userName = JSON.parse(localStorage.getItem('user'));
    // 取local 值进行判断， 如果删除为空时，证明用户未登录
    if(userName){
        /* 判断 用户的token 是否存在 */
        if(userName.token != ''||userName.token != null || userName.token != undefined){

            /*有token的情况下 */
            let newDate = new Date();  // 用户当前的时间
            let date = userName.date; // 用户最后登录的时间

            newDate = new Date(newDate); // 用户当前的时间
            date = new Date(date); // 用户最后登录的时间

            let diff = Math.abs(newDate.getTime() - date.getTime()) // 用户当前时间 - 用户最后一次登录时间
            let result = parseInt(diff / (1000 * 60 * 60 * 24)); // 计算相减后 为几天
            /*如果 时间超过7天  让客户重新登录*/
            if(result>7){
                /*将用户信息清空*/
                let user = {
                    token:'',
                    date:'',
                    email:'',
                }

                localStorage.setItem('userId', 1); // 往local 存储
                store.commit('updateLanguage',['userId',1])  // 往VUEX里 存储
                localStorage.setItem('user', JSON.stringify(user)); // 往local 存储

                /*每次登录时  更新用户的token 和 时间*/
                const Other = `update us_user_info set token='',last_login_time=''  where email='${localStorage.email}'`

                Vue.prototype.$db.run(Other, (err, ress) => {
                    if (err) {
                        console.log('操作失败')
                    }else{
                        console.log('操作成功')
                        next({
                            path:'/'
                        });
                    }
                })
            }

            next();
        }else{
            next();
        }
    }
    next();
})
