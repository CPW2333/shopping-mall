import { showToast, showLoading} from "../../utils/asyncWx.js";

Page({

  data: {
    // tabs标题
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      },
    ],
    // 反馈问题分类
    tips:[
      {
        id:0,
        value:"功能建议",
        isActive:true
      },
      {
        id:1,
        value:"购买遇到问题",
        isActive:false
      },
      {
        id:2,
        value:"性能问题",
        isActive:false
      },
      {
        id:3,
        value:"其他",
        isActive:false
      },
    ],
    // 被选中的图片路径数组
    chosenImgs:[],
    // 文本域
    textVal:"",
  },

  // 外网图片路径数组
  UploadImgs:[],

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

  // 选择上传图片
  handleChooseImg() {
    // 调用api
    wx.chooseImage({
      // 同时的选中的数量
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 反复选择图片
          chosenImgs:[...this.data.chosenImgs,...result.tempFilePaths],
        })
      },
    });
  },

  // 点击删除图片
  handleRemoveImg(e) {
    // 获取被点击索引
    const {index} = e.currentTarget.dataset;
    // 获取data中的图片数组
    let {chosenImgs} = this.data;
    // 删除
    chosenImgs.splice(index, 1);

    this.setData({
      chosenImgs,
    })

  },

  // 文本域输入事件
  handleTextInput(e) {
    this.setData({
      textVal:e.detail.value,
    })
  },
  
  // 点击提交
  handleFormSubmit() {
    const {textVal, chosenImgs} = this.data;
    if(!textVal.trim()) {
      showToast({title:"请正确描述您的问题喔！"},{icon:"none"});
      return;
    }

    if(chosenImgs.length != 0){
      // 图片上传 遍历数组上传
      showLoading({title:"正在上传中！"})
      chosenImgs.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://media.mogu.com/image/scale?appKey=15m&w=500&h=500&quality=100',
          filePath: v,
          // 自定义名称 给后台获取数据 file
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            // 必须做解析
            let url = JSON.parse(result.data).result.url;
            this.UploadImgs.push(url);
            console.log(this.UploadImgs);

            if(i === chosenImgs.length - 1) {
              wx.hideLoading();
              this.setData({
                textVal:"",
                chosenImgs:[],
              });
              // this.UploadImgs = [],
              showToast({title:"提交成功！"},{icon:"success"});
            }
          },
        });
      })
    } else {
      this.setData({
        textVal:"",
      });
      showToast({title:"提交成功！"},{icon:"success"});
    }
  },
  
})