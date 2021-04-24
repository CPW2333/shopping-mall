import {request} from "../../request/request.js"
import { showToast} from "../../utils/asyncWx.js";

Page({

  data: {
    // tabs标题
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    // 商品列表
    goodsList:[],
  },

  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  // 总页数
  totalPages:1,

  onLoad: function (options) {
    // options 是页面启动参数 就是category标签设置的cid
    // console.log(options);
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList(){

    const res = await request({url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil( total / this.QueryParams.pagesize);
    this.setData({
      // 数组拼接
      goodsList:[...this.data.goodsList,...res.goods]
    });
    // 刷新等待效果关闭 没有下拉刷新也不会影响
    wx.stopPullDownRefresh();
      
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

  // 滚动条触底就加载下一页
  onReachBottom(){
    /* 判断有无下一页
        获取总页数
        总页数 = Math.ceil(总条数 / 页容量)
          这个天花板函数向上取整
     */
    if(this.QueryParams.pagenum>=this.totalPages){
      // 没有下一页
      showToast({title:"到底啦！"},{icon:"none"})
       
        
    }else{
      // 还有下一页
      /* 页码++ 重新发送请求 拼接 goodsList 数组 */
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  // 下拉刷新下一页 请求回来需要手动关闭刷新等待
  onPullDownRefresh(){
    // 重置数组 页码 重发请求
    this.setData({
      goodsList:[],
    });
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  },

  // 点击销量、价格
  handleItemTap() {
    showToast({title:"敬请期待！"},{icon:"none"})
  },

})