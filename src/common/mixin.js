import {debounce} from "./utils"
export const itemListenerMixin={
    data(){
        return{
            itemImgListener:null,
            newRefresh:null,
            getThemeTopY:null
        }
    },
    mounted() {
        // let newRefresh = debounce(this.$refs.scroll.refresh, 100);
        // this.itemImgListener=() => {
        //   newRefresh()
        // }
        // this.$bus.$on("itemImageLoad", this.itemImgListener );
        //上面不用的方式，下面是用防抖的方式
        this.newRefresh = debounce(this.$refs.scroll.refresh, 100);
        this.itemImgListener=() => {
         this.newRefresh()
         this.getThemeTopY()
        }
        this.$bus.$on("itemImageLoad", this.itemImgListener );
        //  console.log('我是混入中的内容')
    },
}