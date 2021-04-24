import {request} from "../../request/request.js"

Page({

  data: {
    foundGoods:[],

    // 取消按钮是否显示
    isFocus:false,

    // 输入框的值
    inpValue:"",
  },

  // 防抖 防止重复输入发请求 节流 页面下拉上拉相关
  TimeId:-1,

  // 输入框绑定
  handleInput(e) {
    // 获取输入框的值
    const {value} = e.detail;
    // 判断合法性 去空格方法trim
    if(!value.trim()){
      // 不合法
      // 清除定时器
      clearTimeout(this.TimeId);
      this.setData({
        foundGoods:[],
        isFocus:false,
      });

      return;
    }
    
    this.setData({
      isFocus:true,
    })
    // 清除定时器
    clearTimeout(this.TimeId);
    // 开启定时器
    this.TimeId = setTimeout(() => {
      // 发请求
      this.qsearch(value);
    },1500);
  },

  // 取消按钮
  handleCancel() {
    this.setData({
      inpValue:'',
      isFocus:false,
      foundGoods:[],
    });
  },

  // 发请求获取搜索建议
  async qsearch(query) {
    const res = await request({url:"/goods/qsearch",data:{query}});
    this.setData({
      foundGoods:res,
    })

  },
})