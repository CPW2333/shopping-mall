import {
  request
} from "../../request/request.js"
// import {regeneratorRuntime} from '../../lib/runtime/runtime';


Page({

  data: {
    // 左侧分类
    leftMenuList: [],
    // 右侧商品
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 每次点击不同分类自动顶部开始
    scrollTop: 0,
  },

  // 接口的返回数据
  Cates: [],

  onLoad: function (options) {
    /* 
      0 web的获取方式
        1 localStorage.setItem("key","value") localStorage.getItem("key")
        2 web会存为字符串 小程序不存在类型转换
      1 判断本地缓存有无数据
        1 本地存储的数据格式：
          {time:Date.now(),data[...]}
      2 没有就发送请求
      3 有旧的 也没有过期  就拿旧的数据
     */
    // this.getCates();
    // 1 获取本地存储
    const Cates = wx.getStorageSync("cates");
    // 2  判断
    if (!Cates) {
      // 不存在
      this.getCates();
    } else {
      // 判断有无过期
      if (Date.now() - Cates.time > 1000 * 600) {
        // 重发请求
        this.getCates();
      } else {
        console.log("可以使用旧数据");
        this.Cates = Cates.data;

        // 构造左右两个部分数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 先给一个Cates[0] 后续改动
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }
  },

  // 获取分类数据
  async getCates() {
    /*     request({
            url: '/categories'
          })
          .then(res => {
            // 返回的所有数据
            this.Cates = res.data.message;

            // 进缓存
            wx.setStorageSync("cates", {
              time: Date.now(),
              data: this.Cates
            });

            // 构造左右两个部分数据
            let leftMenuList = this.Cates.map(v => v.cat_name);
            // 先给一个Cates[0] 后续改动
            let rightContent = this.Cates[0].children;
            this.setData({
              leftMenuList,
              rightContent
            });
          }) */

    // 使用es7 的async swait 发送请求
    // 相当于request  .then 一起完成
    const res = await request({
      url: '/categories'
    });
    // 返回的所有数据
    this.Cates = res;

    // 进缓存
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });

    // 构造左右两个部分数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 先给一个Cates[0] 后续改动
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });

  },

  // 左侧菜单点击事件
  handleItemTap(e) {
    /*
      1 获取索引 
      2 给data的currentIndex赋值
      3 根据不同的商品显示不同的内容
    */
    const {
      index
    } = e.currentTarget.dataset;
    // 更新右侧商品数据
    let rightContent = this.Cates[index].children;
    this.setData({
      // 改变索引
      currentIndex: index,
      // 更新右侧商品数据
      rightContent,
      // 重新设置右侧内容scrollview的距离顶部的距离
      scrollTop: 0,
    });

  }
})