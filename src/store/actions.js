export default {
    //异步操作，比较复杂的判断逻辑也放到actions这里
    addCart(context, payload) {
        return new Promise((resolve, reject) => {
            //payload新添加的商品
            // let oldProduct = null
            /*    方式一         for (let item of state.cartList) {
                            if (item.iid === payload.iid) {
                                oldProduct = item
                            }
            
                        } */
            /*方式二 查找之前的数组是否有该商品            let oldProduct = state.cartList.find(function(item){
                            return item.iid ===payload.iid
                        })    简写  item =>item.iid ===payload.iid */
            let oldProduct = context.state.cartList.find(function (item) {
                return item.iid === payload.iid
            })
            //2.判断oldProduct
            if (oldProduct) {//数量+1
                // oldProduct.count += 1  写到mutations是为了可追踪
                context.commit('addCounter', oldProduct)
                resolve('当前的商品数量+1')
            } else {//添加新商品
                payload.count = 1
                // state.cartList.push(payload)
                context.commit('addToCart', payload)
                resolve('添加了新的商品')
            }
        })
    }
}