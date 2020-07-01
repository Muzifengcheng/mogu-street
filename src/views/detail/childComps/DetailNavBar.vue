<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div
          v-for="(item,index) in titles"
          :key="index"
          class="title-item"
          :class="{active:index==currentIndex}"
          @click="titleClick(index)"
        >{{item}}</div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "common/navbar/NavBar";

export default {
  name: "DetailNavBar",
  components: {
    NavBar
  },
  data() {
    return {
      titles: ["商品", "参数", "评论", "推荐"],
      currentIndex: 0
    };
  },
  props: {
    // titleInfos: {
    //   type: Array,
    //   default: () => {
    //     return ['商品', '参数', '评论', '推荐']
    //   }
    // },
    // currentIndex: {
    //   type: Number,
    //   default: 0
    // }
  },
  methods: {
    titleClick(index){
      this.currentIndex=index
      this.$emit('titleClick',index)

    },
    backClick(){
      this.$router.back()//go(-1)也可以
    }
  }
};
</script>

<style scoped>
.title {
  display: flex;
  padding: 0 20px;
  font-size: 14px;
}

.title-item {
  flex: 1;
}
.title-item.active {
  color: var(--color-high-text);
}
  .back {
    margin-top: 10px;
  }

/* .detail-nav {
    background-color: #fff;
    font-weight: normal;
  }




 */
</style>
