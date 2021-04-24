/* promise 形式的getSetting */

export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
          
    })
}


/* promise 形式的chooseAddress */

export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
          
    })
}


/* promise 形式的openSetting */

export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
          
    })
}


/* promise 形式的showModal */

export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
              resolve(result);
            },
            fail:(err) => {
                reject(err);
            }
          }); 
          
    })
}

/* promise 形式的showLoading */

export const showLoading=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showLoading({
            title: title,
            mask: true,
            success: (result) => {
                resolve(result);
            },
            fail:(err) => {
                reject(err);
            },
        });      
    })
}

/* promise 形式的showToast */

export const showToast=({title},{icon})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon:icon,
            success: (result) => {
              resolve(result);
            },
            fail:(err) => {
                reject(err);
            }
          }); 
          
    })
}

/* promise 形式的login */

export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result);
            },
            fail:(err) => {
                reject(err);
            },
        });
          
    })
}

/* promise 形式的requestPayment */

export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result);
            },
            fail:(err) => {
                reject(err);
            },
        });
          
          
    })
}