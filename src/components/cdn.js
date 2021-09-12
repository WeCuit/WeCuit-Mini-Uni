const rsa = require("../utils/rsa/wx_rsa.js");

import { CDN_SALT } from '../config';
var UPYUN = {};
UPYUN.getCdnToken = function (that, app) {
  var now = Math.round(new Date().getTime() / 1000); // 服务器token有效期10分钟，此处设定本地有效9分钟

  if (app.cdnEtime - now > 60 * 9) {
    // 原理限制签名是固定的，加判断减少不必要的更新，RSA就需要实时
    if (that.data.cdnToken !== app.cdnToken) {
      let str = app.cdnToken + CDN_SALT + app.cdnEtime;
      that.setData({
        cdnToken: app.cdnToken,
        cdnSign: rsa.UTIL.md5(str)
      });
    }

    return;
  }

  uni.login({
    success: res => {
      if (res.code) {
        uni.request({
          url: app.API_DOMAIN + '/Cdn/getCDNToken',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code
          },
          success: res => {
            var data = res.data;

            if (2000 == data.status) {
              var token = data.token;
              app.cdnEtime = that.data.cdnEtime = data.etime;
              app.cdnToken = token;
              let str = token + CDN_SALT + data.etime;
              that.setData({
                cdnToken: token,
                cdnSign: rsa.UTIL.md5(str)
              });
            } else {
              uni.showToast({
                icon: 'none',
                title: data.msg
              });
            }
          }
        });
      }
    },
    fail: err => {
      console.log(err);
    }
  });
}, module.exports = {
  UPYUN: UPYUN
};