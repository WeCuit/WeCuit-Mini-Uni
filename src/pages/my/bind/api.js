import request from "../../../utils/request.js"

// 小程序绑定学生账号
export const postBind = (userId,userPass)=>request.post('/auth/binding/student', {userId,userPass})

// 取得绑定二维码
export const getQRCode = (type)=>request.get(`/auth/binding/mini/${type}`)

// #ifdef MP-WEIXIN
export const getStr2QR = (str, width, height)=>request.get('/Tool/qrCode', {str, width, height})
// #endif