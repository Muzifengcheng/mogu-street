<template>
  <div id="tab-bar-item" @click="itemClick">
    <div class="item-icon" v-show="!isActive">
      <slot name="icon"></slot>
    </div>
    <div class="item-active-icon" v-show="isActive">
      <slot name="active-icon"></slot>
    </div>
    <div class="item-text" :style="activeStyle">
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    link: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive() {
      return this.$route.path.indexOf(this.link) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: "red" } : {};
    }
  },
  methods: {
    itemClick() {
      var sUserAgent = navigator.userAgent.toLowerCase()
      var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad'
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
      var bIsMidp = sUserAgent.match(/midp/i) == 'midp'
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
      var bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
      var bIsAndroid = sUserAgent.match(/android/i) == 'android'
      var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
      var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
      if (
        bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
      ) {
        alert('您是手机登录')
      } else {
        alert('您是电脑登录')
      }
      if (!this.isActive) this.$router.replace(this.link);
    }
  }
};
</script>

<style scoped>
#tab-bar-item {
  flex: 1;
}

.item-icon img,
.item-active-icon img {
  width: 24px;
  height: 24px;
  margin-top: 5px;
  vertical-align: middle;
}

.item-text {
  font-size: 12px;
  margin-top: 3px;
  color: #333;
}
</style>
