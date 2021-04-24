import { requestPayment ,showToast } from "../../utils/asyncWx.js";

import {request} from "../../request/request.js"


/* 
  1 页面加载 
      从缓存获取购物车数据
      checked=true
  2 微信支付 
      跳转授权数据 获取token 才能完成后续步骤
      token 企业号才能实现 唯一凭证
      创建订单
 */

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  onShow() {
    // 获取缓存地址
    const address = wx.getStorageSync("address");

    // 获取缓存的购物车数据
    // 用let 后面可以直接赋值
    let cart = wx.getStorageSync("cart") || [];

    // 计算全选  此方法要每一个都为true 才返回true ,空数组返回值为true
    // const allChecked = cart.length ? cart.every(v=>v.checked):false;

    // 过滤后的 购物车数组
    // let checkedCart = cart.filter(v => v.checked);
    cart = cart.filter(v => v.checked);

    this.setData({
      address
    });

    // 数量编辑
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {

      totalPrice += v.num * v.goods_price;
      totalNum += v.num;

    })

    // 重新设置data
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    });

  },

  // 点击支付
  async handleOrderPay() {
    try {
      // 判断缓存有无token
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth',
          success: (result) => {
          }
        });
        return;
      }

      // 设置请求头
      // const header = { Authorization:token };
      // 设置请求体
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price,
      }))
      const orderParams = { order_price, consignee_addr ,goods};

      // 发送请求获取订单编号
      const { order_number } = await request({url:"/my/orders/create", method:"post",data:orderParams});

      // 构造预支付参数
      const { pay } = await request({url:"/my/orders/req_unifiedorder", method:"post", data:{ order_number }})
      
      try {
        // 调用支付接口api 发起支付
        await requestPayment(pay);
      } catch (error) {
        console.log(error);
      }

      // 查询后台订单支付状态是否成功
      await request({url:"/my/orders/chkOrder", method:"post", data:{ order_number }});

      await showToast({title:"支付成功！"},{icon:"success"});

      //  删除缓存已支付商品 
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);

      wx.navigateTo({
        url: '/pages/order/order?type=1',
        success: (result) => {
          
        },
        fail: () => {},
        complete: () => {}
      });
    } catch (error) {
      await showToast({title:"支付失败！"},{icon:"none"});
      console.log(error);
    }
  },
})