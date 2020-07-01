import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'  /* 注意要先安装啊 npm i fastclick --save */
import VueLazyLoad from 'vue-lazyload'                                       /*npm install vue-lazyload --save */

import toast from 'components/common/toast'

Vue.config.productionTip = false
//添加事件总线对象
Vue.prototype.$bus=new Vue()
//安装toast插件
Vue.use(toast)

//解决移动端300ms的延迟
FastClick.attach(document.body)
//使用懒加载插件
Vue.use(VueLazyLoad,{
  loading: require('./assets/img/profile/15833212812605.png') /* 当图片没加载出来时，由它来占位显示 */
})
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
