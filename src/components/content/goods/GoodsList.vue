<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :key="item.index" :goods-item="item" />
  </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";

export default {
  name: "GoodsList",
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;/* 默认情况下不包裹nowrap，所有的东西都会一行塞.而wrap会根据宽度一行到底显示多少个 */
    justify-content: space-around; /* 这里是均等分排列 space-evenly也可以将间隙均等分 */

    padding: 2px;/*老师微调了一下*/
  } 
</style>
