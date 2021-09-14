import request from '../../utils/request';
import {RSAEncrypt} from '../../utils/rsa/index.js'

// 计算机登录
export const ccDoLogin = (id, pass)=>request.post("/Jszx/loginRSAv1/", {
				userId: id,
				userPass: RSAEncrypt(pass)
			})
			
// 获取打卡列表
export const getCheckInList = cookie => request.post('/Jszx/getCheckInListV2', {
  cookie
});

// 获取打卡数据
export const getCheckInData = (cookie, link) => request.post('/Jszx/getCheckInEditV2/', {
  cookie,
  link
});

// 提交打卡数据
export const postCheckInData = (link, JSZXCookie, form) => request.post('/Jszx/doCheckInV3/', {
  link,
  JSZXCookie,
  form
});