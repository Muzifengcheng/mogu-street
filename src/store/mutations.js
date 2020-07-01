export default {

        //mutations唯一的目的就是修改state中的状态
        //mutations中的每一个方法尽可能完成的事件比较单一(不要做几件事写在一块)，所以重构一下罗
        addCounter(state, payload) {
            payload.count++
        },
        addToCart(state, payload) {
            payload.checked=true  //给商品添加选中属性
            state.cartList.push(payload)
        }
    
}