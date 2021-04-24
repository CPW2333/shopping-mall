import { login } from "../../utils/asyncWx.js";
import { request } from "../../request/request.js"


Page({

  data: {

  },

  // 按钮点击
  async handleGetUserInfo(e) {
    try {
      // 获取用户信息
      const { encryptedData, rawData, iv, signature } = e. detail;
      // 获取小程序登录后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      
      // 发送请求 获取token
      const res = await request({url:"/users/wxlogin", data:loginParams, method:"post"})

      // 把token 存入缓存
      wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");

      // 跳回上一页
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  },
})