import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import SIdentify from './components/page/Identify';    //自定义组件
import "babel-polyfill";
import echarts from 'echarts';
import 'jquery'


Vue.prototype.$echarts = echarts

Vue.component("SIdentify",SIdentify);
Vue.use(ElementUI);
Vue.prototype.$message = Message;

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
Vue.prototype.$http = window.axios

import store from './store';

// 注册一个守卫
router.beforeEach((to, from, next) => {
    if(sessionStorage.getItem("ms_usernatme")){  //若用户登录信息为空，则进入登录页面
        next();
    } else {
        if(to.path === '/login'){
            next();
        } else {
            next({path: 'login',})
        }
    }
})

import 'font-awesome/css/font-awesome.css'
// Vue.use(axios);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
