import request from '../../utils/request'; // 获取实验课表首页数据

export const getLabAll = param => {
  return request.post("/v3/Jwc/labAll", param);
}; // 获取实验表详情

export const getLabDetail = param => {
  return request.post("/v3/Jwc/labDetail", param);
};