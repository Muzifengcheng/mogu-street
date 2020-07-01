<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick" />
      <!-- check-button是组件不能直接监听，要加.native -->
      <span>全选</span>
    </div>
    <div class="price">合计: {{totalPrice}}</div>
    <div class="calculate" @click="calcClick">去计算({{checkLength}})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
import { mapGetters } from "vuex";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
    mapGetters
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return (
        "￥" +
        this.$store.state.cartList
          .filter(item => {
            return item.checked; //过滤，满足条件的东西取出来
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      //   return this.$store.state.cartList.filter(item => item.checked).length;
      //简短写法
      return this.cartList.filter(item => item.checked).length;
    },

    isSelectAll() {
      //使用高阶函数filter，也要 if(this.cartList.length===0) return false
      //return !(this.cartList.filter(item => !item.checked).length)//返回没有选中的数组长度，所以取反则全选中
      //使用高阶函数find
      if (this.cartList.length === 0) return false;
      return !this.cartList.find(item => !item.checked);
      // return !(this.cartList.length !=this.checkLength)
      //for循环也行,效率差
      /*       for(let item of this.cartList){
          if(!item.checked){
              return false
          }
      }
      return true */
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        //全部选中
        this.cartList.forEach(item => (item.checked = false));
      }else{//有部分或全部不选中时，点击则全勾上
        this.cartList.forEach(item => (item.checked = true));

      }
       // this.cartList.forEach(item => item.checked = this.isSelectAll);//这里不能写成这样，会互相影响

    },
    calcClick(){
      if(!this.isSelectAll){
        this.$toast.show("请选择购买的商品",2000)

      }
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;

  background-color: #eee;
  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 20px;
  flex: 1;
}
.calculate {
  width: 90px;
  text-align: center;
  background: red;
  color: #fff;
}
</style>