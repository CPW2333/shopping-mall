// 同时发送异步代码的数量
let ajaxTimes=0;

export const request = (params) => {
    // 判断是否需要加请求头
    let header = {...params.header};
    if(params.url.includes("/my/")) {
        // 拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }

    // 调用一次就++
    ajaxTimes++;

    // 数据发送前显示加载中
    wx.showLoading({
        title: "加载中！",
        mask: true,
    });    

    // 定义公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    // const baseUrl = "https://wjforwk.xyz:8888/api/private/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            /* 解构出参数 传过来的参数为{ url:"" } 键值对 */
            ...params,
            /* url拼接 */
            header:header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
                console.log(result.data.message);
            },
            fail: (err) => {
                reject(err);
                console.log("数据请求失败！");
            },
            complete: ()=> {
                // 请求回一个就--
                ajaxTimes--;
                if(ajaxTimes===0){
                    // 关闭加载中提示
                    wx.hideLoading();
                }
            }
        });

    })
}