// 服务模式[开发-dev? | 测试-test | 上线-prod]
const MODE = 'test'; // RSA公钥，用于加密密码

const RSAPubKey = `YOUR_PUBLIC_RSA_KEY`; // 加密盐

const CDN_SALT = 'YOUR_CDN_SALT';
const QUERY_SALT = 'YOUR_QUERY_SALT';

if (MODE !== 'prod') {
  uni.showModal({
    title: "警告",
    content: '测试模式！！！',
    showCancel: false
  });
}

const API_DOMAIN = {
  dev1: 'http://192.168.1.232:8080',
  dev3: 'http://127.0.0.1:8080',
  test: 'https://test.cuit.api.jysafe.cn',
  prod: 'https://cuit.api.jysafe.cn'
};
module.exports = {
  RSAPubKey: RSAPubKey,
  debug: MODE !== 'prod',
  API_DOMAIN: API_DOMAIN[MODE],
  CDN_SALT: CDN_SALT,
  QUERY_SALT: QUERY_SALT
};