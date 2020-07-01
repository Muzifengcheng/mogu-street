import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
//1.安装插件
Vue.use(Vuex)

//2.创建Store对象
/* const state={
    cartList=[]
} */
const store = new Vuex.Store({
    state: {
        //    cartList:[商品1，商品2，商品3]  到时候push到数组中来，一个个商品都是对象
        cartList: []
    },
    mutations,
    actions,
    getters
})

//3.挂载到Vue实例上
export default store