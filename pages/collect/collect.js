// pages/collect/collect.js
Page({

  data: {
    // tabs标题
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },
      {
        id:1,
        value:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        value:"浏览足迹",
        isActive:false
      },
    ],

    // 收藏的商品
    collect:[],
  },

  onShow() {
    const collect =wx.getStorageSync("collect")||[];
    this.setData({
      collect
    });
      
  },

  // 处理子组件触发的标题点击事件
  handletabsItemChange(e){
    // console.log(e);
    const {index} = e.detail;
    
    let {tabs} = this.data;
    // e.detail 不能直接写在 forEach
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

})