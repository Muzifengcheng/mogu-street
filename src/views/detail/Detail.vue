<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backTop" v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";
import { debounce } from "../../common/utils";
import { itemImgListener, itemListenerMixin } from "../../common/mixin";
import { mapActions } from "vuex";
import { BACKTOP_DISTANCE } from "../../common/const";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop
    //  Toast
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: null,
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [], //跳到各标题的高度,要用到各自offsetTop
      getThemeTopY: null, //继续防抖，处理跳转标题问题
      currentIndex: 0,
      isShowBackTop: false,
      itemImgListener: null
      // message: "",
      // show: false
    };
  },
  created() {
    // console.log(this.$route.params)
    //1.保存传入的iid
    this.iid = this.$route.params.iid;
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      //1.获取顶部的图片轮播数据

      const data = res.result;
      // console.log(data)
      this.topImages = data.itemInfo.topImages;

      //2.获取商品信息(服务器传过来的数据)
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //3.创建店铺信息对象
      this.shop = new Shop(data.shopInfo);
      //4.保存商品的详情数据
      this.detailInfo = data.detailInfo;
      //5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //6.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      //给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE); //放入一个最大值
        console.log(this.themeTopYs);
      }, 100);

      /*
      //它会其他组件绚烂完成再执行
      this.$nextTick(() => {
        //根据最新的数据，对应的DOM已经渲染出来了
        //但是图片依旧是为加载完的
        //offsetTop值不对的时候，都是图片的问题
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs);
      });*/
    });
    //3.请求推荐数据
    getRecommend().then(res => {
      console.log(res);
      this.recommends = res.data.list;
    });
  },
  mounted() {},

  destroyed() {
    this.$bus.$off("itemImgLoad", -this.itemImgListener);
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      // this.$refs.scroll.refresh();暂时这样写一下
      //这里不会执行的，之前我们用路由判断了图片加载完成，代替了防抖的功能

      this.newRefresh();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -(this.themeTopYs[index] - 44), 200); //200ms滚到那里
    },
    contentScroll(position) {
      //1.获取y值    (这里是内容滚动显示正确标题的做法  )
      const positionY = -position.y;
      //2.positionY和主题中值进行对比   [0, 9332, 10079, 10275,Number.MAX_VALUE]
      //positionY在0和9332-44之间，index=0

      //  for (let i in this.themeTopYs) {
      //   console.log(i + 1); //这里的i是字符串   str 3+1 =31  字符串+数字 ，字符串拼接了(特别注意)
      //i*1,或者强制转换成parseInt为数字或 for(let i=0;I<this.themeTopYs.length;i++)
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        //length-1那是我多加一个极大值，普通做法不需要
        //普通做法
        /*         if ( this.currentIndex !==i &&
          (i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY <= this.themeTopYs[i + 1]) ||
          (i === length - 1 && positionY > this.themeTopYs[i])
        ) {
          this.currentIndex=i
          // console.log(this.currentIndex)
          this.$refs.nav.currentIndex=this.currentIndex
        } */
        //hack做法
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY <= this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      //3.是否显示回到顶部
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE;
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    addToCart() {
      //1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;

      product.iid = this.iid; //商品的唯一标识，一定要有

      //2.将商品添加到购物车里面(1.Promise 2.mapActions的映射)
      //将信息放到一个全局的地方去(Vuex)，再到购物车组件(一定要有它行)哪里显示出来
      //  this.$store.cartList.push(product)不推荐这样做，用Mutation方法来做常见
      // this.$store.commit('addCart',product)  这是放mutations才这样写

      this.addCart(product).then(res => {
        console.log(this.$toast);
        this.$toast.show(res, 2000);
      });
  /*    this.$store.dispatch("addCart", product).then(res => {
        // this.show = true;
        // this.message = res;
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = "";
        // }, 1500);
        console.log(this.$toast);
        this.$toast.show(res, 2000);
      });*/
      //3.添加到购物车成功
    }
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #ffffff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
/* .content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
} */
.content {
  height: calc(100% - 44px - 49px); /*数字要有间距，否则无效果 */
  /* overflow: hidden; */
}
</style>