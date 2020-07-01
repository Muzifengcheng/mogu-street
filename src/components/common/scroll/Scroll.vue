<template>
  <!-- ref->常用于绑定子组件 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
      <!-- 到时候这里插槽会被替换 -->
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    pullUpLoad: {
      type: Boolean, //这样写是因为不是所有页面都需要上拉加载更多
      default: false
    }
  },
  data() {
    return {
      scroll: {}
    };
  },
  mounted() {
    // setTimeout(this.__initScroll, 20);
    //建议用ref
    // this.scroll=new BScroll(document.querySelector('.wrapper'),{})//尽量少用queryselector拿dom元素,不准确，指不定拿到哪个
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    });

    //2.监听滚动位置(scroll向外发出了一个事件，任意组件都可接受)
    if (this.probeType == 2 || this.probeType == 3) {
      this.scroll.on("scroll", position => {
        // console.log(position)
        this.$emit("scroll", position);
      });
    }

    console.log(this.scroll);
    // this.scroll.refresh()

    //3.监听上拉事件(监听scroll滚动到底部)
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        //监听到滚动到底部

        this.$emit("pullingUp"); /* 传出去让首页去做上拉加载更多 */
      });
    }
  },
  methods: {
    __initScroll() {
      // 1.初始化BScroll对象
      if (!this.$refs.wrapper) return;
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        pullUpLoad: this.pullUpLoad
      });

      // 2.将监听事件回调
      this.scroll.on("scroll", pos => {
        this.$emit("scroll", pos);
      });

      // 3.监听上拉到底部
      this.scroll.on("pullingUp", () => {
        console.log("上拉加载");
        this.$emit("pullingUp");
      });
    },
    refresh() {
       console.log("------刷新次数");
      this.scroll && this.scroll.refresh && this.scroll.refresh(); //逻辑与，严谨写法，对象一定要存在，
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    },
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    }
  },
  watch: {
    data() {
      setTimeout(this.refresh, 20);
    }
  }
};
</script>

<style scoped>
</style>
