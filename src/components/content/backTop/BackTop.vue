<template>
  <div class="back-top">
      <img src="~assets/img/common/top.png" alt="">
  </div>
</template>

<script>
export default {
name:"BackTop",
methods: {
    
/*   这样做麻烦，去直接Home监听backTop组件点击  btnClick(){
        console.log("回到顶部")//需要依赖better-scroll的滚动对象
        //也就是你BackTop的点击事件需要依赖Scroll中的代码
        this.$emit('btnClick')//将事件发出去，回到了HOme中backClick
    } */
},
}
</script>

<style scoped>
.back-top{
  position: fixed;
  right: 8px;
  bottom:55px;
}
.back-top img{
    width: 43px;
    height: 43px;
}
</style>