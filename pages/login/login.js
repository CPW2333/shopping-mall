// pages/login/login.js
Page({

  handleGetuserinfo(e) {
    const { userInfo } = e.detail;
    wx.setStorageSync("userinfo", userInfo);

    wx.navigateBack({
      delta: 1
    });
  }
  
})