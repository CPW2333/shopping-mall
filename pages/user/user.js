import { showToast} from "../../utils/asyncWx.js";

Page({

  data: {
    userInfo:{},
    // 被收藏的商品数量
    collectNum:0,
  },

  onShow() {
    const userInfo = wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync("collect")||[];

    this.setData({
      userInfo,
      collectNum:collect.length,
    });
  },

  showWaiting() {
    showToast({title:"敬请期待！"},{icon:"none"})
  },

  suggestLogin() {
    showToast({title:"请先登录！"},{icon:"none"})
  }
})