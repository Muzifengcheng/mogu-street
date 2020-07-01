<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="titles"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- <swiper-item v-for="(item,index) in banners" :key="index"> 记得写key,否则warning
      swiper代码被抽离，为了不在这里累赘-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="titles" @tabClick="tabClick" ref="tabControl2" />
      <!-- <good-list :goods="goods[currentType].list" />有点长，精简一下 -->
      <good-list :goods="showGoods" />
    </scroll>
    <!-- @click.native是可以监听点击的 -->
    <back-top @click.native="btnClick" v-show="isShowBackTop" />
    <!-- 然后组件是不能直接监听点击的，@click不可以写在这, -->
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodsList";

import { getHomeMultidata, getHomeGoods } from "network/home"; //为什么用大括号，因为没有default导出啊
import { debounce } from "../../common/utils";

import Scroll from "components/common/scroll/Scroll"; //不要在这里写better-scroll，封装到component中去，去耦合
import BackTop from "components/content/backTop/BackTop";
// import Swiper from "components/common/swiper/Swiper"
// import SwiperItem from "components/common/swiper/SwiperItem"
// import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "Home",
  components: {
    NavBar,
    //1记得注册组件swiper和swiperItem
    // Swiper,
    // SwiperItem
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  //既然你拿到了res(结果)，你要在这里保存起来啊
  data() {
    return {
      // result:null
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 543,
      isTabFixed: false, //默认情况下不需要吸顶
      saveY: 0,
      itemImagListener: null,//它可以混入到那里minin.js，删掉
      titles: ["流行", "新款", "精选"]
    };
  },
  created() {
    //组件一旦创建好，就发送网络请求
    //1.请求多个数据
    this.getHomeMultidata(); //这里又抽离了代码，写到下面去了
    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    //1图片加载完成的事件监听  //这里可以仿照Detail哪里一样用minin(混入)将相同代码删掉
    this.tabOffsetTop = this.$refs.tabControl;
    const refresh = debounce(this.$refs.scroll.refresh);
    //3.不要放在created中做，监听item中的图片加载完成
    //对监听的事件进行保存
    this.itemImagListener = () => {
      refresh();
      // if (this.$refs.scroll && this.$refs.scroll.refresh()) {
      //由于refresh调用频繁，所以
      // this.$refs.scroll.refresh(); //注意防抖/节流函数，每次都调用损耗服务器，尽量掉一次就行
      // refresh放在里已经都加载完了
      // }
    };
    this.$bus.$on("itemImageLoad", this.itemImagListener);
    //2获取tabControl的offsetTop
    //所有组件都有一个属性$el:用于获取组件的元素
    // this.tabOffsetTop=this.$refs.tabControl
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  destroyed() {
    console.log("home destroy");
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0); //X坐标，Y坐标，时间
    this.$refs.scroll.refresh();
  },
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    //2.取消我们全局的事件
    this.$bus.$off("itemImageLoad", this.itemImagListener); //一般两个参数
  },
  methods: {
    //事件监听相关的方法
    //防抖函数debounce,针对refresh
    debounce(func, delay) {
      let timer = null;
      return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
    btnClick() {
      // this.$refs.scroll.scroll.scrollTo(0,0,500)//拿到scroll组件对象并获取scroll（data属性),然后调方法
      this.$refs.scroll.scrollTo(0, 0);
    },
    contentScroll(position) {
      // console.log(position);
      //1判断backTop是否显示
      this.isShowBackTop = -position.y > 1000;

      //2决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      console.log("上拉加载更多");
      this.getHomeGoods(this.currentType);
      //   this.$refs.scroll.refresh  ()
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      //  console.log(this.$refs.tabControl.$el.offsetTop)
    },
    tabClick(index) {
      console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    //网络请求相关代码
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res);
        //  this.result=res//箭头函数没this，它会往上层作用域找，create中的this，就是当前组件的对象
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1; //0+1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        /*   res.data.list//想想怎么将后台数组的数据放到另一个数组里面
      //this.goods[type]=[...this.goods[type].list,...res.data.data.list]直接赋值会导致只有一页
      //以下老师的（home.js)
      const totalNums=[]*/
        //完成上拉加载更多，默认只加载依次，所以要finish才能多加载
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
/* scoped是限制于当前作用域 */
#home {
  /* padding-top: 44px; */
  padding-bottom: 49px;
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动，但我们用了bsscroll，就不用了 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
/* 吸顶效果没用了 */
/* .tab-control {
  position: sticky; /* 粘性定位，停在某个位置不动了 
  top: 44px;
  z-index: 9;
} */
.content {
  /* height: 300px;  */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/* .content{
  height: calc(100% - 93);/* 44px+49px=93  
  overflow: hidden;
  margin-top: 44px; 
} */
.tab-control {
  position: relative;
  z-index: 9;
}
</style>