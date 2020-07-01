<template>
  <swiper>
    <!-- <swiper-item v-for="(item,index) in banners" :key="index"> 记得写key,否则warning-->

    <!-- <swiper-item :key="item-index" v-for="item in banners"> -->
    <swiper-item v-for="(item,index) in banners" :key="index">
      <a href="item.link">
        <img :src="item.image" alt @load="imageLoad" />
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";
export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isLoad: false
    };
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad() {
      if(!this.isLoad)
      this.$emit("swiperImageLoad");
      this.isLoad=true
    }
  }
};
</script>

<style scoped>
</style>