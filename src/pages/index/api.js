import request from '../../utils/request'; // 获取配置

export const getConfig = () => {
  return request.get("/v3/Sys/getConfig");
}; // 获取余额

export const getAccWallet = AccNum => {
  return request.post("/v3/Card/getAccWallet", {
    AccNum
  });
};