import { getSetting, chooseAddress, openSetting ,showModal, showToast} from "../../utils/asyncWx.js";

Page({
  data:{
    address:{},
    cart:[],
    // 判断商品全选
    allChecked:false,
    totalPrice:0,
    totalNum:0,
  },

  // 是否显示收货地址
  onShow(){
    // 获取缓存地址
    const address = wx.getStorageSync("address");
    
    // 获取缓存的购物车数据
    const cart = wx.getStorageSync("cart")||[];

    // 计算全选  此方法要每一个都为true 才返回true ,空数组返回值为true
    // const allChecked = cart.length ? cart.every(v=>v.checked):false;

    this.setData({ address });
    this.setCart(cart);

  },
  // 点击按钮获取收货地址
  async handleChooseAddress(){
    /* // 先获取 对收货地址的 权限状态 scope
    wx.getSetting({
      success: (result) => {
        // 属性名称很怪异 使用中括号
        const scopeAddress = result.authSetting["scope.address"];
        // scope=true 或undefined
        if(scopeAddress===true||scopeAddress===undefined){
          // 获取地址
          wx.chooseAddress({
            success: (result1) => {
              
            },
          });
            
        }else{
          // 用户点击取消 诱导打开授权界面
          wx.openSetting({
            success: (result2) => {
              // 调用收获地址代码
              wx.chooseAddress({
                success: (result3) => {
                  
                },
              });
            },
          });  
        }
      },
    }); */
      
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];

      // 判断权限状态
      if(scopeAddress === false){
        // 用户点击取消 诱导打开授权界面
        await openSetting();
      }
      // 获取地址
      let address = await chooseAddress(); 
      // 加了一个all属性 
      address.all= address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 地址加到缓存
      wx.setStorageSync("address", address);
        
    } catch (error) {
      console.log(error);
    }
    
  },

  // 点击商品复选框
  handleItemChange(e) {
    // 获取被点击修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车
    let {cart}  = this.data;
    // 商品对象选中取反
    let index = cart.findIndex(v => v.goods_id === goods_id );
    cart[index].checked = !cart[index].checked;
    
    this.setCart(cart);

  },

  // 设置购物车状态 重新计算 底部工具栏数据
  setCart(cart) {
    
    // 重新计算总价格 总数量
    let allChecked = true;

    // 数量编辑
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked = false;
      }
    })

    // 判断cart是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    // 重新设置data
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    });

    // 重新设缓存
    wx.setStorageSync("cart", cart);
  },

  // 商品全选
  handleItemAllChecked() {
    // 获取data数据
    let {cart, allChecked} = this.data;
    // 取反
    allChecked = !allChecked;
    // 循环修改商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 重新填会data 缓存
    this.setCart(cart);
  },

  // 商品数量编辑
  async handleItemNumEdit(e) {

    const { operation, id} = e.currentTarget.dataset;

    //  获取购物车数组
    let {cart} = this.data;
    
    // 找到要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);

    // 数量只剩1 点击-
    if(cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const result = await showModal({content:"你是否要删除该商品？"});
      if (result.confirm) {
        // 删除
        cart.splice(index,1);
        this.setCart(cart);
      } else if(result.cancel){
        console.log("不删除");
      }
    } else {
      // 修改数量
      cart[index].num += operation;
  
      // 设置回data 缓存
      this.setCart(cart);
    }
  },

  // 点击结算
  async handlePay() {
    // 判断收货地址数据
    const { address, totalNum } = this.data;
    if(!address.userName){
      // 无地址
      await showToast({title:"请先选择收货地址！"},{icon:"none"});
      return;
    }

    // 判断有无商品
    if(totalNum === 0) {
      await showToast({title:"您还没有心仪的宝贝哦！"},{icon:"none"});
      return;
    }

    // 界面支付
    wx.navigateTo({
      url: '/pages/pay/pay',
    });
      
  },
})