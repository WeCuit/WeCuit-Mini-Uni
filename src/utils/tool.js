import wx_rsa, { UTIL } from './rsa/wx_rsa';
import { QUERY_SALT } from '../config';
/**
 * 
 * @param {*} path /??/???/
 */

export const genQuerySign = function genQuerySign(path, openid, str_data = '') {
  if ("string" !== typeof openid || openid.length == 0) {
    uni.showToast({
      icon: 'none',
      title: 'openid异常'
    });
    return 'false';
  }

  let md5 = UTIL.md5;
  return md5(md5(path) + md5(openid) + md5('' + str_data) + QUERY_SALT);
}

export const calByte2Size = (size, n=2) =>{
	let result = size;
	if(result < 1024)return `${result.toFixed(n)}字节`
	result /= 1024;
	if(result < 1024)return `${result.toFixed(n)}KB`
	result /= 1024;
	if(result < 1024)return `${result.toFixed(n)}MB`
	result /= 1024;
	if(result < 1024)return `${result.toFixed(n)}GB`
}
