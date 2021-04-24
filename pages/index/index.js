// 0 引入用来发送请求的方法 路径要补全
//   引入async语法 目前版本增强编译已经支持 不需要引入 勾不勾选增强编译都行
import {request} from "../../request/request.js"
// import {regeneratorRuntime} from '../../lib/runtime/runtime';


//  敲wx-page自动补全
Page({
    data: {
        // 轮播图数组
        swiperList: [],
        // 分类导航数组
        catesList:[],
        // 楼层数组
        floorList:[],
    },
    // 页面加载就触发
    onLoad: function (options) {
        /* // 以下传统方法请求
        // 发送异步请求获取轮播图数据 小程序的request api可以获取
        // 可以通过es6 的 promise 优化请求代码
        wx.request({
            url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
            // data: {},// 发什么数据给后台
            // header: {'content-type':'application/json'},//请求头 
            // method: 'GET',//默认的方式
            // dataType: 'json',//有默认值
            // responseType: 'text',//有默认值
            success: (result) => {
                console.log(result);
                this.setData({
                    swiperList:result.data.message
                })
            },
            // fail: () => {},
            // complete: () => {}
        }); */

        this.getSwiperList();
        this.getCatesList();
        this.getFloorList();

    },

    // 获取轮播图数据
    getSwiperList() {
        request({url:"/home/swiperdata"})
        // 成功后
        .then(res=>{
            this.setData({
                swiperList:res
            })
        })
    },
    
    // 获取分类导航数据
    getCatesList() {
        request({url:"/home/catitems"})
        // 成功后
        .then(res=>{
            this.setData({
                catesList:res
            })
        })
    },
    
    // 获取楼层数据
    getFloorList() {
        request({url:"/home/floordata"})
        // 成功后
        .then(res=>{
            this.setData({
                floorList:res
            })
        })
    },
});