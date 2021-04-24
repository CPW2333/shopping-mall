import { request } from "../../request/request.js"
import { showToast} from "../../utils/asyncWx.js";

Page({

  data: {
    goodsObj:{},

    // 
    isCollected:false,
  },

  // 为预览大图构造的商品对象
  GoodsInfo:{},

  // 获取商品详情
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;

    // 获取缓存的商品收藏
    let collect = wx.getStorageSync("collect")||[];
    let isCollected = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      // 只要需要到的属性
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        /* iphone不识别webp图片 需要替换 最好找后台工程师改掉 */
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics,
      },
      isCollected,
    })
  },

  // 点击轮播图看大图 调用微信小程序api
  handlePreviewImage(e){
    // 1  构造预要览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2  接收传递过来自定义属性 url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current ,
      urls,
    });
      
  },

  // 点击加入购物车事件
  handleCartAdd() {
    // 获取缓存的购物车数组
    let cart= wx.getStorageSync("cart")||[];
    // 判断商品对象是否存在购物车数组
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index === -1){
      // 不存在 第一次添加 GoodsInfo多了一个属性 再加一个是否选中
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      // 把这两个属性加到购物车缓存数组当中
      cart.push(this.GoodsInfo);
    }else{
      // 存在 num++
      cart[index].num++;
    }

    // 购物车重新加到缓存
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '成功加入购物车！',
      icon: 'success',
      // 防止多次添加购物车
      mask: true
    });
      
  },

  // 收藏 + 商品详情页面
  onShow() {
    let pages =  getCurrentPages();
    let currentPages = pages[pages.length - 1];
    let options = currentPages.options;

    // options 是页面启动参数 就是goods_list标签设置的goods_id
    // const {goods_id} = options;
    this.getGoodsDetail(options.goods_id);

    
  },

  // 点击收藏
  handleCollect() {
    let isCollected = false;

    // 获取缓存收藏数组
    let collect = wx.getStorageSync("collect")||[];
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index != -1){
      // 取消收藏
      collect.splice(index, 1);
      isCollected = false;
      showToast({title:"取消成功！"},{icon:"success"});
    } else {
      // 添加收藏
      collect.push(this.GoodsInfo);
      isCollected = true;
      showToast({title:"收藏成功！"},{icon:"success"});
    }

    // 存入缓存
    wx.setStorageSync("collect", collect);

    // 修改属性
    this.setData({
      isCollected,
    })
      
  },

  // 点击立即购买
  handleItemTap() {
    showToast({title:"暂不支持立即购买，请先加入购物车！"},{icon:"none"})
  },
})