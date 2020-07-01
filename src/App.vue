<template>
  <div id="app"> 
    <keep-alive exclude="Detail">
    <router-view></router-view>
    
    </keep-alive>
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from "components/content/mainTabbar/MainTabBar";
export default {
  name: "App",
  components: {
    MainTabBar
  }
};
</script>

<style>
/* @是在style里面引用样式 */
@import "assets/css/base.css";
</style>
