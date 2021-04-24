import {request} from "../../request/request.js"


Page({

  data: {
    // tabs标题
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      },
    ],

    // 订单数据
    orders:[],
  },

  // 根据标题索引激活选中 标题数组
  changeTitleByIndex(index) {
    let {tabs} = this.data;
    // e.detail 不能直接写在 forEach
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  // 处理子组件触发的标题点击事件
  handletabsItemChange(e){
    // console.log(e);
    const {index} = e.detail;
    this.changeTitleByIndex(index);

    // 重新发送请求获取订单
    this.getOrders(index + 1);
  },

  // options 只存在onLoad
  onShow() {
    // 判断缓存是否有token 没有就授权
    const token = wx.getStorageSync("token");
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }

    // 获取小程序页面栈 数组索引最大为当前页面 此页面参数存在options
    let pages =  getCurrentPages();
    let currentPages = pages[pages.length-1];
    const {type} = currentPages.options;
    // 获取订单
    this.getOrders(type);

    // 根据type值选中不同标题
    this.changeTitleByIndex(type-1);
  },

  // 获取订单列表
  async getOrders(type) {
    const res = await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.orders.map(v => ({...v, create_time_cn:(new Date(v.create_time*1000).toLocaleString())})),
    })
  },
})