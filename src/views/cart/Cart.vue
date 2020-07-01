<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>

    <!-- 商品的列表 -->
  <cart-list/>
    <!-- 底部汇总 -->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList"
import CartBottomBar from "./childComps/CartBottomBar"
import { mapGetters } from "vuex";
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    /*       cartLength(){
        return  this.$store.state.cartList.length
      } */
    //如果那我们cartLength地方比较多的情况下，你可以去封装一个getter方法，在很多地方就可以直接使用getter

    // cartLength() {
    //   return this.$store.getters.cartLength; //不过这依然不简洁  他想getters中的方法转成计算属性
    // }
    //必须指定哪些方法转为计算属性
    ...mapGetters(["cartLength", "cartList"])
    //...mapGetters({length(任意名字):'cartLength',list:'cartList'})  上面{{length}}就是对象写法可以改名
  }
};
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
