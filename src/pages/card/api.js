import request from '../../utils/request'; // 一卡通登录

// 一卡通登录
export const yktLogin = cookie => {
  return request.post("/v3/Card/login", {
    cookie
  });
};

// 获取余额
export const getAccWallet = AccNum => {
  return request.post("/v3/Card/getAccWallet", {
    AccNum
  });
};

// 获取一卡通流水信息
export const getDealRec = data => {
  return request.post("/v3/Card/getDealRec", data);
};