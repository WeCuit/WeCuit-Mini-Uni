import { API_DOMAIN } from '../config';
const baseUrl = API_DOMAIN;
/**
 * http请求封装
 * @param method 请求方法类型
 * @param url 请求路径
 * @param data 请求参数
 * @param config 请求配置
 * @param config.responseType 响应类型
 * @param config.header 请求头
 * @param config.loading 请求加载效果 {0: 正常加载, 1: 表单提交加载效果 }
 * @param config.loadingMsg 请求提示信息
 */

function httpBase(method, url, data, config = {}) {
  const requestUrl = (url.indexOf("http") === 0 ? '' : baseUrl) + url;
  const header = {
    'Content-Type': 'application/json'
  };

  if (config.header) {
    for (let h in config.header) {
      header[h] = config.header[h];
    }
  }

  if (config.loading) {
    uni.showLoading({
      title: config.loadingMsg || "提交中...",
      mask: true
    });
  } else {
    uni.showNavigationBarLoading();
  }

  function request(resolve, reject) {
    uni.request({
      url: requestUrl,
      method,
      header,
      data,
      timeout: 4000,
      responseType: config.responseType || 'text',
      success: function (res) {
        console.log("result", res);

        if (config.loading) {
          uni.hideLoading();
        } else {
          uni.hideNavigationBarLoading();
        } // 服务器响应状态码异常检查


        if (res.statusCode !== 200) {
          const resp = res.data;
          console.log(resp);

          if (resp.msg) {
            uni.showToast({
              title: resp.msg,
              icon: 'none'
            });
          }

          reject(res);
          return;
        } // 数据响应体状态码异常检查


        let resp = res.data || {};
        let code = resp.code;

        if (code && code !== 200) {
          if (503 === code) {
            // 维护提示
            uni.reLaunch({
              url: `/pages/maintenance/maintenance?BText=${resp.maintenance.BText}&OText=${resp.maintenance.OText}`
            });
            return;
          } else if (code === 401 // SSO页面请求，不弹框
          && url !== "/Jwgl/loginCheck") {
            // 未登录
            uni.showModal({
              cancelColor: 'red',
              title: "未登录",
              content: "未登录，要去登录页面吗？",
              success: res => {
                if (res.confirm) {
                  //   前往登录页面
                  uni.navigateTo({
                    url: "../my/sso/sso"
                  });
                }
              }
            });
          } else {
            uni.showToast({
              title: resp.msg ? resp.msg : '未知错误',
              icon: "none"
            });
          }

          reject(res);
        } else {
          // 数据包含cookie信息，所以要处理result对象而不是result.data
          resolve(res);
        }
      },
      fail: function (res) {
        if (config.loading) {
          uni.hideLoading();
        } else {
          uni.hideNavigationBarLoading();
        }

        uni.showToast({
          title: "与服务器通信失败",
          icon: "none"
        });
        reject(res);
      }
    });
  }

  return new Promise(request);
}

;

const httpGet = function (url, data = {}, config) {
  return httpBase("GET", url, data, config);
};

const httpPost = function (url, data, config) {
  return httpBase("POST", url, data, config);
};

module.exports = {
  get: httpGet,
  post: httpPost
};