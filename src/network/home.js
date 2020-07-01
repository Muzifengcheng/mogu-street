import { request } from './request'

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}
//这里也封装一下，请求 流行，新款 ，精选 的数据
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    //?type=new&page=1用下面的传进来  123.207.32.32:8000/home/data?type=new&page=1
    params: {
      type,
      page
    }

  })
}

/* let totalNums = []
const nums1 = [20, 11, 222]  怎么把这个数组的东西塞到上面那个数组中？ 
const nums2=[111,22,333] */

// 方式一(一般)
// for(let n of nums1)
// {
//   totalNums.push(n)
// }

// totalNums.push(...nums1)会将nums1中的数据依次解析出来，交到totalNums中(...参数)...代表可输入多个参数