import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import echarts from 'echarts';

Vue.use(ElementUI);

Vue.prototype.$echarts = echarts;

import axios from 'axios'
//axios.defaults.baseURL = 'http://47.101.58.129:8282/api/';
axios.defaults.baseURL = 'http://127.0.0.1:8282/api/';
// 在request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 必须返回config
  return config
});
// 在response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  return config
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;





new Vue({
  router,
  render: h => h(App),
}).$mount('#app');


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if (localStorage.getItem('ms_username')) { //判断是否登陆
      next();
    } else {
      ElementUI.MessageBox(
        "请先登录后再进行操作",
        "提示", {
          confirmButtonText: "确定",
          callback: () => {
            localStorage.clear();
          }
        }
      );
      next('/login')
    }
  } else {
    next();
  }
});
