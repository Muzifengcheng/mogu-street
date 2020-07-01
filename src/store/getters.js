export default{
    cartLength(state)
    {
        return state.cartList.length
    },
    cartList(state){
        return state.cartList
    }//这两个方法如何转入Cart.vue中计算属性呢？  import {mapGetters}

}