import request from './utils/request'; // 获取用户信息

export const getUserInfo = code => {
  return request.get("/v3/Sys/getUserInfoV2", {
    code
  });
}; // 获取一卡通信息

export const getAccWallet = AccNum => {
  return request.post("/v3/Card/getAccWallet", {
    AccNum
  });
};